## System Overview

**Git-for-Ideas** is an AI-powered document evolution tracking system that helps users understand how their writing changes over time and enhance writing using AI agents. The system uses:

- **PostgreSQL** (via Supabase) for persistent storage
- **FastAPI** for the backend REST API
- **Next.js** for the frontend

### High-Level Architecture

```
┌─────────────┐      HTTP/WS       ┌──────────────┐      SQL       ┌────────────┐
│   Next.js   │ ◄───────────────►  │   FastAPI    │ ◄────────────► │ PostgreSQL │
│   Frontend  │                    │   Backend    │                │  (Supabase)│
└─────────────┘                    └──────────────┘                └────────────┘
                                          │
                                          │ OpenAI API
                                          ▼
                                   ┌──────────────┐
                                   │  Background  │
                                   │    Worker    │
                                   └──────────────┘
```

---

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

