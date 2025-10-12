<script setup lang="ts">
/**
 * Brand Strategy Playbook - Curated Flip Book Demo
 * 
 * This page demonstrates TWO ways to use the flip book:
 * 1. Direct inline implementation (shown by default)
 * 2. Modal implementation (toggle with the button)
 * 
 * For your landing page, you'll likely want the MODAL version.
 * See MODAL_INTEGRATION.md for detailed instructions.
 */

const { open } = useFlipBookModal();
const showInline = ref(true);

/**
 * We'll "land" on these curated pages and hyper-flip through the
 * missing ones to imply depth. Indices are 0-based.
 */
const curated = [0, 1, 2, 3, 7, 8, 9]; // 1,2,3,4,8,9,10 in human terms

/** Map real slide indices -> your asset paths in /public/bsp */
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

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <!-- Demo Controls -->
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
          For your landing page, use the <strong>Modal View</strong>. See <code class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">MODAL_INTEGRATION.md</code> for integration instructions.
        </p>
      </div>
    </div>

    <!-- Inline View -->
    <section v-if="showInline" class="px-4 py-12">
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
    </section>

    <!-- Modal View Demo Message -->
    <section v-else class="px-4 py-12">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">
          Modal View
        </h2>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6">
          Click the "Modal View" button again to see the flip book in a modal overlay.
        </p>
        <button
          @click="open"
          class="px-8 py-4 bg-gradient-to-r from-[#F68E15] to-[#CB5588] text-white rounded-lg text-lg font-medium hover:shadow-lg transition-shadow"
        >
          Open Flip Book Modal
        </button>
      </div>
    </section>

    <!-- The Modal Component (always included, shown when useFlipBookModal().isOpen is true) -->
    <FlipBookModal />
  </div>
</template>


