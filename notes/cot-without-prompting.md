---
title: Chain-of-Thought Reasoning Without Prompting
date: 2025-01-15
tags: LLM, Reasoning, Decoding, AI Research
summary: Paper explores how chain-of-thought reasoning can emerge without explicit prompting, by modifying decoding strategies instead of altering the training or input prompts.
---

# Chain-of-Thought Reasoning Without Prompting

## Key Idea
The paper argues that **chain-of-thought (CoT) reasoning does not require explicit prompts**. Instead, CoT can be elicited from pretrained LLMs through changes in the **decoding process**.

- Traditional decoding (greedy search) → outputs short, direct answers.
- CoT decoding → explores **top-k alternative tokens** during generation.
- Result: many reasoning paths are already latent in the model, just not revealed in greedy decoding.

---

## Methods
- **CoT Decoding:** Rather than greedy decoding, sample top-k candidates and expand reasoning paths.
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