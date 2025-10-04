---
title: CoT Reasoning Without Prompting
date: 2025-10-03
tags: LLM, Reasoning, Decoding, AI Research
summary: Paper explores how chain-of-thought reasoning can emerge without explicit prompting, by modifying decoding strategies instead of altering the training or input prompts.
---

## Motivation
**Problem:** Current Chain-of-Though (CoT) reasoning in LLMs is typically elicited via prompt engineering (few-shot, zero-shot, instruction tuning).

**Issues with prompting:** 
• Requires manual, task-specific engineering.
• Hard to separate model's intrinsic reasoning ability, or if they are just mimicking human-provided reasoning formats. 
• Instruction-tuning with CoT data improves performance but is expensive. 

**Key Question:** Can LLMs reason without prompting?

Traditional decoding (greedy search) → outputs short, direct answers.
When decoding via top-1 token selection, model often jumps straight to an answer without showing reasoning steps. 

CoT decoding → explores **top-k alternative tokens** during generation.
Many reasoning paths are inherent in the model, just not revealed in greedy decoding.

---

## Methods
- **CoT Decoding:** 
Step 1: At the first decoding step, branch into top-k tokens.
Step 2: Continue greedy decoding along each branch.
Step 3: Extract CoT paths by ranking with a confidence metric:
- Compute Δ = average margin between top-1 and top-2 probabilities for answer tokens.
- Higher Δ → model more confident → often corresponds to a valid CoT path.
Step 4: Pick the decoding path with highest Δ (or aggregate across paths). This reliably identifies reasoning-consistent outputs.  **This is similar to self-consistency, but without the prompts**

![CoT Decoding Process](../images/cot-decoding-diagram.png)

---

## Experiment
**Model Tested:**
PaLM-2 (X-Small → Large), Mistral-7B, Gemma-7B.
Pre-trained and instruction-tuned variants.

**Tasks/Datasets:**
Math: GSM8K, MultiArith.
Commonsense: Year Parity.
Symbolic reasoning: Coin Flips, Web of Lies, Multi-step Arithmetic (Big-Bench-Hard).
Synthetic tasks: Sports Understanding, Object Counting.

**Decoding Variants Compared:**
Greedy, Top-k sampling, Nucleus sampling, Beam search, Self-consistency, CoT-decoding.

![CoT Result](../images/cot-greedy.png)

---

## Findings
1. CoT reasoning can be elicited **without explicit prompts**.
2. LLMs already learn reasoning patterns during pretraining
3. Using greedy decoding underestimates a model's true reasoning ability

![CoT Result2](../images/cot-result.png)

**Future Directions:**
Adaptive Branching: Decide dynamically when and where to branch during decoding.
Training integration: Use discovered CoT paths as training signals for fine-tuning.

**Comparative Analysis**
Greedy decoding: Fast but hides reasoning.
Top-k, top-p, beam search: Increase diversity but not reasoning accuracy.
Self-consistency: Needs CoT prompts, aggregates across multiple outputs.
CoT-decoding: Purely decoding-based, unsupervised, more faithful measure of intrinsic reasoning ability.
Hybrid (CoT-decoding + prompting): Best of both worlds; achieves state-of-the-art reasoning accuracy.
---

## References
- *Chain-of-Thought Reasoning Without Prompting*. arXiv: [https://arxiv.org/abs/2402.10200](https://arxiv.org/abs/2402.10200)

