<script setup lang="ts">
const { open } = useFlipBookModal();
const showInline = ref(true);

// Curated landing pages (0-based indices where users can stop)
// Page file numbers: 1, 3, 8, 11, 15, 16, 18, 19, 24, 25
const curated = [0, 2, 7, 10, 14, 15, 17, 18, 23, 24];

// Main landing pages (high quality, users can stop here)
const pagesMap: Record<number, string> = {
  0: '/bsp/1.webp',      // Page 1 - Title
  2: '/bsp/3.webp',      // Page 3
  7: '/bsp/8.webp',      // Page 8
  10: '/bsp/11.webp',    // Page 11
  14: '/bsp/15.webp',    // Page 15
  15: '/bsp/16.webp',    // Page 16
  17: '/bsp/18.webp',    // Page 18
  18: '/bsp/19.webp',    // Page 19
  23: '/bsp/24.webp',    // Page 24
  24: '/bsp/25.webp'     // Page 25
};
// Blur-through pages (2, 4-7, 9-10, 12-14, 17, 20-23) are in /bsp/blur/ folder
// and will automatically show during flip animations
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <div class="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">
          Brand Strategy Playbook - Flip Book Demo
        </h1>
        
        <div class="flex flex-wrap gap-4">
          <button
            @click="showInline = true"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-colors',
              showInline 
                ? 'bg-gradient-to-r from-[#F68E15] to-[#CB5588] text-white' 
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            ]"
          >
            Inline View
          </button>
          
          <button
            @click="() => { showInline = false; open(); }"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-colors',
              !showInline 
                ? 'bg-gradient-to-r from-[#F68E15] to-[#CB5588] text-white' 
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            ]"
          >
            Modal View
          </button>
        </div>

        <p class="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Click the sides or use arrow keys to navigate. Modal ready for your landing page.
        </p>
      </div>
    </div>

    <section v-if="showInline" class="px-4 py-12">
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
    </section>

    <section v-else class="px-4 py-12">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">
          Modal View
        </h2>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6">
          Click below to open the flip book in a modal.
        </p>
        <button
          @click="open"
          class="px-8 py-4 bg-gradient-to-r from-[#F68E15] to-[#CB5588] text-white rounded-lg text-lg font-medium hover:shadow-lg transition-shadow"
        >
          Open Flip Book Modal
        </button>
      </div>
    </section>

    <FlipBookModal />
  </div>
</template>
