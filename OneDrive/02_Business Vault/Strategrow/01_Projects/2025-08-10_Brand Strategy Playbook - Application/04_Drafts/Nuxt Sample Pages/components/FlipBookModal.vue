<script setup lang="ts">
/**
 * Self-contained modal component for the Flip Book
 * 
 * Usage in your landing page:
 * <FlipBookModal />
 * 
 * Then trigger it from anywhere:
 * const { open } = useFlipBookModal();
 * <button @click="open()">See Inside</button>
 */

const { isOpen, close, pagesMap, curated } = useFlipBookModal();
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        @click.self="close"
      >
        <!-- Modal Content -->
        <div 
          class="relative bg-neutral-50 dark:bg-neutral-900 p-8 rounded-3xl max-w-6xl w-full shadow-2xl"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="close"
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6 text-neutral-700 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Flip Book Component -->
          <ClientOnly>
            <CuratedFlipBook
              title="See Inside the Playbook"
              :total-pages="25"
              :curated-indices="curated"
              :pages-map="pagesMap"
              :flip-interval-ms="300"
              :max-flip-preview="25"
              class-name="mx-auto"
            />
          </ClientOnly>

          <!-- Optional: Instructions -->
          <div class="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
            <p>Use arrow keys ← → or click the sides to navigate</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9) translateY(20px);
}
</style>

