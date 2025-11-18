# API Reference

## Base URL

```
Production: https://api.git-for-ideas.com
Development: http://localhost:8000
```

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <your_token_here>
```

---

## Documents

### Create Document

```http
POST /api/documents
```

**Request Body:**
```json
{
  "title": "My Document",
  "content": "Initial content",
  "workspace_id": "uuid",
  "project_id": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "My Document",
  "created_at": "2025-01-15T10:30:00Z",
  "version_id": "uuid"
}
```

### Get Document

```http
GET /api/documents/{document_id}
```

**Query Parameters:**
- `version_id` (optional): Specific version to retrieve

**Response:**
```json
{
  "id": "uuid",
  "title": "My Document",
  "content": "Current content",
  "current_version": "uuid",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T14:20:00Z"
}
```

---

## Versions

### Create Version

```http
POST /api/versions
```

**Request Body:**
```json
{
  "document_id": "uuid",
  "content": "Updated content",
  "commit_message": "Added introduction section",
  "parent_version_id": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "document_id": "uuid",
  "version_number": 5,
  "commit_message": "Added introduction section",
  "created_at": "2025-01-15T14:20:00Z"
}
```

### Get Version History

```http
GET /api/documents/{document_id}/versions
```

**Response:**
```json
{
  "versions": [
    {
      "id": "uuid",
      "version_number": 5,
      "commit_message": "Added introduction",
      "created_at": "2025-01-15T14:20:00Z",
      "author": "user@example.com"
    },
    // ...more versions
  ]
}
```

---

## Diffs

### Generate Diff

```http
POST /api/diff
```

**Request Body:**
```json
{
  "version_a_id": "uuid",
  "version_b_id": "uuid",
  "diff_type": "semantic" // or "character"
}
```

**Response:**
```json
{
  "diff": [
    {
      "type": "delete",
      "content": "Old paragraph",
      "position": 0
    },
    {
      "type": "insert",
      "content": "New paragraph",
      "position": 1
    }
  ],
  "summary": "Replaced introduction with more concise version"
}
```

---

## AI Analysis

### Analyze Document

```http
POST /api/ai/analyze
```

**Request Body:**
```json
{
  "version_id": "uuid",
  "analysis_type": "grammar" // or "style", "clarity", "tone"
}
```

**Response:**
```json
{
  "analysis": {
    "score": 85,
    "suggestions": [
      {
        "type": "grammar",
        "position": 42,
        "issue": "Subject-verb agreement",
        "suggestion": "Use 'are' instead of 'is'"
      }
    ]
  }
}
```

### Get AI Suggestions

```http
POST /api/ai/suggest
```

**Request Body:**
```json
{
  "version_id": "uuid",
  "context": "Make this more concise"
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "type": "rewrite",
      "original": "Long paragraph...",
      "suggested": "Concise version...",
      "rationale": "Removed redundant phrases"
    }
  ]
}
```

---

## Branches

### Create Branch

```http
POST /api/branches
```

**Request Body:**
```json
{
  "project_id": "uuid",
  "name": "experiment-1",
  "source_version_id": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "experiment-1",
  "created_at": "2025-01-15T15:00:00Z"
}
```

### List Branches

```http
GET /api/projects/{project_id}/branches
```

**Response:**
```json
{
  "branches": [
    {
      "id": "uuid",
      "name": "main",
      "is_default": true,
      "version_count": 15
    },
    {
      "id": "uuid",
      "name": "experiment-1",
      "is_default": false,
      "version_count": 3
    }
  ]
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "details": "Missing required field: title"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "details": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "details": "Document with id 'xyz' does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred"
}
```

---

## Rate Limits

- **Free tier**: 100 requests/hour
- **Pro tier**: 1000 requests/hour
- **Enterprise**: Custom limits

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642258800
```
