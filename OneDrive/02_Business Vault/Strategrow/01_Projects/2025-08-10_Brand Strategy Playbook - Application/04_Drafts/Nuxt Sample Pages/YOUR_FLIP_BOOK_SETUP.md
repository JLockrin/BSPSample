# Your Flip Book Setup

## 🎯 Configuration Complete!

Your flip book is now configured with **10 landing pages** and **15 blur-through pages** for a realistic page-flipping experience!

---

## 📚 Landing Pages (Where Users Can Stop)

These are the high-quality pages where users will land and can read:

| Index | File | Description |
|-------|------|-------------|
| 0 | `/bsp/1.webp` | Page 1 - Title |
| 2 | `/bsp/3.webp` | Page 3 |
| 7 | `/bsp/8.webp` | Page 8 |
| 10 | `/bsp/11.webp` | Page 11 |
| 14 | `/bsp/15.webp` | Page 15 |
| 15 | `/bsp/16.webp` | Page 16 |
| 17 | `/bsp/18.webp` | Page 18 |
| 18 | `/bsp/19.webp` | Page 19 |
| 23 | `/bsp/24.webp` | Page 24 |
| 24 | `/bsp/25.webp` | Page 25 |

**Total: 10 landing pages** that users can navigate to and stop on.

---

## 🌀 Blur-Through Pages (Shown During Animation Only)

These pages appear briefly (blurred) during the flip animation:

| File | When It Appears |
|------|-----------------|
| `/bsp/blur/2.webp` | Flipping between pages 1 → 3 |
| `/bsp/blur/4.webp` | Flipping between pages 3 → 8 |
| `/bsp/blur/5.webp` | Flipping between pages 3 → 8 |
| `/bsp/blur/6.webp` | Flipping between pages 3 → 8 |
| `/bsp/blur/7.webp` | Flipping between pages 3 → 8 |
| `/bsp/blur/9.webp` | Flipping between pages 8 → 11 |
| `/bsp/blur/10.webp` | Flipping between pages 8 → 11 |
| `/bsp/blur/12.webp` | Flipping between pages 11 → 15 |
| `/bsp/blur/13.webp` | Flipping between pages 11 → 15 |
| `/bsp/blur/14.webp` | Flipping between pages 11 → 15 |
| `/bsp/blur/17.webp` | Flipping between pages 16 → 18 |
| `/bsp/blur/20.webp` | Flipping between pages 19 → 24 |
| `/bsp/blur/21.webp` | Flipping between pages 19 → 24 |
| `/bsp/blur/22.webp` | Flipping between pages 19 → 24 |
| `/bsp/blur/23.webp` | Flipping between pages 19 → 24 |

**Total: 15 blur-through pages** that create realistic page-flipping motion.

---

## 🎬 Example Navigation Flows

### Flow 1: Page 3 → Page 8
**User clicks "Next" from page 3**

1. ✨ **Flip animation starts**
2. 🌀 Shows pages **4, 5, 6, 7** (from blur folder) - blurred, 300ms each
3. 🎯 **Lands on page 8** (sharp, clear)

**What the user sees:**
- Realistic blur of 4 intermediate pages flying by
- Makes it clear there's more content than just the landing pages
- Feels like physically flipping through a book

---

### Flow 2: Page 11 → Page 15
**User clicks "Next" from page 11**

1. ✨ **Flip animation starts**
2. 🌀 Shows pages **12, 13, 14** (from blur folder) - blurred, 300ms each
3. 🎯 **Lands on page 15** (sharp, clear)

**What the user sees:**
- 3 blurred pages rapidly sliding by
- Horizontal motion blur with recognizable content
- Book-like page edge and spine visible throughout

---

### Flow 3: Page 19 → Page 24
**User clicks "Next" from page 19**

1. ✨ **Flip animation starts**
2. 🌀 Shows pages **20, 21, 22, 23** (from blur folder) - blurred, 300ms each
3. 🎯 **Lands on page 24** (sharp, clear)

**What the user sees:**
- 4 pages flipping by with recognizable (but blurred) content
- Each page visible for 300ms = ~1.2 seconds total animation
- Smooth transition to final landing page

---

### Flow 4: Page 16 → Page 15 (Backward)
**User clicks "Previous" from page 16**

1. ✨ **Flip animation starts (backwards)**
2. 🌀 Shows pages in reverse order
3. 🎯 **Lands on page 15** (sharp, clear)

**What the user sees:**
- Same smooth animation, but in reverse
- Pages flip from right to left
- Feels like going back through a physical book

---

## ⚡ Animation Settings

| Setting | Value | Effect |
|---------|-------|--------|
| `flip-interval-ms` | 300ms | Each intermediate page shows for 300ms |
| `max-flip-preview` | 25 pages | Max intermediate pages shown (prevents lag) |
| `blur-amount` | 3px | Blur applied to intermediate pages |
| `transform` | translateX, rotateY, scale | 3D page-turning motion |

---

## 🎨 Visual Effects

### Landing Pages (Sharp Focus)
- ✅ High resolution
- ✅ No blur
- ✅ Full contrast and brightness
- ✅ User can read content clearly

### Blur-Through Pages (During Animation)
- 🌀 Blurred (3px Gaussian blur)
- 🌀 Reduced brightness (85%)
- 🌀 Slight transparency (92% opacity)
- 🌀 3D transform (6° rotation, 97% scale)
- 🌀 Horizontal motion blur overlay
- 🌀 Depth shadows

---

## 🔧 How It Works Technically

### Component Logic (`srcFor()` function):

```typescript
function srcFor(idx: number) {
  // First check if this is a curated landing page
  if (props.pagesMap[idx]) {
    return props.pagesMap[idx];  // e.g., '/bsp/8.webp'
  }
  // Otherwise, check the blur folder for in-between content
  return `/bsp/blur/${idx}.webp`;  // e.g., '/bsp/blur/4.webp'
}
```

### What Happens During Navigation:

1. **User clicks "Next"**
2. Component calculates all page indices between current and target
3. For each intermediate index:
   - Checks if it's a landing page (in `pagesMap`)
   - If not, loads from `/bsp/blur/X.webp`
4. Displays each intermediate page for 300ms with blur effects
5. Lands on target page in sharp focus

---

## 📊 Your Complete Deck Structure

```
Page 1  ← Landing (Title)
Page 2  ← Blur-through
Page 3  ← Landing
Pages 4-7 ← Blur-through
Page 8  ← Landing
Pages 9-10 ← Blur-through
Page 11 ← Landing
Pages 12-14 ← Blur-through
Page 15 ← Landing
Page 16 ← Landing (adjacent pages, no blur between)
Page 17 ← Blur-through
Page 18 ← Landing
Page 19 ← Landing (adjacent pages, no blur between)
Pages 20-23 ← Blur-through
Page 24 ← Landing
Page 25 ← Landing (final page)
```

**Total Presentation:**
- 25 pages in your visual deck
- 10 landing pages (users can stop)
- 15 blur-through pages (animation only)

---

## ✨ The User Experience

When someone interacts with your flip book:

1. **Starts on Page 1** (Title slide)
2. **Clicks "Next"**
   - Page 2 blurs by quickly (300ms)
   - **Lands on Page 3** ✓
3. **Clicks "Next"**
   - Pages 4, 5, 6, 7 blur by (1.2 seconds total)
   - **Lands on Page 8** ✓
4. **And so on...**

The effect creates the impression of a **much larger deck** while only requiring users to stop on your **10 carefully curated pages**!

---

## 🎯 Perfect For:

✅ Showcasing a preview of your full Brand Strategy Playbook  
✅ Giving users a taste without overwhelming them  
✅ Creating FOMO ("there's so much more content!")  
✅ Maintaining engagement with realistic page-turning effects  
✅ Modal integration on landing pages  

---

## 🚀 Ready to Test!

Your flip book is fully configured and ready to go. Just refresh your browser at `http://localhost:3000` to see the new setup in action!

**Try navigating between:**
- Page 1 → Page 3 (shows blur page 2)
- Page 3 → Page 8 (shows blur pages 4-7) 
- Page 19 → Page 24 (shows blur pages 20-23)

The effect should now look **exactly like thumbing through a physical book** with realistic blurred content flying by! 📚✨

