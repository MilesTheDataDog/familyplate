# Responsive Design

## Overview

FamilyPlate implements a mobile-first responsive design strategy to ensure an optimal user experience across all device sizes. Using Tailwind CSS utility classes, the application adapts seamlessly from mobile phones (320px) to large desktop displays (2560px+).

**Version:** 1.0.0  
**Last Updated:** December 10, 2025  
**Status:** Production

---

## Design Philosophy

### Mobile-First Approach

FamilyPlate follows a mobile-first design philosophy:

1. **Design for mobile first** - Base styles target small screens
2. **Progressive enhancement** - Add complexity for larger screens
3. **Touch-friendly** - Large touch targets (minimum 44x44px)
4. **Performance-focused** - Optimize for slower mobile connections
5. **Content-priority** - Essential content visible without scrolling

### Core Principles

- **Fluid layouts** - Use percentages and viewport units
- **Flexible images** - Scale images within containers
- **Media queries** - Breakpoint-based style adjustments
- **Readable typography** - Appropriate font sizes for each device
- **Accessible spacing** - Comfortable padding and margins

---

## Breakpoint System

### Tailwind CSS Breakpoints

FamilyPlate uses Tailwind's default breakpoint system:

| Breakpoint | Min Width | Target Devices | Usage |
|-----------|-----------|----------------|-------|
| `(default)` | 0px | Mobile phones | Base styles |
| `sm:` | 640px | Large phones, small tablets | Enhanced mobile |
| `md:` | 768px | Tablets, small laptops | Tablet optimization |
| `lg:` | 1024px | Laptops, desktops | Desktop layout |
| `xl:` | 1280px | Large desktops | Spacious layout |
| `2xl:` | 1536px | Very large screens | Maximum width |

### Breakpoint Usage Pattern

```javascript
// Mobile-first: smallest screens first, then enhance
className="
  p-4           // 16px padding on mobile
  sm:p-6        // 24px padding on small+ screens
  md:p-8        // 32px padding on medium+ screens
  lg:p-10       // 40px padding on large+ screens
"
```

---

## Layout Patterns

### Container Patterns

#### Max-Width Container
```javascript
<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
  {/* Content constrained to 896px with responsive padding */}
</div>
```

#### Full-Width with Padding
```javascript
<div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
  {/* Full width with responsive edge padding */}
</div>
```

#### Flexible Grid
```javascript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

---

## Component Responsiveness

### Top Bar Component

```javascript
<div className="fixed top-0 left-0 right-0 bg-white shadow-md z-30 
                px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
      <Icon component={Menu} size={24} />
    </button>
    <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
      FamilyPlate
    </h1>
    <div className="w-8 sm:w-10"></div>
  </div>
</div>
```

**Responsive Features:**
- Padding adjusts from 12px → 16px → 24px
- Title font size scales: 18px → 20px → 24px
- Icon button padding increases on larger screens
- Spacer width adjusts to maintain symmetry

---

### Hamburger Menu

```javascript
<div className="fixed top-0 left-0 h-full 
                w-64 sm:w-72 md:w-80 
                bg-white shadow-2xl z-50">
  <div className="p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Menu</h2>
    <nav className="space-y-2">
      <button className="w-full flex items-center gap-4 p-4 rounded-xl">
        <Icon component={Home} size={24} />
        <span>Home</span>
      </button>
    </nav>
  </div>
</div>
```

**Responsive Features:**
- Menu width: 256px → 288px → 320px
- Internal padding: 16px → 24px
- Title size: 20px → 24px
- Spacing between elements scales proportionally

---

### Recipe Card Grid

```javascript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                gap-4 sm:gap-6">
  {recipes.map(r => (
    <div key={r.id} className="bg-white rounded-xl sm:rounded-2xl 
                                shadow-lg overflow-hidden">
      <img src={r.image} 
           className="w-full h-40 sm:h-48 object-cover" />
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold">{r.title}</h3>
        <p className="text-xs sm:text-sm text-gray-400">{r.dateAdded}</p>
      </div>
    </div>
  ))}
</div>
```

**Responsive Features:**
- Grid layout: 1 column → 2 columns → 3 columns
- Gap spacing: 16px → 24px
- Border radius: 12px → 16px
- Image height: 160px → 192px
- Card padding: 16px → 24px
- Title size: 18px → 20px
- Date text: 12px → 14px

---

### Recipe Detail View

```javascript
<div className="max-w-4xl mx-auto 
                px-3 sm:px-4 pb-6 sm:pb-8">
  <div className="bg-white rounded-2xl sm:rounded-3xl 
                  shadow-xl overflow-hidden">
    <img src={recipe.image} 
         className="w-full max-h-64 sm:max-h-80 md:max-h-96 
                    object-contain bg-gray-100" />
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
        {recipe.title}
      </h1>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 
                      mb-6 sm:mb-8 text-sm sm:text-base">
        {/* Recipe metadata */}
      </div>
    </div>
  </div>
</div>
```

**Responsive Features:**
- Container padding: 12px → 16px → 24px
- Border radius: 16px → 24px
- Image max height: 256px → 320px → 384px
- Content padding: 16px → 24px → 32px
- Title size: 24px → 30px → 36px
- Metadata gap: 8px → 16px
- Text size: 14px → 16px

---

## Typography Scale

### Heading Sizes

| Element | Mobile | Small | Medium | Large |
|---------|--------|-------|--------|-------|
| H1 (Hero) | 24px (text-2xl) | 30px (text-3xl) | 36px (text-4xl) | 48px (text-5xl) |
| H2 (Section) | 20px (text-xl) | 24px (text-2xl) | 30px (text-3xl) | - |
| H3 (Card) | 18px (text-lg) | 20px (text-xl) | - | - |
| Body | 14px (text-sm) | 16px (text-base) | - | - |
| Small | 12px (text-xs) | 14px (text-sm) | - | - |

### Font Size Classes

```javascript
// Hero heading
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"

// Section heading
className="text-xl sm:text-2xl md:text-3xl"

// Card title
className="text-lg sm:text-xl"

// Body text
className="text-sm sm:text-base"

// Small text
className="text-xs sm:text-sm"
```

---

## Spacing System

### Padding Scale

| Size | Mobile | Small+ | Medium+ | Large+ |
|------|--------|--------|---------|--------|
| XS | 8px (p-2) | 12px (p-3) | - | - |
| S | 12px (p-3) | 16px (p-4) | - | - |
| M | 16px (p-4) | 24px (p-6) | 32px (p-8) | - |
| L | 24px (p-6) | 32px (p-8) | 40px (p-10) | 48px (p-12) |

### Margin Scale

```javascript
// Small margin
className="mb-2 sm:mb-3"          // 8px → 12px

// Medium margin
className="mb-4 sm:mb-6"          // 16px → 24px

// Large margin
className="mb-6 sm:mb-8"          // 24px → 32px

// Extra large margin
className="mb-8 sm:mb-12"         // 32px → 48px
```

---

## Touch Targets

### Minimum Touch Target Size

All interactive elements meet WCAG accessibility guidelines:

- **Minimum size**: 44x44px (11rem × 11rem)
- **Recommended size**: 48x48px (12rem × 12rem)
- **Spacing between targets**: Minimum 8px

### Button Sizing

```javascript
// Small button (mobile-optimized)
className="px-4 py-2 sm:px-6 sm:py-3"

// Medium button
className="px-6 py-3 sm:px-8 sm:py-4"

// Large button
className="px-8 py-4 sm:px-10 sm:py-5"

// Icon button (minimum 44x44)
className="p-2 sm:p-3"  // 44px → 52px total
```

---

## Image Handling

### Responsive Images

```javascript
// Contain strategy (recipe detail)
<img 
  src={recipe.image} 
  alt={recipe.title}
  className="w-full max-h-64 sm:max-h-80 md:max-h-96 
             object-contain bg-gray-100"
/>

// Cover strategy (recipe card)
<img 
  src={recipe.image} 
  alt={recipe.title}
  className="w-full h-40 sm:h-48 object-cover"
/>
```

### Image Compression Strategy

All uploaded images are compressed to maximize performance:

```javascript
const compressImage = (dataUrl) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let w = img.width, h = img.height;
    
    // Max width: 1200px (optimal for all screens)
    if (w > 1200) { 
      h = (h * 1200) / w; 
      w = 1200; 
    }
    
    canvas.width = w; 
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    
    // 80% JPEG quality
    resolve(canvas.toDataURL('image/jpeg', 0.8));
  };
  img.src = dataUrl;
});
```

**Image Size Guidelines:**
- Original: 2-5MB
- Compressed: 50-150KB (~95% reduction)
- Max width: 1200px
- Format: JPEG
- Quality: 80%

---

## Performance Optimization

### Mobile Performance

1. **Code Splitting**
   - Load components on-demand
   - Reduce initial bundle size
   - Faster first paint

2. **Image Lazy Loading**
   ```javascript
   <img loading="lazy" src={recipe.image} alt={recipe.title} />
   ```

3. **Optimized Animations**
   - Use CSS transforms (GPU-accelerated)
   - Avoid layout thrashing
   - Debounce scroll/resize handlers

4. **Resource Hints**
   ```html
   <link rel="preconnect" href="https://api.anthropic.com">
   <link rel="dns-prefetch" href="https://api.anthropic.com">
   ```

---

## Testing Responsive Design

### Manual Testing Checklist

**Mobile (320px - 480px):**
- [ ] All text readable without zooming
- [ ] Buttons easily tappable (44px minimum)
- [ ] No horizontal scrolling
- [ ] Images scale properly
- [ ] Menu fully accessible
- [ ] Forms usable with on-screen keyboard

**Tablet (481px - 1024px):**
- [ ] Layout uses available space efficiently
- [ ] Grid adjusts to 2 columns where appropriate
- [ ] Touch targets remain adequate
- [ ] Images display at higher quality
- [ ] Navigation intuitive

**Desktop (1025px+):**
- [ ] Content centered with max-width
- [ ] Grid expands to 3 columns
- [ ] Hover states functional
- [ ] Large screens don't feel empty
- [ ] Text line length comfortable (60-80 chars)

### Browser DevTools Testing

```javascript
// Common test viewports
const testViewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12 Pro', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Laptop', width: 1440, height: 900 },
  { name: 'Desktop', width: 1920, height: 1080 }
];
```

### Automated Responsive Testing

```javascript
describe('Responsive Design', () => {
  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1440, height: 900, name: 'Desktop' }
  ];
  
  viewports.forEach(viewport => {
    test(`renders correctly on ${viewport.name}`, async () => {
      await page.setViewport({
        width: viewport.width,
        height: viewport.height
      });
      
      await page.goto('/');
      
      // Check for layout shift
      const cls = await page.evaluate(() => {
        return new Promise(resolve => {
          new PerformanceObserver(list => {
            const entries = list.getEntries();
            const cls = entries.reduce((sum, entry) => 
              sum + entry.value, 0
            );
            resolve(cls);
          }).observe({ type: 'layout-shift', buffered: true });
        });
      });
      
      expect(cls).toBeLessThan(0.1); // Good CLS score
    });
  });
});
```

---

## Accessibility

### Screen Reader Support

```javascript
// Announce layout changes
<div 
  role="region" 
  aria-label="Recipe library"
  aria-live="polite"
>
  {recipes.map(/* ... */)}
</div>
```

### Keyboard Navigation

- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Skip links for main content

### Color Contrast

All text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- Interactive elements: Clear visual indicators

---

## Common Responsive Patterns

### Responsive Flex Layout

```javascript
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-4">
  <div className="flex-1">Left content</div>
  <div className="flex-1">Right content</div>
</div>
```

### Conditional Rendering

```javascript
// Show different content based on screen size
<div className="block sm:hidden">
  {/* Mobile-only content */}
</div>
<div className="hidden sm:block">
  {/* Desktop-only content */}
</div>
```

### Responsive Icons

```javascript
// Icon size scales with screen
<Icon 
  component={Camera} 
  size={24}  // Always 24px for consistency
  className="sm:w-6 sm:h-6 lg:w-8 lg:h-8"  // Override with classes if needed
/>
```

---

## Future Enhancements

### Planned Improvements

1. **Dynamic Viewport Detection**
   - Detect actual device capabilities
   - Optimize based on connection speed
   - Adaptive image loading

2. **Container Queries**
   - Component-level responsive design
   - More flexible layouts
   - Better component reusability

3. **Dark Mode**
   - System preference detection
   - Manual toggle option
   - Smooth transitions

4. **Print Styles**
   - Optimized recipe printing
   - Remove navigation elements
   - Clean, readable format

---

## Best Practices

### DO:

✅ Test on real devices, not just browser emulators  
✅ Use relative units (rem, em, %) over fixed pixels  
✅ Design touch-first for mobile interfaces  
✅ Optimize images for each breakpoint  
✅ Consider landscape orientation  
✅ Test with slow 3G connections  
✅ Validate with accessibility tools  

### DON'T:

❌ Assume all mobile devices are phones  
❌ Hide important content on mobile  
❌ Use fixed heights that break on small screens  
❌ Forget about tablet (the "in-between" size)  
❌ Rely only on hover states for interaction  
❌ Neglect performance on lower-end devices  
❌ Use tiny touch targets (<44px)  

---

## Tools & Resources

### Development Tools

- **Chrome DevTools** - Device emulation, responsive mode
- **Firefox Responsive Design Mode** - Multiple viewport testing
- **BrowserStack** - Real device testing
- **Lighthouse** - Performance and accessibility audits

### Useful Tailwind Utilities

```javascript
// Display utilities
className="hidden sm:block"
className="block sm:hidden"

// Spacing utilities
className="p-4 sm:p-6 lg:p-8"
className="gap-4 sm:gap-6"

// Typography utilities
className="text-sm sm:text-base lg:text-lg"
className="leading-tight sm:leading-normal"

// Layout utilities
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
className="flex flex-col sm:flex-row"
```

---

## Related Documentation

- [Architecture Overview](../architecture/overview.md)
- [Component Library](../guides/components.md)
- [Testing Guide](../guides/testing.md)
- [Performance Optimization](../guides/performance.md)

---

## Changelog

### Version 1.0.0 (December 10, 2025)
- Initial responsive design implementation
- Mobile-first approach established
- Tailwind CSS breakpoint system
- Touch-optimized interactions
- Image compression strategy
- Accessibility guidelines
- Testing procedures documented