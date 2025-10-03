// Embedded notes fallback - works without a local server
// This file is auto-generated from /notes/*.md files
// Run 'node sync-notes.js' to regenerate after editing notes

const EMBEDDED_NOTES = {
    'cot-without-prompting': {
        metadata: {
            title: 'Chain-of-Thought Reasoning Without Prompting',
            date: '2025-01-15',
            tags: ["LLM","Reasoning","Decoding","AI Research"],
            summary: 'Paper explores how chain-of-thought reasoning can emerge without explicit prompting, by modifying decoding strategies instead of altering the training or input prompts.'
        },
        content: `# Chain-of-Thought Reasoning Without Prompting

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
- *Chain-of-Thought Reasoning Without Prompting*. arXiv: [https://arxiv.org/abs/2402.10200](https://arxiv.org/abs/2402.10200)`
    },
    'modern-css': {
        metadata: {
            title: 'Modern CSS Techniques',
            date: '2024-01-05',
            tags: ["CSS","Design","Frontend"],
            summary: 'Exploring CSS Grid, Flexbox, and modern layout techniques. Creating responsive designs with minimal media queries.'
        },
        content: `# Modern CSS Techniques

Modern CSS has evolved tremendously, providing powerful tools for creating responsive, maintainable layouts without heavy frameworks.

## CSS Grid

CSS Grid is perfect for two-dimensional layouts:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

This creates a responsive grid that automatically adjusts column count based on available space.

## Flexbox

Flexbox excels at one-dimensional layouts:

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

### Common Flexbox Patterns

**Centered Content:**
\`\`\`css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

**Equal Height Cards:**
\`\`\`css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px;
}
\`\`\`

## Custom Properties (CSS Variables)

CSS variables make theming and maintenance easier:

\`\`\`css
:root {
  --primary-color: #667eea;
  --spacing-unit: 8px;
  --border-radius: 12px;
}

.button {
  background: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
}
\`\`\`

## Container Queries

The future of responsive design:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\`

## Modern Selectors

**:has() - Parent Selector:**
\`\`\`css
/* Style form when it has an error */
.form:has(.error) {
  border-color: red;
}
\`\`\`

**:where() - Zero Specificity:**
\`\`\`css
:where(h1, h2, h3) {
  margin-top: 0;
}
\`\`\`

## Responsive Without Media Queries

\`\`\`css
/* Fluid typography */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}

/* Responsive grid without media queries */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}
\`\`\`

## Best Practices

1. Use CSS Grid for page layouts, Flexbox for components
2. Embrace CSS custom properties for maintainability
3. Use modern units (rem, em, ch, vw) over fixed pixels
4. Leverage container queries for component-based responsiveness
5. Keep specificity low with modern selectors

## Conclusion

Modern CSS provides all the tools needed for sophisticated layouts without relying heavily on JavaScript or frameworks. Understanding these techniques leads to more maintainable and performant websites.`
    },
    'database-design': {
        metadata: {
            title: 'Database Design Principles',
            date: '2024-01-10',
            tags: ["Database","SQL","Backend"],
            summary: 'Key concepts in database normalization, indexing strategies, and query optimization. Notes from practical experience and theoretical learning.'
        },
        content: `# Database Design Principles

Good database design is fundamental to building scalable and maintainable applications. This guide covers essential principles I've learned through experience.

## Normalization

Normalization eliminates data redundancy and ensures data integrity:

### First Normal Form (1NF)
- Each column contains atomic values
- Each column contains values of a single type
- Each column has a unique name

### Second Normal Form (2NF)
- Must be in 1NF
- All non-key attributes fully depend on the primary key

### Third Normal Form (3NF)
- Must be in 2NF
- No transitive dependencies

## Indexing Strategies

Proper indexing dramatically improves query performance:

\`\`\`sql
-- Create index on frequently queried columns
CREATE INDEX idx_user_email ON users(email);

-- Composite index for multi-column queries
CREATE INDEX idx_order_date_status ON orders(order_date, status);
\`\`\`

### When to Use Indexes
- Columns frequently used in WHERE clauses
- Foreign key columns
- Columns used in JOIN operations
- Columns used in ORDER BY

### When to Avoid Indexes
- Small tables
- Columns with low cardinality
- Tables with frequent INSERT/UPDATE operations

## Query Optimization

Writing efficient queries is crucial for performance:

\`\`\`sql
-- Bad: SELECT *
SELECT * FROM users WHERE id = 1;

-- Good: Select only needed columns
SELECT id, name, email FROM users WHERE id = 1;

-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM orders WHERE user_id = 123;
\`\`\`

## Relationships

Understanding and properly implementing relationships:

- **One-to-One**: User profile information
- **One-to-Many**: User has many orders
- **Many-to-Many**: Students and courses (junction table)

## Key Takeaways

1. Design for scalability from the start
2. Normalize to 3NF, then denormalize strategically
3. Index thoughtfully - not every column needs an index
4. Always consider query patterns when designing tables
5. Use constraints to enforce data integrity`
    },
    'react-hooks': {
        metadata: {
            title: 'Understanding React Hooks',
            date: '2024-01-15',
            tags: ["React","JavaScript","Frontend"],
            summary: 'Deep dive into React Hooks, exploring useState, useEffect, and custom hooks. Understanding the patterns and best practices for functional components.'
        },
        content: `# Understanding React Hooks

React Hooks revolutionized how we write React components by allowing us to use state and other React features without writing a class.

## useState Hook

The \`useState\` hook lets you add state to functional components:

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

This simple API replaces the need for class-based state management and makes components more readable.

## useEffect Hook

\`useEffect\` handles side effects in functional components:

\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

The dependency array ensures the effect only runs when specific values change.

## Custom Hooks

Creating custom hooks allows you to extract and reuse stateful logic:

\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
\`\`\`

## Best Practices

1. **Always call hooks at the top level** - Don't call them inside loops, conditions, or nested functions
2. **Use the exhaustive-deps rule** - Include all dependencies in useEffect
3. **Extract complex logic into custom hooks** - Keep components clean and focused
4. **Name custom hooks with "use" prefix** - Follow React conventions

## Conclusion

React Hooks provide a powerful way to write cleaner, more maintainable code. By understanding these patterns, you can build more efficient React applications.`
    }
};

// List of note IDs in order
const NOTE_IDS = ["cot-without-prompting","modern-css","database-design","react-hooks"];


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
