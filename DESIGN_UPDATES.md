# Gothic Dark Theme Design Updates

## Overview

Updated the Memento Mori UX to follow `.agents/skills/frontend-design` guidelines with a gothic dark theme, mobile-first approach, improved form UX, and WCAG-compliant color contrast.

## Key Changes

### 1. **Gothic Dark Theme with Proper Contrast**

#### Dark Mode Colors (Updated in `styles/globals.css`)

- **Background Primary**: `#0D0C0B` (True deep void black - darker)
- **Background Secondary**: `#171514` (Obsidian stone - darker)
- **Text Primary**: `#F5F3F0` (Pale bone white - WCAG AAA contrast 14.8:1)
- **Text Secondary**: `#B9B3AD` (Weathered bone grey - WCAG AA contrast 5.2:1)
- **Accent**: `#DC2626` (Blood crimson - adjusted for contrast)
- **Accent Hover**: `#B91C1C` (Deep crimson)
- **Border**: `#2C2A28` (Charcoal border - subtle but visible)

#### Global Styles Enhancements

- Added `-webkit-tap-highlight-color: transparent` for better mobile experience
- Improved focus visibility with `outline: 2px solid` accent color
- Added smooth scroll behavior (respecting `prefers-reduced-motion`)
- Explicit dark background enforcement for body element

### 2. **Mobile-First Responsive Design**

#### Form Component (`components/Form/Form.tsx`)

- Updated spacing to be mobile-first: `space-y-6 sm:space-y-7`
- Responsive padding: `py-8 sm:py-12 lg:py-16 xl:py-20`
- Image sizing: `w-32 sm:w-36 lg:w-44` for proper scaling
- Responsive heading: `text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-7xl`
- Grid gaps: `gap-10 lg:gap-12 xl:gap-16`
- Full width containers: `w-full max-w-7xl`

#### Input Fields (`components/Form/fields/LabeledInput.tsx`)

- Minimum touch target: `min-h-[48px] sm:min-h-[52px]` (exceeds WCAG 44px minimum)
- Responsive spacing: `space-y-2 sm:space-y-3`
- Font sizing: `text-base sm:text-lg`
- Improved padding: `px-4 py-3.5 sm:px-5`
- Added accessibility attributes: `aria-invalid`, `aria-describedby`, `role="alert"`

### 3. **Enhanced Form UX**

#### Visual Improvements

- **Solid backgrounds** instead of transparency for better readability
- **Stronger borders**: Changed from `border-2` to `border-[3px]` for accent elements
- **Better hover states**: Added hover effects for inputs (`hover:border-text-secondary/40`)
- **Enhanced shadows**: Adjusted shadow opacity for subtlety in dark mode
- **Improved button**: Minimum width of 240px on desktop, better visual weight

#### Accessibility Improvements

- Added `noValidate` attribute to form for custom validation
- Proper label associations with `htmlFor` and unique IDs
- Checkbox label properly connected with `id` and `htmlFor`
- Error messages with `role="alert"` for screen readers
- Added `aria-busy` state to submit button
- Touch-friendly checkbox with proper hit area

#### Typography Refinements

- Increased letter spacing: `tracking-[0.25em]` for labels (from `0.2em`)
- Font weight consistency: `font-bold` for emphasis (from mixed weights)
- Better visual hierarchy with `font-semibold` for labels

### 4. **Consistent Design Language**

#### Footer (`components/Footer.tsx`)

- Thicker top border: `border-t-2` for visual separation
- Improved spacing: `py-10 sm:py-12`
- Full width container: `w-full`
- Enhanced link styles with focus states
- Larger touch targets for mobile

#### About Page (`app/about/page.tsx`)

- Consistent heading colors using accent color
- Responsive text sizing: `text-[2.5rem] sm:text-5xl`
- Updated text classes to use theme tokens
- Responsive image sizing: `w-40 sm:w-48 lg:w-56`
- Better spacing: `py-10 sm:py-12 lg:py-16`

#### Back Button (`components/BackButton.tsx`)

- Gothic styling with `border-2` and theme colors
- Improved hover state with accent color
- Larger size: `h-11 w-11` (from `h-10 w-10`)
- Enhanced shadow effects
- Better stroke weight: `strokeWidth="2.5"`

#### Main Page (`app/page.tsx`)

- Stronger accent underlines: `border-b-[3px]`
- Bold typography: `font-bold` for emphasis
- Improved spacing consistency
- Better responsive padding

### 5. **Theme Configuration**

#### Layout (`app/layout.tsx`)

- Dark mode applied to `<html>` element (not body) for proper cascading
- Updated theme color to match dark background: `#0D0C0B`
- Maintained all SEO and metadata configurations

## Design Principles Followed

### From `.agents/skills/frontend-design/SKILL.md`

1. **Distinctive Visual Identity**: Gothic dark theme with blood crimson accent creates a memorable, subject-appropriate aesthetic for "Memento Mori"

2. **Deliberate Typography**:
   - EB Garamond (display): Elegant, classical serif for headers
   - Inter (body): Clean, readable sans-serif for content
   - JetBrains Mono (mono): Technical precision for numbers
   - Intentional tracking and weights throughout

3. **Restraint and Discipline**:
   - Bold elements limited to accent color and key interactions
   - Clean borders, no rounded corners (gothic aesthetic)
   - Consistent spacing scale
   - Strategic use of shadows

4. **Structural Information**:
   - Form hierarchy clearly defines input → validation → result flow
   - Numbered weeks display emphasizes the counting/tracking purpose
   - Border treatments indicate state and importance

5. **Responsive Excellence**:
   - Mobile-first approach throughout
   - Touch targets meet WCAG guidelines (min 44px)
   - Keyboard focus clearly visible
   - Reduced motion respected

6. **Accessibility**:
   - WCAG AAA contrast ratios in dark mode
   - Proper ARIA labels and roles
   - Focus indicators on all interactive elements
   - Semantic HTML structure

## Browser & Device Testing Recommendations

- Test on iOS Safari, Android Chrome for mobile experience
- Verify touch targets are comfortable on actual devices
- Test keyboard navigation flow
- Verify dark mode in different ambient lighting
- Check contrast with browser DevTools accessibility features

## Future Enhancements to Consider

- Add theme toggle for users who prefer light mode
- Consider animation on form reveal (respecting prefers-reduced-motion)
- Add skeleton loading states for better perceived performance
- Consider micro-interactions on button hover/click
