// Notes Loader - Handles fetching and parsing Markdown files with front matter

// List of available notes
const NOTES = [
    { id: 'cot-without-prompting', file: 'notes/cot-without-prompting.md' },
    { id: 'react-hooks', file: 'notes/react-hooks.md' },
    { id: 'database-design', file: 'notes/database-design.md' },
    { id: 'modern-css', file: 'notes/modern-css.md' }
];

/**
 * Parse front matter from markdown content
 * Front matter format:
 * ---
 * title: My Title
 * date: 2024-01-15
 * tags: Tag1, Tag2, Tag3
 * summary: Short summary
 * ---
 */
function parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
        return { metadata: {}, content: content };
    }

    const frontMatterText = match[1];
    const markdownContent = match[2];

    const metadata = {};
    frontMatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            metadata[key] = value;
        }
    });

    // Parse tags if they exist
    if (metadata.tags) {
        metadata.tags = metadata.tags.split(',').map(tag => tag.trim());
    }

    return { metadata, content: markdownContent };
}

/**
 * Fetch and parse a markdown file
 */
async function fetchNote(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${filePath}`);
        }
        const text = await response.text();
        return parseFrontMatter(text);
    } catch (error) {
        console.error('Error fetching note:', error);
        return null;
    }
}

/**
 * Load all notes for the list view
 */
async function loadAllNotes() {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) return;

    notesContainer.innerHTML = '<p class="text-gray-600 text-center">Loading notes...</p>';

    const noteElements = [];

    for (const note of NOTES) {
        const result = await fetchNote(note.file);
        if (result && result.metadata) {
            const { metadata } = result;
            const noteCard = createNoteCard(note.id, metadata);
            noteElements.push(noteCard);
        }
    }

    if (noteElements.length > 0) {
        notesContainer.innerHTML = '';
        noteElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            notesContainer.appendChild(element);
        });
    } else {
        notesContainer.innerHTML = '<p class="text-gray-600 text-center">No notes available.</p>';
    }
}

/**
 * Create a note card element for the list view
 */
function createNoteCard(noteId, metadata) {
    const article = document.createElement('article');
    article.className = 'note-card';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex items-start justify-between mb-3';

    const title = document.createElement('h3');
    title.className = 'text-2xl font-semibold text-gray-900';
    title.textContent = metadata.title || 'Untitled';

    const date = document.createElement('span');
    date.className = 'text-sm text-gray-500 whitespace-nowrap ml-4';
    date.textContent = formatDate(metadata.date);

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

    const readMoreLink = document.createElement('a');
    readMoreLink.href = `study-detail.html?id=${noteId}`;
    readMoreLink.className = 'text-gray-900 font-medium hover:underline text-sm';
    readMoreLink.textContent = 'Read More →';

    footerDiv.appendChild(tagsDiv);
    footerDiv.appendChild(readMoreLink);

    article.appendChild(headerDiv);
    article.appendChild(summary);
    article.appendChild(footerDiv);

    return article;
}

/**
 * Load a single note for the detail view
 */
async function loadNoteDetail(noteId) {
    const note = NOTES.find(n => n.id === noteId);

    if (!note) {
        document.getElementById('note-content').innerHTML = '<p class="text-red-600">Note not found.</p>';
        return;
    }

    const result = await fetchNote(note.file);

    if (!result) {
        document.getElementById('note-content').innerHTML = '<p class="text-red-600">Failed to load note.</p>';
        return;
    }

    const { metadata, content } = result;

    // Update page title
    document.getElementById('page-title').textContent = `${metadata.title || 'Study Note'} - Enoch Lee`;
    document.getElementById('note-title').textContent = metadata.title || 'Untitled';
    document.getElementById('note-date').textContent = formatDate(metadata.date);

    // Render tags
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

    // Render markdown content
    const contentDiv = document.getElementById('note-content');
    contentDiv.innerHTML = marked.parse(content);
}

/**
 * Format date string
 */
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Auto-load notes on page load if container exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('notes-container')) {
        loadAllNotes();
    }
});