#!/usr/bin/env node
/**
 * Sync Notes Script
 * Reads Markdown files from /notes folder and generates notes-embedded.js
 * Run this script whenever you add/edit notes: node sync-notes.js
 */

const fs = require('fs');
const path = require('path');

const NOTES_DIR = path.join(__dirname, 'notes');
const OUTPUT_FILE = path.join(__dirname, 'notes-embedded.js');

/**
 * Parse front matter from markdown content
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
            let value = line.substring(colonIndex + 1).trim();

            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }

            metadata[key] = value;
        }
    });

    // Parse tags
    if (metadata.tags) {
        // Handle both comma-separated and JSON array format
        if (metadata.tags.startsWith('[')) {
            metadata.tags = JSON.parse(metadata.tags);
        } else {
            metadata.tags = metadata.tags.split(',').map(tag => tag.trim());
        }
    }

    return { metadata, content: markdownContent };
}

/**
 * Read all markdown files from notes directory
 */
function readNotes() {
    const files = fs.readdirSync(NOTES_DIR)
        .filter(file => file.endsWith('.md'))
        .sort((a, b) => {
            // Sort by date (newest first)
            const statsA = fs.statSync(path.join(NOTES_DIR, a));
            const statsB = fs.statSync(path.join(NOTES_DIR, b));
            return statsB.mtime - statsA.mtime;
        });

    const notes = {};
    const noteIds = [];

    files.forEach(file => {
        const filePath = path.join(NOTES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { metadata, content: markdownContent } = parseFrontMatter(content);

        const noteId = path.basename(file, '.md');
        noteIds.push(noteId);

        notes[noteId] = {
            metadata,
            content: markdownContent
        };
    });

    return { notes, noteIds };
}

/**
 * Generate JavaScript file with embedded notes
 */
function generateEmbeddedFile(notes, noteIds) {
    const escapeString = (str) => {
        return str
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$');
    };

    let output = `// Embedded notes fallback - works without a local server
// This file is auto-generated from /notes/*.md files
// Run 'node sync-notes.js' to regenerate after editing notes

const EMBEDDED_NOTES = {\n`;

    Object.entries(notes).forEach(([noteId, note], index) => {
        const metadata = note.metadata;
        const content = escapeString(note.content);

        output += `    '${noteId}': {\n`;
        output += `        metadata: {\n`;
        output += `            title: '${escapeString(metadata.title || '')}',\n`;
        output += `            date: '${metadata.date || ''}',\n`;
        output += `            tags: ${JSON.stringify(metadata.tags || [])},\n`;
        output += `            summary: '${escapeString(metadata.summary || '')}'\n`;
        output += `        },\n`;
        output += `        content: \`${content}\`\n`;
        output += `    }${index < Object.keys(notes).length - 1 ? ',' : ''}\n`;
    });

    output += `};\n\n`;
    output += `// List of note IDs in order\n`;
    output += `const NOTE_IDS = ${JSON.stringify(noteIds)};\n\n`;

    // Add the helper functions
    output += `
// Load embedded notes instead of fetching
function loadAllNotesEmbedded() {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) return;

    notesContainer.innerHTML = '';

    NOTE_IDS.forEach((noteId, index) => {
        const note = EMBEDDED_NOTES[noteId];
        if (note) {
            const noteCard = createNoteCardEmbedded(noteId, note.metadata);
            noteCard.style.animationDelay = \`\${index * 0.1}s\`;
            notesContainer.appendChild(noteCard);
        }
    });
}

function createNoteCardEmbedded(noteId, metadata) {
    // Create clickable wrapper link
    const link = document.createElement('a');
    link.href = \`study-detail.html?id=\${noteId}\`;
    link.className = 'note-card-link block';
    link.setAttribute('aria-label', \`Read note: \${metadata.title || 'Untitled'}\`);

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

    document.getElementById('page-title').textContent = \`\${metadata.title || 'Study Note'} - Enoch Lee\`;
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
`;

    return output;
}

/**
 * Main function
 */
function main() {
    console.log('🔄 Syncing notes from /notes folder...');

    const { notes, noteIds } = readNotes();
    console.log(`✓ Found ${noteIds.length} notes: ${noteIds.join(', ')}`);

    const embeddedContent = generateEmbeddedFile(notes, noteIds);
    fs.writeFileSync(OUTPUT_FILE, embeddedContent, 'utf-8');

    console.log(`✅ Generated ${OUTPUT_FILE}`);
    console.log('📝 Your notes are now embedded and ready to use!');
}

main();
