# Brand Strategy Playbook - Flip Book

A curated flip book component built with Nuxt 3 and Tailwind CSS featuring a hyper-flip animation effect. Perfect for showcasing selected pages from your Brand Strategy Playbook.

## Features

- 🎯 **Curated Navigation**: Show only selected pages while simulating flips through the rest
- ⚡ **Hyper-Flip Effect**: Fast page-flipping animation with skew transforms and shimmer overlay
- ⌨️ **Keyboard Support**: Navigate with left/right arrow keys
- 📱 **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- 🎨 **Modal-Ready**: Component is self-contained and easy to integrate into modals
- 🌙 **Dark Mode Compatible**: Looks great in both light and dark modes

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Add your slide images:**

There are two types of images:

**Landing Pages** (`public/bsp/`): High-quality images where users can stop
- `1_Title.webp`, `2.webp`, `3.webp`, `4.webp`, etc.
- These are defined in your `pagesMap` configuration
- Users can navigate to and pause on these pages

**Blur-Through Content** (`public/bsp/blur/`): Images shown only during flip animation
- `11.webp`, `12.webp`, `13.webp`, etc.
- Used to fill gaps between landing pages
- Shown blurred and briefly to create realistic page-flipping effect
- Can be lower quality since they appear in motion blur

3. **Run the development server:**
```bash
npm run dev
```

Visit http://localhost:3000 to see the flip book in action.

## Using as a Modal

To integrate this flip book into a modal on your landing page:

```vue
<template>
  <!-- Your modal overlay -->
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div class="bg-white dark:bg-neutral-900 p-8 rounded-3xl max-w-6xl w-full mx-4">
      <ClientOnly>
        <CuratedFlipBook
          title="See Inside the Playbook"
          :total-pages="30"
          :curated-indices="[0, 1, 2, 3, 7, 8, 9]"
          :pages-map="pagesMap"
          :flip-interval-ms="70"
          :max-flip-preview="12"
          class-name="mx-auto"
        />
      </ClientOnly>
      
      <button @click="showModal = false" class="mt-4">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const showModal = ref(false);

const pagesMap: Record<number, string> = {
  0: '/bsp/1_Title.webp',
  1: '/bsp/2.webp',
  2: '/bsp/3.webp',
  3: '/bsp/4.webp',
  7: '/bsp/8.webp',
  8: '/bsp/9.webp',
  9: '/bsp/10.webp'
};
</script>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `totalPages` | `number` | required | Total slides in the full deck (for breadth illusion) |
| `curatedIndices` | `number[]` | required | Array of 0-based page indices to land on |
| `pagesMap` | `Record<number, string>` | required | Map of page indices to image URLs |
| `title` | `string` | `undefined` | Optional title to display above the flip book |
| `startAt` | `number` | `0` | Starting index (into curatedIndices array) |
| `flipIntervalMs` | `number` | `70` | Milliseconds between flip animation frames |
| `maxFlipPreview` | `number` | `12` | Maximum number of in-between preview pages |
| `className` | `string` | `''` | Additional CSS classes |

## How It Works

The flip book uses a **dual-folder system** to create a realistic page-flipping effect:

1. **Landing Pages** (`pagesMap`): Your curated high-quality slides where users can stop and read
2. **Blur-Through Content** (`/bsp/blur/`): Additional images automatically shown during transitions

### Example Flow

If you're showing slides 1, 5, 10 as landing pages with blur content at 2, 3, 4, 6, 7, 8, 9:

**When clicking from slide 1 → slide 5:**
- Quickly shows slides 2, 3, 4 (from `/bsp/blur/`) with blur effect
- Lands on slide 5 (from main `/bsp/` folder) in sharp focus

**When clicking from slide 5 → slide 10:**
- Rapidly flips through slides 6, 7, 8, 9 (from `/bsp/blur/`) with blur
- Lands on slide 10 (from main `/bsp/` folder) in sharp focus

This creates the illusion of a physical book with many more pages than just your curated selection!

## Build

```bash
npm run build
```

## License

This project is part of the Brand Strategy Playbook application.

