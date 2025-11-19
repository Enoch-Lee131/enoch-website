# Database Architecture

---

## 1️⃣ The Core Philosophy: Meaning Before Material

In Git-for-Ideas, the database doesn't ask,
**"What did the writer type?"**
It asks,
**"Did the writer's thinking actually change?"**

To answer that, the system watches **four kinds of drift**:

- 🌍 **Global drift** — overall semantic distance
- 📝 **Local drift** — paragraph-level changes
- 📊 **Cumulative drift** — build-up of small shifts
- ⚠️ **Contradiction drift** — reversals or breaks in logic

Only when these signals cross certain thresholds does the system decide:
**"This isn't just editing — this is a new idea."**

That decision determines how the database stores your work.

---

## 2️⃣ Projects: The Container for Evolving Documents

A **project** represents one piece of writing:
an essay, a chapter, a long-form exploration, a research note.

Inside a project lives its **entire evolutionary timeline**.

Projects are lightweight. Their purpose is simply to anchor the version history, branch structure, diffs, and metadata that accumulate as you write.

---

## 3️⃣ Versions: Snapshots of Meaningful Change

**Versions** are the heart of the system.

A version is **not** created every time you type.
It appears only when your content's **meaning has drifted substantially**.

### 📦 Each version stores:

- The **full text** as it existed at that moment
- The **paragraph breakdown** and their embeddings
- A **short title** summarizing the change
- A **pointer to the parent version**
- A **branch association** when needed
- An **AI-generated "shift narrative"** describing what changed

Together, versions form a **tree**, not a simple linear timeline.

If you restore an older version and begin writing from there, the database treats this as a **fork in your thinking** — creating a new branch in the version tree.

> **No automatic branching.**
> **No hidden heuristics.**
> Branches only happen when you intentionally diverge.

---

## 4️⃣ How the System Decides to Create a Version

Every time you submit updated content, the backend **computes semantic drift**:

1. It **embeds** your new paragraphs.
2. It **compares** them to the previous version's paragraphs.
3. It **calculates** the four drift signals.
4. It **decides** whether meaning has moved far enough.

### 📉 If drift is low:

- ❌ No version is created.
- ✅ Only real-time writing insights update.

### 📈 If drift crosses the threshold:

- ✅ A new version is created.
- ✅ A semantic diff is computed.
- ✅ A background job is scheduled to generate richer analysis.

This is what keeps the database clean — **full of meaningful nodes, not noise**.

---

## 5️⃣ The Diff Layer: Understanding What Changed

Whenever a new version is created, the system stores a **semantic diff** between the new version and its parent.

### 🔍 A diff captures:

- The **similarity score**
- The **drift category** (minor → moderate → major)
- Detailed **drift signals**
- A **natural-language explanation** of the shift

This is what powers the graph visually — not just that something changed, but **how** it changed.

> **Diffs don't create versions.**
> They follow them.
> The flow is strictly **Versions → Diffs**, not the other way around.

---

## 6️⃣ Branches: A Tree of Possibilities

**Branches** are a direct reflection of your creative process.

Restore version 3 of a 10-version project, make new changes, and you've created a branch. The system:

- Sets the `parent_version_id` to the restored version
- Associates the new version with a **branch lineage**
- Updates **depth and ordering information**

### 🌿 Branches are there so you can:

- Explore **alternate structures**
- Experiment with **tone or direction**
- Preserve **discarded paths** without losing history

**It's writing as a tree, not a line.**

---

## 7️⃣ Jobs: The Silent Backbone of AI Processing

Some actions require **heavy computation** — like generating narratives that summarize how meaning changed.

To keep the app fast, these tasks run **asynchronously** as background jobs.

### ⚙️ The job system enforces strict rules:

- ✅ Only **one active job per project**
- ✅ Duplicate jobs **collapse into a single one**
- ✅ Retries return the **same result** instead of creating duplicates

This guarantees **consistent, exactly-once behavior** no matter how often the client retries due to network issues.

It's **reliability engineering baked directly into the database design**.

---

## 8️⃣ Caching: The Engine of Speed and Cost Efficiency

Two caches make the system scalable:

### 1. 🗄️ Embedding Cache

Stores **vector embeddings** of text segments.
If the same text appears again — anywhere in the system — the embedding is **reused**.

### 2. 💡 Writing Insight Cache

Uses a `content_hash` to detect when insights can be reused.
Real-time feedback becomes **nearly instant** because the system rarely recomputes.

### 🚀 Together, these caches reduce:

- **API calls**
- **Latency**
- **Cost**

Most importantly, they keep the **user experience flowing**.

---

## 9️⃣ Idempotency: No Duplicates, Ever

Writing tools must handle **messy user behavior**:

- Spamming "save"
- Slow networks
- Rapid-fire pastes
- Reconnecting clients

**Idempotency** ensures the database stays clean.

### 🔐 There are two layers:

#### Layer 1 — Job Idempotency

Same job → same key → **no duplicates**.

#### Layer 2 — Version Idempotency

If a background job retries, the version **isn't recreated**.

The system guarantees **one version per meaningful edit, period**.

---

## 🔟 The Database as a Mirror of Thought

When you step back, the architecture **mirrors the shape of thinking**:

- ✅ **Versions** capture shifts in meaning.
- ✅ **Branches** reflect exploration.
- ✅ **Diffs** explain transitions.
- ✅ **Caches** preserve efficiency.
- ✅ **Idempotency** ensures clarity.

It's a system built not just to **store** text, but to **understand** it — structurally, semantically, historically.

A database designed for writing that **grows, diverges, and returns again**.

**A database designed for ideas.**

---
