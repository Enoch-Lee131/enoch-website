---
title: Modern CSS Techniques
date: 2024-01-05
tags: CSS, Design, Frontend
summary: Exploring CSS Grid, Flexbox, and modern layout techniques. Creating responsive designs with minimal media queries.
---

# Modern CSS Techniques

Modern CSS has evolved tremendously, providing powerful tools for creating responsive, maintainable layouts without heavy frameworks.

## CSS Grid

CSS Grid is perfect for two-dimensional layouts:

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

This creates a responsive grid that automatically adjusts column count based on available space.

## Flexbox

Flexbox excels at one-dimensional layouts:

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

### Common Flexbox Patterns

**Centered Content:**
```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**Equal Height Cards:**
```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px;
}
```

## Custom Properties (CSS Variables)

CSS variables make theming and maintenance easier:

```css
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
```

## Container Queries

The future of responsive design:

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

## Modern Selectors

**:has() - Parent Selector:**
```css
/* Style form when it has an error */
.form:has(.error) {
  border-color: red;
}
```

**:where() - Zero Specificity:**
```css
:where(h1, h2, h3) {
  margin-top: 0;
}
```

## Responsive Without Media Queries

```css
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
```

## Best Practices

1. Use CSS Grid for page layouts, Flexbox for components
2. Embrace CSS custom properties for maintainability
3. Use modern units (rem, em, ch, vw) over fixed pixels
4. Leverage container queries for component-based responsiveness
5. Keep specificity low with modern selectors

## Conclusion

Modern CSS provides all the tools needed for sophisticated layouts without relying heavily on JavaScript or frameworks. Understanding these techniques leads to more maintainable and performant websites.