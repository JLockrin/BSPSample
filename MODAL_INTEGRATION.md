# Modal Integration Guide

This guide shows you how to integrate the `CuratedFlipBook` component into a modal on your landing page.

## Quick Integration

### 1. Copy the Component Files

Make sure you have these files in your landing page project:
- `components/CuratedFlipBook.vue` - The flip book component
- `public/bsp/*.webp` - Your slide images

### 2. Basic Modal Example

```vue
<template>
  <div>
    <!-- Trigger button -->
    <button 
      @click="showFlipBook = true"
      class="px-6 py-3 bg-gradient-to-r from-[#F68E15] to-[#CB5588] text-white rounded-lg"
    >
      See Inside the Playbook
    </button>

    <!-- Modal Overlay -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showFlipBook" 
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          @click.self="showFlipBook = false"
        >
          <!-- Modal Content -->
          <div class="relative bg-white dark:bg-neutral-900 p-8 rounded-3xl max-w-6xl w-full">
            <!-- Close Button -->
            <button
              @click="showFlipBook = false"
              class="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Close"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Flip Book Component -->
            <ClientOnly>
              <CuratedFlipBook
                title="See Inside the Playbook"
                :total-pages="30"
                :curated-indices="curated"
                :pages-map="pagesMap"
                :flip-interval-ms="70"
                :max-flip-preview="12"
                class-name="mx-auto"
              />
            </ClientOnly>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const showFlipBook = ref(false);

const curated = [0, 1, 2, 3, 7, 8, 9];

const pagesMap: Record<number, string> = {
  0: '/bsp/1_Title.webp',
  1: '/bsp/2.webp',
  2: '/bsp/3.webp',
  3: '/bsp/4.webp',
  7: '/bsp/8.webp',
  8: '/bsp/9.webp',
  9: '/bsp/10.webp'
};

// Optional: Close on Escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') showFlipBook.value = false;
  };
  window.addEventListener('keydown', handleEscape);
  onBeforeUnmount(() => window.removeEventListener('keydown', handleEscape));
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
```

## Customization Options

### Adjust Flip Speed
```vue
:flip-interval-ms="90"  <!-- Slower: 90-100ms -->
:flip-interval-ms="50"  <!-- Faster: 50-60ms -->
```

### Show More/Fewer Preview Pages
```vue
:max-flip-preview="6"   <!-- Show fewer intermediate pages -->
:max-flip-preview="20"  <!-- Show more intermediate pages -->
```

### Start on a Different Slide
```vue
:start-at="3"  <!-- Start at the 4th curated page (0-indexed) -->
```

### Custom Styling
```vue
class-name="max-w-5xl"  <!-- Change max width -->
```

## Tips

1. **Always use `<ClientOnly>`** - This prevents SSR issues with the component
2. **Use `<Teleport to="body">`** - Ensures modal renders at the root level
3. **Add Escape key handling** - Better UX for closing the modal
4. **Prevent body scroll** - Add `overflow-hidden` to body when modal is open
5. **Preload images** - Consider preloading the webp files for smoother experience

## Preventing Body Scroll

```ts
watch(showFlipBook, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
```

## That's It!

The component is completely self-contained and handles all the flip logic, keyboard navigation, and animations internally. Just drop it in your modal and you're good to go! 🎉


