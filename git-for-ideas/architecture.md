# System Architecture

## High-Level Overview

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

## Frontend (Next.js)

### Key Components
- **Editor**: Rich text editor for document creation/editing
- **Version Tree**: Visual representation of document versions
- **Diff Viewer**: Side-by-side or inline diff display
- **AI Assistant**: Chat interface for AI suggestions

### State Management
- React Context for global state
- React Query for server state management
- Local state for editor content

## Backend (FastAPI)

### API Endpoints
- `/api/documents` - CRUD operations
- `/api/versions` - Version management
- `/api/diff` - Generate diffs between versions
- `/api/ai/analyze` - AI analysis endpoint
- `/api/ai/suggest` - AI suggestions endpoint

### Background Workers
- **Diff Calculation**: Compute semantic diffs asynchronously
- **AI Analysis**: Queue AI processing for large documents
- **Trajectory Generation**: Build version history graphs

## Database (PostgreSQL)

See [Database Documentation](database.md) for full schema details.

## Deployment

### Frontend
- **Platform**: Vercel
- **CDN**: Vercel Edge Network
- **Build**: Next.js static optimization

### Backend
- **Platform**: Railway
- **Auto-scaling**: Based on request volume
- **Monitoring**: Sentry for error tracking

### Database
- **Provider**: Supabase
- **Backups**: Daily automated backups
- **Replication**: Real-time replication enabled

## Security

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Row-level security in PostgreSQL
- **API Rate Limiting**: Per-user rate limits
- **Data Encryption**: At rest and in transit

## Performance Considerations

- **Caching**: Redis for frequently accessed data
- **CDN**: Static assets served from edge locations
- **Database Indexing**: Strategic indexes on frequently queried columns
- **Lazy Loading**: Large documents loaded incrementally
