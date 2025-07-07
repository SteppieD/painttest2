# AdCreative.ai Design System Implementation Guide

This guide helps you implement the AdCreative.ai-inspired design system throughout your Paint Quote App.

## 🎨 Design Philosophy

The AdCreative.ai design system focuses on:
- **High-converting UI patterns** with prominent CTAs
- **Modern gradient backgrounds** (purple/pink theme)
- **Elevated cards** with strong shadows
- **Clear visual hierarchy** with size and color
- **Smooth animations** for premium feel
- **Mobile-first responsive design**

## 🚀 Quick Start

### 1. Import the Design System

Add to your `app/globals.css`:

```css
/* Import AdCreative Design System */
@import url('/styles/adcreative-design-system.css');

/* Your existing styles */
```

### 2. Update Layout Structure

Replace your current header/navbar with the new ACNavbar component:

```tsx
// app/layout.tsx
import { ACNavbar } from '@/components/adcreative/ACNavbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ACNavbar />
        <main style={{ paddingTop: '72px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
```

## 📦 Component Examples

### Hero Section

```tsx
<section className="ac-hero">
  <div className="ac-hero-container">
    <div className="ac-hero-content">
      <div className="ac-hero-badge">
        ⚡ Trusted by 5,000+ Contractors
      </div>
      <h1 className="ac-hero-title">
        Professional Quotes in Minutes
      </h1>
      <p className="ac-hero-subtitle">
        Create winning painting quotes 14x faster with AI-powered estimation
      </p>
      <ul className="ac-hero-features">
        <li className="ac-hero-feature">
          <Check /> 30-second quote generation
        </li>
        <li className="ac-hero-feature">
          <Check /> 99% accuracy with AI
        </li>
      </ul>
      <div className="ac-hero-cta">
        <Link href="/trial-signup" className="ac-btn ac-btn-primary ac-btn-lg">
          Start Free Trial
        </Link>
        <Link href="/demo" className="ac-btn ac-btn-secondary ac-btn-lg">
          <PlayCircle /> Watch Demo
        </Link>
      </div>
    </div>
    <div className="ac-hero-visual">
      {/* Your hero image/graphic */}
    </div>
  </div>
</section>
```

### Pricing Cards

```tsx
<div className="ac-pricing-grid">
  <div className="ac-pricing-card">
    <h3>Starter</h3>
    <div className="ac-pricing-price">
      $79<span className="ac-pricing-period">/month</span>
    </div>
    <ul>
      <li>✓ Unlimited quotes</li>
      <li>✓ AI assistance</li>
    </ul>
    <button className="ac-btn ac-btn-secondary ac-btn-lg">
      Get Started
    </button>
  </div>
  
  <div className="ac-pricing-card featured">
    <div className="ac-pricing-badge">Most Popular</div>
    <h3>Professional</h3>
    <div className="ac-pricing-price">
      $149<span className="ac-pricing-period">/month</span>
    </div>
    <ul>
      <li>✓ Everything in Starter</li>
      <li>✓ Team collaboration</li>
      <li>✓ API access</li>
    </ul>
    <button className="ac-btn ac-btn-primary ac-btn-lg">
      Start Free Trial
    </button>
  </div>
</div>
```

### Feature Cards with Score

```tsx
<div className="ac-card">
  <div className="ac-score-card">
    <div className="ac-score-value">99</div>
    <div className="ac-score-label">Accuracy Score</div>
  </div>
  <div className="ac-card-body">
    <h3>AI-Powered Estimation</h3>
    <p>Get accurate quotes every time with our advanced AI</p>
  </div>
</div>
```

### Forms

```tsx
<form className="ac-form">
  <div className="ac-form-group">
    <label className="ac-label">Email Address</label>
    <input 
      type="email" 
      className="ac-input" 
      placeholder="you@company.com"
    />
  </div>
  
  <div className="ac-form-group">
    <label className="ac-label">Company Size</label>
    <select className="ac-select">
      <option>1-5 employees</option>
      <option>6-20 employees</option>
      <option>21+ employees</option>
    </select>
  </div>
  
  <button className="ac-btn ac-btn-primary ac-btn-lg">
    Submit
  </button>
</form>
```

## 🎨 Color Usage Guidelines

### Primary Actions
- **Pink (#ef2b70)**: Main CTAs, primary buttons, important links
- **Pink Hover (#d91e5a)**: Hover states for primary elements

### Backgrounds
- **Dark Purple (#1E1541)**: Hero sections, dark backgrounds
- **Gradient**: Use `ac-bg-dark` class for purple gradient backgrounds

### Text
- **Headers**: Use gradient text effect on dark backgrounds
- **Body**: Gray-700 on light, Gray-300 on dark

### Status Colors
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)

## 📱 Responsive Patterns

### Mobile-First Approach
```css
/* Mobile styles (default) */
.ac-hero-title {
  font-size: var(--text-3xl);
}

/* Desktop enhancement */
@media (min-width: 768px) {
  .ac-hero-title {
    font-size: var(--text-5xl);
  }
}
```

### Grid Layouts
```html
<!-- Auto-responsive grid -->
<div className="ac-grid-3">
  <!-- Becomes 2 columns on tablet, 1 on mobile -->
</div>
```

## 🚀 Migration Checklist

1. **Global Styles**
   - [ ] Import adcreative-design-system.css
   - [ ] Remove conflicting styles
   - [ ] Update CSS variables to match

2. **Navigation**
   - [ ] Replace header with ACNavbar
   - [ ] Update nav links and dropdowns
   - [ ] Test mobile menu

3. **Buttons**
   - [ ] Replace all buttons with ac-btn classes
   - [ ] Update primary CTAs to pink
   - [ ] Add hover animations

4. **Cards & Containers**
   - [ ] Add ac-card class to card components
   - [ ] Increase border radius to match
   - [ ] Add stronger shadows

5. **Forms**
   - [ ] Update input styles with ac-input
   - [ ] Add focus states with pink accent
   - [ ] Update error states

6. **Typography**
   - [ ] Use responsive font sizes
   - [ ] Add gradient text effects
   - [ ] Update font weights

## 🎯 Key Design Principles

1. **Conversion-Focused**
   - Make CTAs impossible to miss
   - Use color psychology (pink = action)
   - Create visual hierarchy

2. **Trust Building**
   - Professional shadows and depth
   - Smooth animations
   - Consistent spacing

3. **Mobile Excellence**
   - Touch-friendly tap targets (44px min)
   - Readable fonts on all devices
   - Fast-loading animations

4. **Brand Consistency**
   - Pink accent throughout
   - Purple gradient backgrounds
   - Rounded corners (16-24px)

## 🔧 Utility Classes Reference

### Spacing
- `ac-mt-{1,2,4,6,8}` - Margin top
- `ac-mb-{1,2,4,6,8}` - Margin bottom
- `ac-p-{1,2,4,6,8}` - Padding

### Layout
- `ac-flex` - Flexbox container
- `ac-flex-center` - Center all content
- `ac-flex-between` - Space between items
- `ac-grid-{2,3,4}` - Grid layouts

### Text
- `ac-text-center` - Center text
- `ac-text-primary` - Pink text
- `ac-text-white` - White text

### Effects
- `ac-fade-in` - Fade in animation
- `ac-slide-in` - Slide in from left
- `ac-float` - Floating animation
- `ac-skeleton` - Loading skeleton

## 🎬 Animation Guidelines

Use animations sparingly but effectively:
- **Hover states**: All interactive elements
- **Page transitions**: Fade in content
- **Loading states**: Skeleton screens
- **Micro-interactions**: Button presses

```css
/* Example hover animation */
.ac-feature-card {
  transition: all 300ms ease;
}

.ac-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}
```

## 🚨 Common Pitfalls

1. **Don't mix design systems** - Remove Tailwind classes when using AC classes
2. **Maintain shadow hierarchy** - Cards should "float" above the page
3. **Keep animations smooth** - 60fps is the target
4. **Test on real devices** - Especially the mobile menu
5. **Preserve accessibility** - Maintain color contrast ratios

---

**Remember**: The goal is a premium, high-converting interface that makes users trust your product immediately. Every design decision should support this goal.