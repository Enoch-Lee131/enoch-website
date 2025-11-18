

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐
│    users     │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼───────┐
│  workspaces  │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼───────┐       ┌──────────────┐
│   projects   │───────│   branches   │
└──────┬───────┘  1:N  └──────────────┘
       │ 1
       │
       │ N
┌──────▼────────┐      ┌──────────────┐
│   versions    │──────│    diffs     │
└───────────────┘ 1:N  └──────────────┘
       │
       │ N:N
       ▼
┌────────────────┐
│  trajectories  │
└────────────────┘
```

---

### 1. Idempotency Patterns

**Definition**: An idempotent operation produces the same result no matter how many times it's executed.

#### Why Idempotency Matters

With idempotency:
```
User pastes content → Auto-creates version → Network timeout → Request retries
Result: Same version returned, no duplicate 
```

**Note**: In this system, version creation is **automatic** based on drift detection, not user-initiated. When content changes significantly enough (drift ≥ threshold), a new version is created automatically.

#### Implementation: Idempotency Keys

**Jobs Table**:
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,  -- ← Key field
    project_id UUID,
    payload JSONB,
    status VARCHAR(20)
);
```

**How It Works**:

```python
# app/services/job_queue_service.py

async def enqueue_job(project_id, job_type, payload):
    # Generate deterministic idempotency key
    idempotency_key = f"{project_id}:{job_type}:{hash(payload)}"

    # Check if job already exists
    existing = await db.fetch_one(
        """
        SELECT id, status, result FROM jobs
        WHERE idempotency_key = :key
        AND status IN ('queued', 'processing', 'completed')
        AND created_at > NOW() - INTERVAL '5 minutes'
        """,
        {"key": idempotency_key}
    )

    if existing:
        # Job already exists - return existing result
        if existing['status'] == 'completed':
            return existing['result']
        else:
            return {"status": "pending", "job_id": existing['id']}

    # Create new job (UNIQUE constraint prevents duplicates)
    try:
        job_id = await db.fetch_val(
            """
            INSERT INTO jobs (project_id, job_type, payload, idempotency_key)
            VALUES (:project, :type, :payload, :key)
            RETURNING id
            """,
            {
                "project": project_id,
                "type": job_type,
                "payload": payload,
                "key": idempotency_key
            }
        )
        return {"status": "queued", "job_id": job_id}
    except UniqueViolationError:
        # Race condition: Job was created between our check and insert
        # Re-fetch the existing job
        return await enqueue_job(project_id, job_type, payload)
```

**Key Points**:
- Idempotency key = `{project_id}:{job_type}:{content_hash}`
- UNIQUE constraint on `idempotency_key` prevents duplicates at DB level
- Time window (5 minutes) allows re-processing old requests

#### Real-World Example

**Scenario**: User pastes content, triggering trajectory analysis

```
Request 1: POST /versions/check-create
  → Creates job with idempotency_key = "abc123:trajectory:xyz789"
  → Job ID: job-001
  → Status: queued

Request 2: POST /versions/check-create (duplicate, network retry)
  → Tries to create job with same idempotency_key
  → UNIQUE constraint violation
  → Returns existing job-001
  → Status: processing (or completed)
```
