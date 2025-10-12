<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

type Props = {
  /** total slides in the real deck (for breadth illusion) */
  totalPages: number;                  // e.g., 30
  /** curated LANDING pages (0-based absolute indices) */
  curatedIndices: number[];            // e.g., [0,1,2,3,7,8,9]
  /** map: absolute index -> image URL in /public */
  pagesMap: Record<number, string>;
  title?: string;
  startAt?: number;                    // default 0 (index into curatedIndices)
  flipIntervalMs?: number;             // ms between "hyper-flip" frames
  maxFlipPreview?: number;             // cap the # of in-between previews
  className?: string;
};

const props = withDefaults(defineProps<Props>(), {
  startAt: 0,
  flipIntervalMs: 300,
  maxFlipPreview: 25,
  className: ''
});

const cPos = ref(Math.max(0, Math.min(props.startAt, props.curatedIndices.length - 1)));
const showIdx = ref(props.curatedIndices[cPos.value] ?? 0);   // absolute index being shown
const isFlipping = ref(false);
const flipDirection = ref<'forward' | 'backward' | null>(null);
let intervalId: number | null = null;

const canGoPrev = computed(() => cPos.value > 0 && !isFlipping.value);
const canGoNext = computed(() => cPos.value < props.curatedIndices.length - 1 && !isFlipping.value);
const canJumpToStart = computed(() => cPos.value > 0 && !isFlipping.value);
const canJumpToEnd = computed(() => cPos.value < props.curatedIndices.length - 1 && !isFlipping.value);
const progress = computed(() => `${cPos.value + 1} / ${props.curatedIndices.length}`);

function srcFor(idx: number | undefined) {
  if (idx === undefined) return '';
  // First check if this is a curated landing page
  if (props.pagesMap[idx]) {
    return props.pagesMap[idx];
  }
  // Otherwise, check the blur folder for in-between content
  // Blur files are named 1-based (2.webp, 4.webp, etc.), so add 1 to the index
  return `/bsp/blur/${idx + 1}.webp`;
}

function buildPath(from: number, to: number) {
  const dir = to > from ? 1 : -1;
  let path: number[] = [];
  for (let i = from + dir; dir > 0 ? i < to : i > to; i += dir) path.push(i);

  // Downsample long gaps so it stays snappy on mobile, but always show the near-landing frame
  if (path.length > props.maxFlipPreview) {
    const take = props.maxFlipPreview;
    const stride = Math.max(1, Math.floor(path.length / take));
    path = path.filter((_, idx) => idx % stride === 0).slice(0, take);
    const near = dir > 0 ? to - 1 : to + 1;
    if (path[path.length - 1] !== near) path[path.length - 1] = near;
  }
  return { path, dir };
}

function go(dir: 1 | -1) {
  if (isFlipping.value) return;
  const target = cPos.value + dir;
  if (target < 0 || target >= props.curatedIndices.length) return;

  const from = props.curatedIndices[cPos.value]!;
  const to = props.curatedIndices[target]!;
  const { path, dir: d } = buildPath(from, to);

  isFlipping.value = true;
  flipDirection.value = d > 0 ? 'forward' : 'backward';
  document.documentElement.style.setProperty('--flip-skew', d > 0 ? '6deg' : '-6deg');

  let i = 0;
  showIdx.value = from;

  intervalId = window.setInterval(() => {
    if (i < path.length) {
      showIdx.value = path[i++] ?? 0;
    } else {
      showIdx.value = to;
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
      isFlipping.value = false;
      flipDirection.value = null;
      cPos.value = target;
      document.documentElement.style.removeProperty('--flip-skew');
    }
  }, props.flipIntervalMs) as unknown as number;
}

function jumpToStart() {
  if (isFlipping.value || cPos.value === 0) return;
  // Jump directly without animation
  cPos.value = 0;
  showIdx.value = props.curatedIndices[0] ?? 0;
}

function jumpToEnd() {
  if (isFlipping.value || cPos.value === props.curatedIndices.length - 1) return;
  // Jump directly without animation
  cPos.value = props.curatedIndices.length - 1;
  showIdx.value = props.curatedIndices[cPos.value] ?? 0;
}

function jumpToPage(targetPos: number) {
  if (isFlipping.value || targetPos === cPos.value) return;
  // Jump directly to the clicked page without animation
  cPos.value = targetPos;
  showIdx.value = props.curatedIndices[targetPos] ?? 0;
}

// keyboard
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') go(1);
  else if (e.key === 'ArrowLeft') go(-1);
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
  window.removeEventListener('keydown', onKey);
});
</script>

<template>
  <div :class="['w-full mx-auto', className]">
    <h2 v-if="title" class="text-2xl md:text-3xl font-semibold mb-4">
      {{ title }}
    </h2>

    <div class="relative max-w-4xl mx-auto py-8">
      <div class="relative select-none" style="perspective: 2000px;">
        <!-- Main frame -->
        <div 
          class="relative aspect-[16/9] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl overflow-visible"
          style="
            transform-style: preserve-3d;
            box-shadow: 
              0 2px 4px rgba(0,0,0,0.1),
              0 8px 16px rgba(0,0,0,0.15),
              0 16px 32px rgba(0,0,0,0.2),
              0 24px 48px rgba(0,0,0,0.25);
          "
        >
          <!-- Inner content container with overflow hidden -->
          <div class="absolute inset-0 rounded-xl overflow-hidden">

        <!-- Active page (image if available, else placeholder "page") -->
        <img
          v-if="srcFor(showIdx)"
          :key="`img-${showIdx}`"
          :src="srcFor(showIdx)"
          :alt="`Slide ${(showIdx ?? 0) + 1}`"
          class="w-full h-full object-contain"
          :class="{ 
            'will-change-transform': isFlipping,
            'page-slide-forward': isFlipping && flipDirection === 'forward',
            'page-slide-backward': isFlipping && flipDirection === 'backward'
          }"
          :style="isFlipping ? { 
            transform: 'translateX(' + (flipDirection === 'forward' ? '-18%' : '18%') + ') rotateY(' + (flipDirection === 'forward' ? '-6deg' : '6deg') + ') scale(0.97)', 
            filter: 'brightness(0.85) blur(3px)',
            boxShadow: (flipDirection === 'forward' ? '-12px' : '12px') + ' 20px 50px rgba(0,0,0,0.5)',
            opacity: '0.92',
            transition: 'all 0.28s ease-out'
          } : {
            transition: 'all 0.35s ease-in-out'
          }"
          draggable="false"
        />
        <div
          v-else
          :key="`ph-${showIdx}`"
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-700 to-neutral-600 text-white/60"
          :class="{ 
            'page-slide-forward': isFlipping && flipDirection === 'forward',
            'page-slide-backward': isFlipping && flipDirection === 'backward'
          }"
          :style="isFlipping ? { 
            transform: 'translateX(' + (flipDirection === 'forward' ? '-18%' : '18%') + ') rotateY(' + (flipDirection === 'forward' ? '-6deg' : '6deg') + ') scale(0.97)', 
            filter: 'blur(3px) brightness(0.85)',
            opacity: '0.88',
            transition: 'all 0.28s ease-out'
          } : {}"
        >
          <!-- Page-edge texture -->
          <div class="absolute inset-0 opacity-40"
               style="background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 6px);">
          </div>
          <span class="relative z-10 text-xs opacity-70">Page {{ (showIdx ?? 0) + 1 }}</span>
        </div>

            <!-- Minimal overlay effects - let the actual slide images show through -->
            <div
              v-show="isFlipping"
              class="pointer-events-none absolute inset-0 z-20"
            >
              <!-- Horizontal motion blur streaks -->
              <div
                class="absolute inset-0 opacity-25"
                :style="{
                  background: flipDirection === 'forward' 
                    ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 35%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 65%, transparent 100%)' 
                    : 'linear-gradient(-90deg, transparent 0%, rgba(255,255,255,0.2) 35%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 65%, transparent 100%)',
                  animation: 'horizontalMotion 280ms ease-in-out infinite',
                  mixBlendMode: 'overlay'
                }"
              />
              
              <!-- Subtle depth shadow -->
              <div
                class="absolute inset-0 opacity-20"
                :style="{
                  background: flipDirection === 'forward'
                    ? 'radial-gradient(ellipse 60% 100% at 10% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, transparent 60%)'
                    : 'radial-gradient(ellipse 60% 100% at 90% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, transparent 60%)'
                }"
              />
            </div>
          </div>

        <!-- Left arrow button - positioned outside the frame -->
        <button
          type="button"
          @click="go(-1)"
          :disabled="!canGoPrev"
          aria-label="Previous"
          class="absolute top-1/2 -translate-y-1/2 -left-6 md:-left-14 z-10
                 w-12 h-12 md:w-14 md:h-14 rounded-full
                 bg-white dark:bg-neutral-800 
                 shadow-lg hover:shadow-xl
                 flex items-center justify-center
                 transition-all duration-200
                 hover:scale-110
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg class="h-6 w-6 md:h-7 md:w-7 text-neutral-700 dark:text-white" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Right arrow button - positioned outside the frame -->
        <button
          type="button"
          @click="go(1)"
          :disabled="!canGoNext"
          aria-label="Next"
          class="absolute top-1/2 -translate-y-1/2 -right-6 md:-right-14 z-10
                 w-12 h-12 md:w-14 md:h-14 rounded-full
                 bg-white dark:bg-neutral-800
                 shadow-lg hover:shadow-xl
                 flex items-center justify-center
                 transition-all duration-200
                 hover:scale-110
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg class="h-6 w-6 md:h-7 md:w-7 text-neutral-700 dark:text-white" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-4 space-y-3">
        <!-- Visual progress indicator -->
        <div class="relative w-full max-w-md mx-auto px-2">
          <!-- Base track -->
          <div class="relative h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full overflow-visible">
            <!-- Progress fill -->
            <div 
              class="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F68E15] to-[#CB5588] rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${((curatedIndices[cPos] || 0) / (totalPages - 1)) * 100}%` }"
            />
            
            <!-- Curated page markers -->
            <div 
              v-for="(pageIdx, idx) in props.curatedIndices"
              :key="`marker-${pageIdx}`"
              class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer group"
              :style="{ left: `${(pageIdx / (props.totalPages - 1)) * 100}%` }"
              @click="jumpToPage(idx)"
              :title="`Page ${pageIdx + 1}`"
            >
              <!-- Marker dot -->
              <div 
                class="rounded-full transition-all duration-300"
                :class="idx === cPos 
                  ? 'w-3 h-3 bg-white dark:bg-white ring-2 ring-[#F68E15] shadow-lg' 
                  : 'w-2 h-2 bg-neutral-400 dark:bg-neutral-600 group-hover:bg-neutral-500 dark:group-hover:bg-neutral-500 group-hover:scale-125'"
              />
            </div>
          </div>

          <!-- Page number tooltip on hover -->
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="bg-neutral-800 dark:bg-neutral-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Page {{ (showIdx ?? 0) + 1 }} of {{ totalPages }}
            </div>
          </div>
        </div>

        <!-- Bottom controls row -->
        <div class="flex items-center justify-between text-sm text-neutral-500">
          <!-- Jump buttons -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="jumpToStart"
              :disabled="!canJumpToStart"
              aria-label="Jump to beginning"
              class="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 
                     hover:bg-neutral-300 dark:hover:bg-neutral-700
                     transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
              title="Jump to beginning"
            >
              <svg class="h-4 w-4 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="none">
                <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <button
              type="button"
              @click="jumpToEnd"
              :disabled="!canJumpToEnd"
              aria-label="Jump to end"
              class="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 
                     hover:bg-neutral-300 dark:hover:bg-neutral-700
                     transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
              title="Jump to end"
            >
              <svg class="h-4 w-4 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="none">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Progress counter -->
          <div class="font-medium">{{ progress }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes horizontalMotion {
  0%   { 
    transform: translateX(-100%) scaleX(1.2);
    opacity: 0.2;
  }
  50%  { 
    transform: translateX(0%) scaleX(1.5);
    opacity: 0.4;
  }
  100% { 
    transform: translateX(100%) scaleX(1.2);
    opacity: 0.2;
  }
}

@keyframes pageSlideForward {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  15% {
    opacity: 0.9;
  }
  85% {
    opacity: 0.9;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes pageSlideBackward {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  15% {
    opacity: 0.9;
  }
  85% {
    opacity: 0.9;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

.page-slide-forward {
  animation: pageSlideForward 0.28s ease-out;
}

.page-slide-backward {
  animation: pageSlideBackward 0.28s ease-out;
}

@keyframes pageFlipForward {
  0% {
    transform: rotateY(0deg);
    transform-origin: right center;
  }
  50% {
    transform: rotateY(-90deg);
    transform-origin: right center;
  }
  100% {
    transform: rotateY(-180deg);
    transform-origin: right center;
  }
}

@keyframes pageFlipBackward {
  0% {
    transform: rotateY(0deg);
    transform-origin: left center;
  }
  50% {
    transform: rotateY(90deg);
    transform-origin: left center;
  }
  100% {
    transform: rotateY(180deg);
    transform-origin: left center;
  }
}

.page-flip-forward {
  animation: pageFlipForward 0.6s ease-in-out;
}

.page-flip-backward {
  animation: pageFlipBackward 0.6s ease-in-out;
}
</style>

