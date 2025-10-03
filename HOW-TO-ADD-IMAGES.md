# How to Add Images to Study Notes

This guide shows you how to add images to your study notes.

## Quick Steps

1. **Add image to the `/images` folder**
2. **Reference it in your Markdown note**
3. **Run sync script**
4. **Commit and push**

---

## Detailed Instructions

### Step 1: Add Image to Images Folder

Copy your image file to `/Users/enoch/Desktop/website/images/`:

```bash
cp "path/to/your/image.png" /Users/enoch/Desktop/website/images/my-image-name.png
```

**Naming Tips:**
- Use lowercase letters
- Use hyphens instead of spaces (e.g., `cot-diagram.png` not `CoT Diagram.png`)
- Use descriptive names (e.g., `database-normalization-diagram.png`)

### Step 2: Add Markdown Image Syntax

In your note file (e.g., `/notes/my-note.md`), use this syntax:

```markdown
![Image Description](../images/my-image-name.png)
```

**Example:**
```markdown
## Methods

Here's how the process works:

![CoT Decoding Process](../images/cot-decoding-diagram.png)

The diagram shows...
```

**Image Syntax Breakdown:**
- `!` - Indicates an image
- `[Image Description]` - Alt text (for accessibility)
- `(../images/filename.png)` - Relative path to image
  - `..` means go up one folder (from `/notes` to root)
  - `/images/` is the images folder
  - `filename.png` is your image file

### Step 3: Sync Notes

Run the sync script to update the embedded version:

```bash
cd /Users/enoch/Desktop/website
node sync-notes.js
```

### Step 4: Commit and Push

```bash
git add images/my-image-name.png notes/my-note.md notes-embedded.js
git commit -m "Add diagram to study note"
git push origin main
```

---

## Image Placement Examples

### After a paragraph:
```markdown
Here's the explanation text.

![Diagram Title](../images/diagram.png)

More text continues here.
```

### Multiple images:
```markdown
![First Diagram](../images/diagram-1.png)

Some explanation text.

![Second Diagram](../images/diagram-2.png)
```

### Inline with text (not recommended):
```markdown
See the diagram ![inline](../images/small-icon.png) for details.
```

---

## Image Size Recommendations

- **Diagrams/Screenshots**: Max 1200px width
- **Icons**: 64px - 128px
- **File size**: Keep under 500KB for fast loading

To resize an image on macOS:
```bash
sips -Z 1200 /Users/enoch/Desktop/website/images/my-image.png
```

---

## Common Issues

### Image not showing?
1. Check the file path is correct (`../images/filename.png`)
2. Verify the image is in `/Users/enoch/Desktop/website/images/`
3. Make sure you ran `node sync-notes.js`
4. Check the image filename (case-sensitive!)

### Image too large?
```bash
# Resize to max 1200px width/height
sips -Z 1200 /Users/enoch/Desktop/website/images/your-image.png
```

### Wrong path?
- From `/notes/*.md` files, always use: `../images/filename.png`
- The `..` goes up from `/notes` to the root directory

---

## Full Example

**1. Copy image:**
```bash
cp ~/Downloads/architecture-diagram.png /Users/enoch/Desktop/website/images/system-architecture.png
```

**2. Edit note** (`/notes/system-design.md`):
```markdown
---
title: System Architecture
date: 2025-10-03
tags: Architecture, Design
summary: Overview of system design patterns
---

# System Architecture

## High-Level Overview

Here's the complete system architecture:

![System Architecture Diagram](../images/system-architecture.png)

The diagram shows three main components...
```

**3. Sync:**
```bash
node sync-notes.js
```

**4. Commit:**
```bash
git add images/system-architecture.png notes/system-design.md notes-embedded.js
git commit -m "Add system architecture diagram"
git push origin main
```

Done! Your image will now appear in the study note on your website.

---

## Image Formats Supported

- ✅ PNG (`.png`) - Best for diagrams, screenshots
- ✅ JPG/JPEG (`.jpg`, `.jpeg`) - Best for photos
- ✅ SVG (`.svg`) - Best for vector graphics
- ✅ GIF (`.gif`) - Animated images
- ✅ WebP (`.webp`) - Modern format

---

## Tips

1. **Use descriptive alt text** - Helps with accessibility and SEO
2. **Optimize images** - Compress before uploading for faster load times
3. **Consistent naming** - Use a naming convention (e.g., `note-name-diagram-1.png`)
4. **Version images** - If updating, rename (e.g., `diagram-v2.png`)

Happy note-taking! 📝✨