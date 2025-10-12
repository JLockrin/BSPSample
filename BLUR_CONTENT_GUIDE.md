# Blur Content Setup Guide

## Overview

The flip book now supports a **dual-folder system** that separates landing pages from blur-through animation content. This lets you control exactly which slides users can stop on, while showing realistic intermediate content during the flip animation.

## Folder Structure

```
public/bsp/
├── 1_Title.webp       ← Landing page (users can stop here)
├── 2.webp             ← Landing page
├── 3.webp             ← Landing page
├── ...
└── blur/
    ├── 11.webp        ← Blur-through content (shown during animation only)
    ├── 12.webp        ← Blur-through content
    ├── 13.webp        ← Blur-through content
    └── ...
```

## How It Works

### Component Logic (`CuratedFlipBook.vue`)

The `srcFor()` function now checks two locations:

```typescript
function srcFor(idx: number) {
  // First check if this is a curated landing page
  if (props.pagesMap[idx]) {
    return props.pagesMap[idx];  // e.g., '/bsp/5.webp'
  }
  // Otherwise, check the blur folder for in-between content
  return `/bsp/blur/${idx}.webp`;  // e.g., '/bsp/blur/11.webp'
}
```

### Configuration Example

```typescript
// Define which pages users can navigate to and stop on
const curated = [0, 1, 2, 3, 4, 5, 10, 15, 20];

// Map those indices to actual image files
const pagesMap: Record<number, string> = {
  0: '/bsp/1_Title.webp',
  1: '/bsp/2.webp',
  2: '/bsp/3.webp',
  3: '/bsp/4.webp',
  4: '/bsp/5.webp',
  5: '/bsp/6.webp',
  10: '/bsp/11.webp',
  15: '/bsp/16.webp',
  20: '/bsp/21.webp'
};
```

### What Happens During Navigation

**Scenario**: User clicks from slide 5 → slide 10

1. Component calculates path: `[6, 7, 8, 9]`
2. For each intermediate index, `srcFor()` checks:
   - Is index 6 in `pagesMap`? No → Use `/bsp/blur/6.webp`
   - Is index 7 in `pagesMap`? No → Use `/bsp/blur/7.webp`
   - Is index 8 in `pagesMap`? No → Use `/bsp/blur/8.webp`
   - Is index 9 in `pagesMap`? No → Use `/bsp/blur/9.webp`
3. Shows these blur images rapidly (blurred at 3px, 300ms each)
4. Lands on slide 10 (sharp focus from `/bsp/11.webp`)

## Setting Up Your Content

### Step 1: Identify Your Landing Pages

Decide which slides users should be able to stop on and read. These are your "curated" pages.

Example:
- Slide 1: Title
- Slides 2-6: Core content
- Slides 10-12: Case studies
- Slide 20: Conclusion

### Step 2: Add Landing Page Images

Place these in `/public/bsp/` and configure them:

```typescript
const curated = [0, 1, 2, 3, 4, 5, 9, 10, 11, 19];

const pagesMap: Record<number, string> = {
  0: '/bsp/1_Title.webp',
  1: '/bsp/2.webp',
  2: '/bsp/3.webp',
  // ... etc
};
```

### Step 3: Add Blur-Through Content

For gaps between your landing pages, add images to `/public/bsp/blur/`:

- `/bsp/blur/6.webp` (between slides 5 and 10)
- `/bsp/blur/7.webp`
- `/bsp/blur/8.webp`
- `/bsp/blur/12.webp` (between slides 11 and 20)
- `/bsp/blur/13.webp`
- ... etc

### Step 4: Test the Effect

Navigate between landing pages and observe:
- ✅ You land on sharp, high-quality images
- ✅ Intermediate pages flip by with recognizable blur content
- ✅ The effect feels like thumbing through a physical book

## Image Quality Tips

### Landing Pages (`/bsp/`)
- **Quality**: High resolution, sharp, production-ready
- **Purpose**: Users will stop and read these
- **Size**: Full quality (optimize but keep readable)

### Blur Content (`/bsp/blur/`)
- **Quality**: Can be lower resolution (they're blurred and moving)
- **Purpose**: Create motion effect only
- **Size**: Can be smaller file sizes (500-800px wide is fine)
- **Content**: Can be simplified versions, duplicates, or representative content

## Troubleshooting

### Missing Images
If an intermediate image is missing from `/bsp/blur/`, the browser will:
- Attempt to load `/bsp/blur/X.webp`
- Get a 404 (file not found)
- Show the placeholder "Page X" div instead

This is harmless but looks less polished. For best results, provide images for all gaps.

### Unexpected Landing Pages
If a page number appears in BOTH the main folder and `pagesMap`, the `pagesMap` entry takes priority. If you want a page to be blur-through only, remove it from `pagesMap`.

### Performance
The blur folder images load dynamically during the flip animation. If you have many intermediate pages (50+), consider:
- Using smaller file sizes for blur content
- Adjusting `maxFlipPreview` prop to limit how many intermediate pages are shown
- Preloading critical blur images if needed

## Summary

| Location | Purpose | Quality | Stops Here? |
|----------|---------|---------|-------------|
| `/bsp/` | Landing pages defined in `pagesMap` | High | ✅ Yes |
| `/bsp/blur/` | Automatic fill for gaps | Lower OK | ❌ No |

This system gives you **complete control** over the user experience while maintaining the realistic flip animation effect! 🎯


