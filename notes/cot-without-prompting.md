---
title: CoT Reasoning Without Prompting
date: 2025-10-03
tags: LLM, Reasoning, Decoding, AI Research
summary: Paper explores how chain-of-thought reasoning can emerge without explicit prompting, by modifying decoding strategies instead of altering the training or input prompts.
---

## Motivation
**Problem:** Current Chain-of-Though (CoT) reasoning in LLMs is typically elicited via prompt engineering (few-shot, zero-shot, instruction tuning).

**Issues with prompting:** 
- Requires manual, task-specific engineering
- Hard to separate model's intrinsic reasoning ability from human priors.

**Key Question:** Can LLMs reason without prompting?

Traditional decoding (greedy search) → outputs short, direct answers.
CoT decoding → explores **top-k alternative tokens** during generation.
Result: Many reasoning paths are inherent in the model, just not revealed in greedy decoding.

---

## Methods
- **CoT Decoding:** 
Step 1: At the first decoding step, branch into top-k tokens
Step 2: Continue greedy decoding along each branch.
Step 3: Extract CoT paths by ranking with a confidence metric:
- Compute Δ = average margin between top-1 and top-2 probabilities for answer tokens.
- Higher Δ → model more confident → often corresponds to a valid CoT path.

![CoT Decoding Process](../images/cot-decoding-diagram.png)


Rather than greedy decoding, sample top-k candidates and expand reasoning paths.
- **Evaluation:** Compare generated reasoning steps with prompted CoT baselines.
- **Intrinsic Ability:** This approach isolates the model's inherent reasoning skills, free from prompt-engineering effects.

---

## Findings
1. CoT reasoning can be elicited **without explicit prompts**.
2. Models demonstrate **latent reasoning ability**, revealed via decoding.
3. Bypasses prompt-engineering confounders and allows cleaner evaluation of LLM reasoning capacity.

---

## Significance
- Suggests reasoning is **already embedded** in pretrained LLMs.
- Offers a way to study reasoning ability without relying on handcrafted prompts.
- Highlights the importance of **decoding strategies** in model behavior.

---

## References
- *Chain-of-Thought Reasoning Without Prompting*. arXiv: [https://arxiv.org/abs/2402.10200](https://arxiv.org/abs/2402.10200)