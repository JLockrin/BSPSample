# Blur Folder - In-Between Slide Content

This folder contains images that are displayed **only during the flip animation** as blur-through content. These slides are NOT landing pages where users can stop.

## Purpose

When users navigate from one curated landing page to another (e.g., slide 1 → slide 8), the flip animation shows intermediate pages flying by in a blur. This creates the illusion of flipping through a physical book with many more pages than just the landing pages.

## File Naming

- Files should be named with their page number: `2.webp`, `3.webp`, `11.webp`, etc.
- These correspond to the absolute page indices in your deck
- They fill the gaps between your main landing pages in `/public/bsp/`

## Example Structure

If your curated landing pages are:
- `/bsp/1_Title.webp` (page 1)
- `/bsp/4.webp` (page 4)
- `/bsp/8.webp` (page 8)

Then your blur folder might contain:
- `/bsp/blur/2.webp` (shows briefly when flipping from 1→4)
- `/bsp/blur/3.webp` (shows briefly when flipping from 1→4)
- `/bsp/blur/5.webp` (shows briefly when flipping from 4→8)
- `/bsp/blur/6.webp` (shows briefly when flipping from 4→8)
- `/bsp/blur/7.webp` (shows briefly when flipping from 4→8)

## Image Quality

These images can be:
- Lower resolution (since they're blurred and move quickly)
- Simplified versions of actual slides
- Representative content from your full deck
- Even duplicates/variations to fill gaps

The goal is to show recognizable content flying by to make the flip effect feel authentic.


