# Inside the Database That Powers Git-for-Ideas

**How we store, track, and analyze the evolution of your writing**

---

When you write, your ideas evolve. Paragraphs shift. Concepts deepen. Entire sections take on new meaning. **Git-for-Ideas** was built to trace those transformations—not just save snapshots.

To make that possible, the platform uses a carefully designed database architecture that captures how a document grows, branches, drifts, contradicts itself, and circles back. This post is a behind-the-scenes tour of that database layer and how it supports the entire system.

---

## How the System Thinks About Writing

Most writing tools store documents as static blobs. Git-for-Ideas does the opposite:

- ✅ **Every edit becomes part of a version graph**
- ✅ **Each version includes semantic paragraph embeddings**
- ✅ **Differences between versions are computed and stored**
- ✅ **A background worker produces AI-assisted narratives** that explain how your writing changed

All of this lives in a relational schema designed for speed, integrity, and long-term evolution tracking.

Let's go layer by layer.

---

## The Core Building Blocks

Below is a simplified architecture diagram showing how data flows across the most important parts of the system.

> **User → Workspace → Project → Versions → Diffs → Jobs → AI Insights**

```
┌──────────┐      1:N      ┌──────────────┐      1:N      ┌───────────────┐
│  Users   │ ───────────►  │  Workspaces  │ ───────────►  │    Projects    │
└──────────┘               └──────────────┘               └───────────────┘
                                                                   │ 1:N
                                                                   ▼
                                                           ┌──────────────┐
                                                           │   Versions   │◄───────────┐
                                                           └──────────────┘            │
                                                                   │ 1:1               │
                                                                   ▼                   │
                                                           ┌──────────────┐            │
                                                           │    Diffs     │ ───────────┘
                                                           └──────────────┘
                                                                   │
                                                                   ▼
                                                           ┌──────────────┐
                                                           │    Jobs      │
                                                           └──────────────┘
```

This graph-like structure is the backbone that lets Git-for-Ideas behave **more like GitHub for documents** than Google Docs.

---

## Projects: Where Your Ideas Live

A **project** is a container for the evolution of a single document.

Inside a project, you'll find:

- 📄 All **versions** of the document
- 🌿 **Branches** and forks
- 📊 **Semantic drift** metadata
- 🤖 **AI-generated narratives**
- 🔍 **Diff summaries**
- ⚙️ Job history and background insights

Projects also sit inside **Workspaces**, so you can organize writing logically—essays, research, product specs, novels, etc.

---

## Versions: The Heart of Everything

Each time your document changes enough to matter, the system creates a new entry in the `versions` table.

### What a Version Contains

| Field | Description |
|:------|:------------|
| **Full content** | The complete document text at this snapshot |
| **Node title** | A short AI-generated title describing this version |
| **Paragraph embeddings** | Semantic vectors for each paragraph |
| **Branch & parent pointers** | Links to previous versions and alternate branches |
| **Drift counters** | Quantified measures of content evolution |
| **Shift narrative** | AI explanation of what changed and why |
| **Idempotent key** | Guarantees exactly-once creation |

This is what turns your writing into a **true evolution graph**.

### Diagram: Version Tree Structure

```
          (Root)
            V1
             │
             ▼
            V2
           /  \
         V3    V4
         │      \
         ▼       ▼
        V5       V6
```

> **Note**: Branches form naturally whenever the system detects that content has drifted into a new direction.

---

## Paragraph Embeddings: How We Track Meaning

Every version stores **semantic embeddings** for each paragraph.

Think of them as numerical fingerprints that help the system answer:

- 🔄 Which paragraphs stayed similar?
- 📈 Which ones drifted or contradicted earlier thinking?
- 💡 Did a new idea emerge?
- 🔁 Did you revisit or refine an old section?

These embeddings power **paragraph-level drift calculation**, one of the core signals behind version creation and narrative generation.

---

## Diffs: Understanding What Changed

The `diffs` table stores AI-computed relationships between consecutive versions:

### Key Questions a Diff Answers

- How similar is V3 to V2?
- Which paragraphs changed the most?
- Is the change a refinement, expansion, or major shift?
- Did you contradict an earlier argument?

### Diff Data Structure

A single diff row contains:

```
┌─────────────────────────┐
│ Text Summary            │  Brief description of changes
├─────────────────────────┤
│ Similarity Score        │  0.0 to 1.0 (cosine similarity)
├─────────────────────────┤
│ Four Drift Signals      │  Refinement, Expansion, Shift, Contradiction
├─────────────────────────┤
│ Drift Category          │  Classification of change type
├─────────────────────────┤
│ Narrative               │  AI-generated explanation
└─────────────────────────┘
```

This data helps the UI draw the evolution graph and helps the system decide when your content deserves a new version.

---

## Jobs: The System's Background Brain

Whenever a new version is created, a **background job** runs:

| Step | Action |
|:----:|:-------|
| **1** | Computes fresh semantic signals |
| **2** | Generates AI-driven narratives |
| **3** | Updates drift counters |
| **4** | Cleans up stale jobs |
| **5** | Ensures consistent analysis |

> **Performance Note**: A partial unique index ensures only one active job per project, preventing runaway job creation if a user pastes content rapidly.

This keeps the system stable and predictable.

---

## Embedding & Insight Caches: Speed + Cost Efficiency

To avoid unnecessary API calls, the database includes two powerful caching layers:

### 1. `embedding_cache`

Stores text embeddings globally so repeated paragraphs don't cost money.

**Example:**
```
Input:  "Machine learning is transforming healthcare..."
Check:  Hash already exists in cache?
Result: ✓ Return cached embedding (0ms, $0.00)
        ✗ Call OpenAI API → cache result (200ms, $0.0004)
```

### 2. `writing_insights`

A content-hash–based cache for AI writing insights.

**Logic:**
```
Same text = Same insights = Instant result
```

> **Cost Impact**: This caching layer alone reduces AI costs by **~80%**.

---

## OpenAI Metrics: Transparent Cost Tracking

The `openai_metrics` table logs every API call:

- 🤖 Model used (`gpt-4`, `text-embedding-ada-002`, etc.)
- 📞 Call type (chat or embeddings)
- 📊 Token usage (prompt + completion)
- 💰 Cost in USD
- 👤 Associated user and project

This powers your internal dashboards and ensures the platform remains cost-efficient at scale.

---

## Bringing It All Together

Here's a final high-level data-flow diagram showing how your writing turns into a semantically tracked evolution tree.

```
    User Writes
        │
        ▼
  Drift Detection
        │
        ├─ Small change → Update insights only
        │
        └─ Significant change → Create new version
                     │
                     ▼
              Create Version
                     │
                     ▼
              Insert Diff Row
                     │
                     ▼
         Queue AI Trajectory Job
                     │
                     ▼
           Background Worker
                     │
                     ▼
         Generate Narratives + Signals
                     │
                     ▼
           Update Version Tree
                     │
                     ▼
        UI Renders Evolution Graph
```

---

## The Result

What you get is a database that doesn't just **store** your writing—it **understands** it.

Every version is contextualized. Every change is analyzed. Every insight is cached for speed. And the entire system is built to scale gracefully as your ideas grow.

This is what makes Git-for-Ideas fundamentally different from traditional document editors: **it treats writing like code**, with branches, diffs, and semantic analysis at every layer.

---

**Want to see how this works in practice?** Check out the [Architecture Overview](./architecture.md) to see how the database connects with the API layer, background workers, and frontend.
