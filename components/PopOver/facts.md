# CSS Anchor Positioning Facts

## Core Concepts

### Anchor Positioning API

- **Purpose**: Positions elements relative to other elements (anchors) automatically
- **Browser Support**: Chrome 125+, Edge 125+ (as of 2024-2026)
- **Key Properties**:
  - `anchor-name`: Defines an element as an anchor (e.g., `--my-anchor`)
  - `position-anchor`: Associates a positioned element with an anchor
  - `position-area`: Declarative grid-based positioning around anchor

### Position Area

- Uses a 3x3 grid around the anchor element
- Syntax: `position-area: <row> <column>`
- Values: `top`, `bottom`, `left`, `right`, `center`, `span-left`, `span-right`, etc.
- Example: `position-area: top left` places element at top-left of anchor

## Viewport-Aware Positioning

### Position Try Fallbacks

The `position-try-fallbacks` property enables automatic repositioning when overflow occurs.

**Important**: Browser tries fallbacks **in the order listed**, using the first one that fits completely without overflow. It does NOT automatically choose "most available space" unless you add `position-try-order`.

#### Predefined Flip Tactics (Recommended)

Convenient shortcuts that flip the element's position:

- **`flip-inline`**: Flips horizontally (left ↔ right)
- **`flip-block`**: Flips vertically (top ↔ bottom)
- **`flip-start`**: Flips diagonally across anchor
- **Combined**: `flip-block flip-inline` tries both directions

**How it works:**

```css
.popover {
  position-area: right; /* Default position */
  position-try-fallbacks:
    flip-inline,
    flip-block,
    flip-block flip-inline;
}
```

Browser behavior:

1. Tries default position (right)
2. If overflow, tries **first fallback** `flip-inline` (left)
3. If still overflow, tries **second fallback** `flip-block` (flips vertically)
4. If still overflow, tries **third fallback** `flip-block flip-inline` (both directions)
5. If none fit, reverts to default position

**Key characteristic**: Fallbacks are tried **sequentially in order**, not based on available space.

#### Custom Position Options

For precise control, use `@position-try` at-rules:

```css
@position-try --custom-bottom {
  position-area: bottom;
  margin-top: 10px;
  width: 200px;
}

.popover {
  position-try-fallbacks: --custom-bottom, flip-inline;
}
```

#### Position-Area Values as Fallbacks

Shortcut for simple position changes:

```css
.popover {
  position-area: top left;
  position-try-fallbacks: top, right, bottom, left;
}
```

### Fallback Order Strategy

**Critical**: Fallbacks are tried **in the order specified** until one fits completely without overflow.

**To prioritize by available space**, use `position-try-order`:

```css
.popover {
  position-area: top;
  position-try-fallbacks: bottom, left, right;
  position-try-order: most-height; /* NOW picks best space, not first in list */
}
```

**Without `position-try-order`:**

- Browser tries `bottom`, then `left`, then `right` in that exact order
- Uses the first one that fits

**With `position-try-order: most-height`:**

- Browser evaluates which fallback gives most vertical space
- Uses that one instead of sequential order

**Best practices:**

1. Order fallbacks from most to least preferred
2. Use flip tactics for common patterns
3. Add `position-try-order` if you want space-based selection
4. Combine tactics for corner cases: `flip-block flip-inline`

## Centering & Alignment

### Horizontal Centering

```css
.popover {
  position-area: top;
  inset-inline: anchor(center);
  translate: -50% 0;
}
```

### Vertical Centering

```css
.popover {
  position-area: right;
  inset-block: anchor(center);
  translate: 0 -50%;
}
```

### Full Centering

```css
.popover {
  position-area: center;
  inset-inline: anchor(center);
  inset-block: anchor(center);
  translate: -50% -50%;
}
```

## Margins & Spacing

### Preventing Overlap

Always add margins to prevent popover from touching trigger:

```css
.popover {
  position-area: right;
  margin-left: 0.625rem; /* 10px spacing */
}
```

### Direction-Specific Margins

Match margin direction to position:

- `right` → `margin-left`
- `left` → `margin-right`
- `top` → `margin-bottom`
- `bottom` → `margin-top`

## Conditional Hiding

### position-visibility Property

Controls when positioned elements are hidden:

- **`always`** (default): Always visible
- **`no-overflow`**: Hide when element overflows viewport/container
- **`anchors-visible`**: Hide when anchor is hidden/off-screen

```css
.tooltip {
  position-visibility: anchors-visible;
}
```

**Strong hiding**: Acts as `visibility: hidden` for element and descendants.

## Position Try Order

### position-try-order Property

Prioritizes fallbacks based on available space at initial render:

- **`normal`** (default): Use defined order
- **`most-width`**: Choose fallback with most horizontal space
- **`most-height`**: Choose fallback with most vertical space
- **`most-inline-size`**: Logical width
- **`most-block-size`**: Logical height

```css
.popover {
  position-area: top;
  position-try-fallbacks: bottom, left, right;
  position-try-order: most-height; /* Picks bottom if more space */
}
```

## Anchored Container Queries

### Detecting Active Fallback

Style descendants based on which fallback is active:

```css
.tooltip {
  container-type: anchored;
  position-try-fallbacks: flip-block;
}

/* When flip-block is active */
@container anchored(fallback: flip-block) {
  .arrow {
    transform: rotate(180deg);
  }
}
```

**Use cases:**

- Rotating arrows/indicators
- Adjusting gradients
- Changing animations

## Practical Tips

### Multiple Anchors

Each positioned element needs unique anchor name:

```css
.trigger-1 {
  anchor-name: --anchor-1;
}
.trigger-2 {
  anchor-name: --anchor-2;
}

.popup-1 {
  position-anchor: --anchor-1;
}
.popup-2 {
  position-anchor: --anchor-2;
}
```

### Fixed vs Absolute

- **`position: fixed`**: Relative to viewport (common for tooltips/popovers)
- **`position: absolute`**: Relative to containing block

### Popover API Integration

Anchor positioning works seamlessly with Popover API:

```html
<button popovertarget="my-popup" style="anchor-name: --trigger">Open</button>
<div popover id="my-popup" style="position-anchor: --trigger">Content</div>
```

## Common Patterns

### Tooltip Pattern

```css
.tooltip {
  position: fixed;
  position-anchor: --trigger;
  position-area: top;
  margin-bottom: 8px;
  position-try-fallbacks: flip-block, flip-inline;
  position-visibility: anchors-visible;
}
```

### Dropdown Menu Pattern

```css
.menu {
  position: absolute;
  position-anchor: --button;
  position-area: bottom span-all;
  margin-top: 4px;
  position-try-fallbacks: flip-block;
  max-height: 300px;
  overflow-y: auto;
}
```

### Context Menu Pattern

```css
.context-menu {
  position: fixed;
  position-anchor: --trigger;
  position-area: right;
  margin-left: 8px;
  position-try-fallbacks:
    flip-inline,
    flip-block,
    flip-block flip-inline;
}
```

## Performance Considerations

1. **Minimize fallback options**: More fallbacks = more calculations
2. **Use flip tactics first**: They're optimized by browser
3. **Avoid complex custom fallbacks**: Keep descriptor lists simple
4. **Limit anchored container queries**: Only query when styling changes needed

## Browser Compatibility

As of 2026:

- ✅ Chrome 125+
- ✅ Edge 125+
- ✅ Firefox 147+
- ✅ Safari 26+

**All major browsers now support CSS Anchor Positioning.**

**Progressive enhancement**: Check for support before using:

```css
@supports (anchor-name: --test) {
  /* Anchor positioning styles */
}

@supports not (anchor-name: --test) {
  /* Fallback positioning for older browsers */
}
```

## References

- [MDN: CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
- [MDN: Position Try Fallbacks](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning/Try_options_hiding)
- [MDN: Anchored Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning/Anchored_container_queries)
- [Chrome Developers: Anchor Positioning](https://developer.chrome.com/blog/anchor-positioning-api)

## Key Takeaways

1. ✅ Fallbacks are tried **in order listed** - first that fits wins
2. ✅ Use **`position-try-order`** for space-based selection (not automatic)
3. ✅ Use **flip tactics** for convenient position mirroring
4. ✅ Always add **margins** to prevent overlap with trigger
5. ✅ Combine tactics (`flip-block flip-inline`) for corner cases
6. ✅ Use `position-visibility: anchors-visible` for tooltips
7. ✅ Use anchored container queries to style based on active position
8. ❌ Don't assume "most space" is chosen automatically
9. ❌ Don't forget unique anchor names for multiple elements
