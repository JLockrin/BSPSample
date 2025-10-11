/**
 * Composable for managing the Flip Book modal state
 * 
 * Usage:
 * const { isOpen, open, close, toggle, pagesMap, curated } = useFlipBookModal();
 */

export const useFlipBookModal = () => {
  const isOpen = useState('flipBookModal', () => false);

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

  const open = () => {
    isOpen.value = true;
    // Prevent body scroll when modal is open
    if (process.client) {
      document.body.style.overflow = 'hidden';
    }
  };

  const close = () => {
    isOpen.value = false;
    // Restore body scroll
    if (process.client) {
      document.body.style.overflow = '';
    }
  };

  const toggle = () => {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  };

  // Handle escape key
  if (process.client) {
    onMounted(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen.value) {
          close();
        }
      };
      window.addEventListener('keydown', handleEscape);
      onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleEscape);
        // Cleanup: ensure scroll is restored
        document.body.style.overflow = '';
      });
    });
  }

  return {
    isOpen,
    open,
    close,
    toggle,
    pagesMap,
    curated
  };
};

