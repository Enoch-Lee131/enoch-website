---
title: "Inside the Database Architecture of a Git-for-Ideas System"
description: "A recruiter-friendly, deeply technical walk-through of how the database powers semantic versioning, drift detection, AI analysis, and document evolution."
---

# Inside the Database Architecture of a Git-for-Ideas System
*A recruiter-friendly, technically rigorous breakdown of how the backend tracks meaning, not just text.*

This system acts like “Git for writing”—not by diffing characters, but by **understanding semantic change**.  
Every meaningful shift in the user’s draft becomes a version. The database is where that intelligence is orchestrated.

This article explains how the database architecture works, without drowning you in schemas or SQL. It is written for hiring managers, technical recruiters, and engineering leads evaluating system-design depth.

Source: <!-- citation required --> :contentReference[oaicite:0]{index=0}

---

# 1. Why the Database Matters
Most note-taking tools treat a document as a snapshot.  
This system treats a document as a **storyline**.

The backend must answer questions like:

- *What changed—and why does it matter?*  
- *Did the user’s intent shift?*  
- *Which versions belong to the same branch?*  
- *Has this analysis already been computed before?*  
- *Can the system guarantee exactly-once version creation?*

The database makes all of this possible by combining:

- git-style ancestry  
- semantic drift metrics  
- AI-generated narratives  
- background processing  
- multi-layer caching  
- strict idempotency controls

---

# 2. A Version Tree, Not a List
Traditional document systems use linear history.  
This one uses a **branching version tree**, similar to Git but built for natural language.


     Project
        │
        ▼
    ┌─────────┐
    │ Version │ 1 (root)
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │ Version │ 2
    └────┬────┘
         │
     ┌───┴─────────┐
     ▼             ▼
┌─────────┐   ┌──────────┐
│Version 3│   │Version 3a│  ← fork/branch
└─────────┘   └──────────┘


Each version stores:

- full document text  
- semantic drift metrics  
- paragraph embeddings  
- short AI-generated title  
- a `parent_version_id`  
- a `branch_id`  
- an AI narrative of changes  

This structure enables rich evolution maps without the complexity of merge conflicts.

---

# 3. The Six Tables That Make the System Work

## 3.1 `projects`
A container for a long-form storyline.  
It defines ownership, workspace grouping, and isolation.

## 3.2 `versions`
The backbone of the entire system.

Each version is a **complete snapshot plus semantic metadata**, including:

- global drift  
- local drift  
- cumulative drift  
- contradiction detection  
- paragraph embeddings  
- narrative summary  
- branch tracking  
- idempotency metadata  
- version ordering  

This is the time machine.

## 3.3 `diffs`
A semantic companion to Git’s diffs.

Each diff includes:

- human-readable change summary  
- similarity score  
- drift signal set  
- drift category  
- narrative of the shift  

It measures changes not by lines added, but by *meaning*.

## 3.4 `jobs`
The asynchronous engine.

A strict rule enforced at the DB level:  
**Only one active job per project at a time.**

This prevents race conditions and ensures version trees are generated sequentially and consistently.

## 3.5 `embedding_cache`
A global cache of embeddings.  
If identical text appears anywhere in the system, the embedding is reused instantly.

## 3.6 `writing_insights`
Powers the real-time AI Writing Coach.

Insights are keyed by a **SHA-256 content hash**, meaning:

- If the content hasn’t changed, the insights return instantly.  
- Zero repeated OpenAI calls for the same text.

---

# 4. Two-Layer Idempotency: The System’s Safety Net
Auto-generating new versions is risky without safeguards.  
Retries, worker crashes, and network drops can cause duplicates.

To prevent this, the system uses **two layers** of idempotency:

## Layer 1: Job-Level Idempotency  
Each job has a deterministic `idempotency_key`.

If a duplicate request arrives, PostgreSQL returns the existing job instead of creating a new one.

## Layer 2: Version-Level Idempotency  
Each version can include a `job_effect_key`.

A unique constraint ensures:

**One job can produce at most one version per project.**

Even if the background worker restarts, the database enforces exactly-once semantics.

This is critical for drift-based versioning.

---

# 5. Automatic Versioning Through Drift Detection
The system computes several drift metrics (global, local, cumulative, contradiction).

If drift exceeds a threshold:

1. A version is created  
2. A semantic diff is generated  
3. A narrative is produced  
4. A job is queued for deeper trajectory analysis  
5. The UI updates in real time  

If drift is low, no version is created—avoiding clutter.

This transforms raw editing into **semantic checkpoints**.

---

# 6. A Cache Designed for Instant Response
Every AI-powered feature is accelerated through a three-layer cache:
L1: In-memory cache <1ms
L2: Postgres cache ~50ms
L3: OpenAI API seconds


The system nearly always returns in L1 or L2, because:

- content hashes dedupe insight generation  
- embedding_cache dedupes vector generation  
- job idempotency dedupes version creation  

The result:  
Experiences that feel instantaneous—even though heavy AI analysis is involved.

---

# 7. Background Jobs as the “Thinking Layer”
Background jobs handle:

- semantic diffing  
- trajectory analysis  
- drift classification  
- narrative generation  
- cleanup  

A dedicated worker polls the queue, executes work, writes results, and enforces:

- retry logic  
- failure tracking  
- cleanup of old jobs  
- project-level exclusivity  

The database guarantees correctness—even if the worker crashes or restarts.

---

# 8. Why This Architecture Stands Out
This isn’t document storage.  
It’s **semantic version control**.

The database:

- guarantees strict correctness  
- handles branching history  
- protects against duplicates  
- maintains semantic understanding  
- supports real-time coaching  
- powers a research agent  
- scales through caching and async jobs  

It captures not just *what changed*, but **how the writer’s intent evolved**.

This design is the foundation for a tool that understands writing as a living process, not a static artifact.

---

# Diagram: High-Level Flow

User Writes
     │
     ▼
 Semantic Drift Engine
     │
     ├── Drift < Threshold → No Version Created
     │
     └── Drift ≥ Threshold → Create Version
               │
               ▼
       Versions & Diffs Tables
               │
               ▼
         Queue Background Job
               │
               ▼
        Worker Performs Analysis
               │
               ▼
          Update Version Metadata
               │
               ▼
          UI Evolution Graph
