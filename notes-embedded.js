// Embedded notes fallback - works without a local server
// This file is auto-generated from /notes/*.md files
// Run 'node sync-notes.js' to regenerate after editing notes

const EMBEDDED_NOTES = {
    'cot-without-prompting': {
        metadata: {
            title: 'CoT Reasoning Without Prompting',
            date: '2025-10-03',
            tags: ["LLM","Reasoning","Decoding","AI Research"],
            summary: 'Paper explores how chain-of-thought reasoning can emerge without explicit prompting, by modifying decoding strategies instead of altering the training or input prompts.'
        },
        content: `## Motivation

**Problem:** Current Chain-of-Thought (CoT) reasoning in LLMs is typically elicited via prompt engineering (few-shot, zero-shot, instruction tuning).

**Issues with prompting:**
• Requires manual, task-specific engineering
• Hard to separate model's intrinsic reasoning ability, or if they are just mimicking human-provided reasoning formats
• Instruction-tuning with CoT data improves performance but is expensive

**Key Question:** Can LLMs reason without prompting?

**Traditional decoding (greedy search):**
• Outputs short, direct answers
• When decoding via top-1 token selection, model often jumps straight to an answer without showing reasoning steps

**CoT decoding:**
• Explores **top-k alternative tokens** during generation
• Many reasoning paths are inherent in the model, just not revealed in greedy decoding

---

## Methods

**CoT Decoding Process:**

• **Step 1:** At the first decoding step, branch into top-k tokens
• **Step 2:** Continue greedy decoding along each branch
• **Step 3:** Extract CoT paths by ranking with a confidence metric:
   • Compute Δ = average margin between top-1 and top-2 probabilities for answer tokens
   • Higher Δ → model more confident → often corresponds to a valid CoT path
• **Step 4:** Pick the decoding path with highest Δ (or aggregate across paths)
   • This reliably identifies reasoning-consistent outputs
   • **Similar to self-consistency, but without the prompts**

![CoT Decoding Process](images/cot-decoding-diagram.png)

---

## Experiment

**Models Tested:**
• PaLM-2 (X-Small → Large)
• Mistral-7B
• Gemma-7B
• Pre-trained and instruction-tuned variants

**Tasks/Datasets:**
• **Math:** GSM8K, MultiArith
• **Commonsense:** Year Parity
• **Symbolic reasoning:** Coin Flips, Web of Lies, Multi-step Arithmetic (Big-Bench-Hard)
• **Synthetic tasks:** Sports Understanding, Object Counting

![CoT Result](images/cot-greedy.png)

---

## Findings

**Key Results:**
• CoT reasoning can be elicited **without explicit prompts**
• LLMs already learn reasoning patterns during pretraining
• Using greedy decoding underestimates a model's true reasoning ability

![CoT Result2](images/cot-result.png)

**Future Directions:**
• **Adaptive Branching:** Decide dynamically when and where to branch during decoding
• **Training integration:** Use discovered CoT paths as training signals for fine-tuning

**Comparative Analysis:**
• **Greedy decoding:** Fast but hides reasoning
• **Top-k, top-p, beam search:** Increase diversity but not reasoning accuracy
• **Self-consistency:** Needs CoT prompts, aggregates across multiple outputs
• **CoT-decoding:** Purely decoding-based, unsupervised, more faithful measure of intrinsic reasoning ability
• **Hybrid (CoT-decoding + prompting):** Best of both worlds; achieves state-of-the-art reasoning accuracy

**Note:**
• **CoT-SC** aggregates prompt-elicited reasoning trajectories
• **CoT-Decoding** uncovers and aggregates intrinsic reasoning trajectories that emerge naturally in the decoding process without any prompt or instruction-tuning

---

## References
• *Chain-of-Thought Reasoning Without Prompting*. arXiv: [https://arxiv.org/abs/2402.10200](https://arxiv.org/abs/2402.10200)

`
    },
    'ReAct': {
        metadata: {
            title: 'REACT: SYNERGIZING REASONING AND ACTING IN LANGUAGE MODELS',
            date: '2025-10-04',
            tags: ["LLM","AI Research"],
            summary: ''
        },
        content: `## Motivation

**Summary** 
• ReAct stands for Reasoning + Acting. Traditional prompting often makes an LLM either: reason (CoT, logic, planning), or act (produce an action such as tool calling or retrieving information).  
• ReAct combines the two in a single framework: the model can reason, then act, then reason again, similar to how humans solve tasks interactively. 

**Problem**
• Chain-of-thought reasoning is a static black box, in that the model uses
its own internal representations to generate thoughts and is not grounded in the external world, which limits its ability to reason reactively or update its knowledge. This can lead to issues like fact hallucination and error propagation over the reasoning process.

**Why This Matters**

• There have not been studies on how reasoning and acting can be combined in a synergistic manner for general task solving, and if such a combination can bring systematic benefits compared to reasoning or acting alone.
• ReAct offers a way to combine both modes, making them more useful for real-world tasks (search + reasoning, planning + execution, or interactive decision making). 
• It’s a step toward more agent-like LLMs, which can reason, act, observe results, and adapt.   

![ReAct1](images/ReAct1.png)

**TDLR;:** • ReAct prompts LLMs to generate both verbal reasoning traces and actions pertaining to a task in an **interleaved manner**, which allows the model to perform dynamic reasoning to create, maintain, and adjust high-level plans for acting (reason to act), while also interact with the external environments (e.g. Wikipedia) to incorporate additional information into reasoning (act to reason).

---

## Methods

**ReAct Formulation:**

• Consider a standard agent loop: at time t, the agent sees observation oₜ and chooses action aₜ per policy π(aₜ|cₜ), where cₜ is the entire trajectory so far (all past observations and actions plus the current observation).

• Expand the action space from A (external actions) to Â = A ∪ L, where L is the space of language thoughts (internal “notes to self”). L does not alter external environment but update the context. 

• By allowing "think steps”: The agent can decompose goals, plan, recap what it just saw, inject background knowledge and update its plan—all in its own words—before choosing the next real action. This reduces blind moves and tool-use hallucinations.

![ReAct2](images/cot-decoding-diagram.png)

**What this looks like in practice**
Task: “Who wrote The Selfish Gene and what year was it published?”
Observation o¹: The question text.
Thought â¹: “Plan: search for the book, then extract author and year.”
Action a¹: search("The Selfish Gene author")
Observation o²: Search results snippet shows “Richard Dawkins”.
Thought â²: “Author found; now get publication year.”
Action a²: open("The Selfish Gene Wikipedia")
Observation o³: Page shows “Published in 1976.”
Thought â³: “We have author and year; compose answer.”
Action a³ (final): “Richard Dawkins, 1976.”
Notice how thoughts don’t change the environment; they just clarify and steer the next step.

Two patterns the paper highlights
• Reasoning-heavy tasks (e.g., multi-hop QA, fact-checking): Alternate Thought → Action → Observation, repeatedly.
• Decision-heavy tasks (e.g., games, web navigation): Thoughts appear only when useful (sparsely), and the model decides when to insert them.

---

## Experiment

**Models Tested:**
• PaLM-2 (X-Small → Large)
• Mistral-7B
• Gemma-7B
• Pre-trained and instruction-tuned variants

**Tasks/Datasets:**
• **Math:** GSM8K, MultiArith
• **Commonsense:** Year Parity
• **Symbolic reasoning:** Coin Flips, Web of Lies, Multi-step Arithmetic (Big-Bench-Hard)
• **Synthetic tasks:** Sports Understanding, Object Counting

![CoT Result](images/cot-greedy.png)

---

## Findings

**Key Results:**
• CoT reasoning can be elicited **without explicit prompts**
• LLMs already learn reasoning patterns during pretraining
• Using greedy decoding underestimates a model's true reasoning ability

![CoT Result2](images/cot-result.png)

**Future Directions:**
• **Adaptive Branching:** Decide dynamically when and where to branch during decoding
• **Training integration:** Use discovered CoT paths as training signals for fine-tuning

**Comparative Analysis:**
• **Greedy decoding:** Fast but hides reasoning
• **Top-k, top-p, beam search:** Increase diversity but not reasoning accuracy
• **Self-consistency:** Needs CoT prompts, aggregates across multiple outputs
• **CoT-decoding:** Purely decoding-based, unsupervised, more faithful measure of intrinsic reasoning ability
• **Hybrid (CoT-decoding + prompting):** Best of both worlds; achieves state-of-the-art reasoning accuracy

**Note**
CoT-SC aggregates prompt-elicited reasoning trajectories.    
CoT-Decoding uncovers and aggregates intrinsic reasoning trajectories that emerge naturally in the decoding process without any prompt or instruction-tuning.
---

## References
• *Chain-of-Thought Reasoning Without Prompting*. arXiv: [https://arxiv.org/abs/2402.10200](https://arxiv.org/abs/2402.10200)

`
    }
};

// List of note IDs in order
const NOTE_IDS = ["cot-without-prompting","ReAct"];


// Load embedded notes instead of fetching
function loadAllNotesEmbedded() {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) return;

    notesContainer.innerHTML = '';

    NOTE_IDS.forEach((noteId, index) => {
        const note = EMBEDDED_NOTES[noteId];
        if (note) {
            const noteCard = createNoteCardEmbedded(noteId, note.metadata);
            noteCard.style.animationDelay = `${index * 0.1}s`;
            notesContainer.appendChild(noteCard);
        }
    });
}

function createNoteCardEmbedded(noteId, metadata) {
    // Create clickable wrapper link
    const link = document.createElement('a');
    link.href = `study-detail.html?id=${noteId}`;
    link.className = 'note-card-link block';
    link.setAttribute('aria-label', `Read note: ${metadata.title || 'Untitled'}`);

    const article = document.createElement('article');
    article.className = 'note-card';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex items-start justify-between mb-3';

    const title = document.createElement('h3');
    title.className = 'text-2xl font-semibold text-gray-900';
    title.textContent = metadata.title || 'Untitled';

    const date = document.createElement('span');
    date.className = 'text-sm text-gray-500 whitespace-nowrap ml-4';
    date.textContent = formatDateEmbedded(metadata.date);

    headerDiv.appendChild(title);
    headerDiv.appendChild(date);

    const summary = document.createElement('p');
    summary.className = 'text-gray-700 leading-relaxed mb-4';
    summary.textContent = metadata.summary || '';

    const footerDiv = document.createElement('div');
    footerDiv.className = 'flex items-center justify-between';

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'flex flex-wrap gap-2';

    if (metadata.tags && Array.isArray(metadata.tags)) {
        metadata.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag-small';
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });
    }

    const readMoreText = document.createElement('span');
    readMoreText.className = 'text-gray-900 font-medium text-sm inline-flex items-center';
    readMoreText.textContent = 'Read More →';

    footerDiv.appendChild(tagsDiv);
    footerDiv.appendChild(readMoreText);

    article.appendChild(headerDiv);
    article.appendChild(summary);
    article.appendChild(footerDiv);

    link.appendChild(article);

    return link;
}

function loadNoteDetailEmbedded(noteId) {
    const note = EMBEDDED_NOTES[noteId];

    if (!note) {
        document.getElementById('note-content').innerHTML = '<p class="text-red-600">Note not found.</p>';
        return;
    }

    const { metadata, content } = note;

    document.getElementById('page-title').textContent = `${metadata.title || 'Study Note'} - Enoch Lee`;
    document.getElementById('note-title').textContent = metadata.title || 'Untitled';
    document.getElementById('note-date').textContent = formatDateEmbedded(metadata.date);

    const tagsContainer = document.getElementById('note-tags');
    tagsContainer.innerHTML = '';
    if (metadata.tags && Array.isArray(metadata.tags)) {
        metadata.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag-small';
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
        });
    }

    const contentDiv = document.getElementById('note-content');
    contentDiv.innerHTML = marked.parse(content);
}

function formatDateEmbedded(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
