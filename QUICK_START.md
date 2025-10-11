# Quick Start Guide

## 🚀 Getting Started

### 1. Add Your Slide Images

Place your `.webp` slide images in the `public/bsp/` folder:

```
public/bsp/
  ├── 1_Title.webp
  ├── 2.webp
  ├── 3.webp
  ├── 4.webp
  ├── 8.webp
  ├── 9.webp
  └── 10.webp
```

### 2. Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the flip book in action!

### 3. Test the Features

- **Click** the left/right edges of the flip book to navigate
- **Keyboard** - Use arrow keys (← →) to navigate
- **Toggle Views** - Try both the Inline and Modal views using the buttons at the top

## 📦 Project Structure

```
.
├── components/
│   ├── CuratedFlipBook.vue      # Main flip book component
│   └── FlipBookModal.vue        # Ready-to-use modal wrapper
├── composables/
│   └── useFlipBookModal.ts      # State management for modal
├── pages/
│   └── index.vue                # Demo page (both inline & modal)
├── public/bsp/                  # Your slide images go here
├── MODAL_INTEGRATION.md         # Detailed integration guide
└── README.md                    # Full documentation
```

## 🎯 For Your Landing Page

### Quick Integration (3 steps):

1. **Copy these files to your landing page project:**
   - `components/CuratedFlipBook.vue`
   - `components/FlipBookModal.vue` (optional, but recommended)
   - `composables/useFlipBookModal.ts` (if using FlipBookModal)
   - `public/bsp/*.webp` (your images)

2. **Add the modal to your layout:**

```vue
<template>
  <div>
    <!-- Your existing landing page content -->
    <button @click="openFlipBook">See Inside the Playbook</button>
    
    <!-- Add the modal component -->
    <FlipBookModal />
  </div>
</template>

<script setup lang="ts">
const { open: openFlipBook } = useFlipBookModal();
</script>
```

3. **Done!** The flip book will open in a beautiful modal when the button is clicked.

## 🎨 Customization

### Change the curated pages:

Edit `composables/useFlipBookModal.ts`:

```ts
const curated = [0, 1, 2, 5, 10, 15, 20]; // Your page indices
```

### Adjust flip speed:

In `components/FlipBookModal.vue`:

```vue
:flip-interval-ms="90"  <!-- Default: 70, Range: 50-100 -->
```

### Modify styling:

The component uses Tailwind CSS classes, so you can customize colors, spacing, etc. by editing the component files.

## 📝 Notes

- Images are served from `/public/bsp/` - no build step needed for images
- The component works client-side only (uses `<ClientOnly>` wrapper)
- Keyboard navigation is built-in (arrow keys)
- Body scroll is automatically prevented when modal is open
- ESC key closes the modal

## 🐛 Troubleshooting

**Images not loading?**
- Check that files are in `public/bsp/` folder
- Verify filenames match exactly (case-sensitive)
- Check browser console for 404 errors

**Modal not opening?**
- Ensure you're importing and using `useFlipBookModal()` composable
- Check that `<FlipBookModal />` component is in your template

**Flip animation too fast/slow?**
- Adjust `:flip-interval-ms` prop (lower = faster, higher = slower)
- Default: 70ms, Recommended range: 50-100ms

## 📚 More Information

- **Full Documentation:** See `README.md`
- **Modal Integration Guide:** See `MODAL_INTEGRATION.md`
- **Component Props:** See `components/CuratedFlipBook.vue` (script section)

---

**Questions?** Check the inline comments in the code files - they're comprehensive!

