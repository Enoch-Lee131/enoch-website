# Study Notes System

Your study notes are stored as individual Markdown files in the `/notes` folder.

## File Structure

```
/notes
  ├── cot-without-prompting.md
  ├── react-hooks.md
  ├── database-design.md
  └── modern-css.md
```

## Adding a New Note

1. Create a new `.md` file in the `/notes` folder (e.g., `my-new-note.md`)

2. Add front matter at the top:
   ```markdown
   ---
   title: Your Note Title
   date: 2025-01-20
   tags: Tag1, Tag2, Tag3
   summary: A brief summary of your note
   ---

   # Your Note Title

   Your content here...
   ```

3. Run the sync script to update the website:
   ```bash
   cd /Users/enoch/Desktop/website
   node sync-notes.js
   ```

4. Refresh your browser to see the new note!

## Editing an Existing Note

1. Open any `.md` file in `/notes` folder
2. Edit the content
3. Run `node sync-notes.js` to sync changes
4. Refresh your browser

## Front Matter Format

```yaml
---
title: "Your Title"           # Required: Note title
date: 2025-01-15             # Required: Publication date (YYYY-MM-DD)
tags: Tag1, Tag2, Tag3       # Required: Comma-separated tags
summary: "Brief description" # Required: Short summary for list view
---
```

## Markdown Features Supported

- **Headers**: `# H1`, `## H2`, `### H3`
- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Code blocks**: ` ```javascript ... ``` `
- **Inline code**: `` `code` ``
- **Links**: `[text](url)`
- **Lists**: `-` or `1.`
- **Blockquotes**: `>`
- **Horizontal rules**: `---`

## Tips

- File names become note IDs (e.g., `my-note.md` → ID: `my-note`)
- Use kebab-case for file names (lowercase with hyphens)
- Notes are sorted by modification date (newest first)
- Keep summaries under 200 characters for best display

## Troubleshooting

**Notes not showing?**
- Make sure you ran `node sync-notes.js`
- Check that the front matter format is correct
- Verify the `.md` file is in the `/notes` folder

**Sync script not working?**
- Ensure Node.js is installed: `node --version`
- Check you're in the website directory
- Look for error messages in the terminal
