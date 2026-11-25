# Once UI Icons

Once UI's own icon set, drawn as code. Every icon is built from a few primitives on a 24 grid (lines, filleted polylines, rounded boxes, circles), and one drawing renders in three shapes that match Once UI's `data-border`:

| Shape | Caps | Joins | Corners |
| --- | --- | --- | --- |
| `playful` | round | round | soft, round tips |
| `rounded` (default) | round | round | small radius |
| `conservative` | square | miter | crisp |

Grid 24, stroke 1.5, 2px padding. Each icon has a line and a solid style.

## Use

```tsx
import { HomeIcon } from "@once-ui-system/icons/react";

<HomeIcon shape="conservative" solid />
```

- `@once-ui-system/icons/react`: one tree-shakable component per icon, `shape`, `solid`, `animate` and `active` props, sized `1em`.
- `@once-ui-system/icons/motion.css`: the motion for the icons that move (below).
- `@once-ui-system/icons/data`: `iconData[shape][name].line | .solid` as `IconNode` trees, the format Once UI core's icon generator and the native `sync:icons` read.
- `@once-ui-system/icons/svg/<shape>/<name>.svg`: raw files (`<name>-solid.svg` for solid).

In Once UI core the shape comes from the theme, so apps don't pass it.

## Motion

Seventeen icons move, with CSS only. Import the stylesheet once, then pass `animate` (the icon's own trigger) or `active` (its on state):

```tsx
import "@once-ui-system/icons/motion.css";
import { BellIcon, CheckIcon, ChevronDownIcon, HeartIcon } from "@once-ui-system/icons/react";

<button><BellIcon animate /> Notifications</button>   // swings while the button is hovered or focused
<CheckIcon animate />                                    // draws itself in when it appears
<ChevronDownIcon active={open} />                        // flips while open
<HeartIcon active={liked} />                             // fills with a beat
```

| Icon | Trigger | Motion |
| --- | --- | --- |
| `check` | in | the short leg goes quickly, the long leg settles, a small pop |
| `checkbox` | active | the box fills, then the tick draws through it; off, the box is empty |
| `bell` | hover | the body swings from its top, the clapper lags a beat |
| `plus` | active | turns into a cancel cross |
| `chevronDown`, `Up`, `Left`, `Right` | active | flips |
| `arrowRight`, `Left`, `Up`, `Down` | hover | leans the way it points |
| `refresh` | hover | one full turn |
| `eye` | hover | blinks |
| `heart` | active | the line turns solid with a beat |
| `trash` | hover | the lid lifts and tips |
| `menu` | active | three lines fold into a cross |

`animate` takes `true` (the trigger above), `"hover"` (the icon or the control around it, a link, button, menu item, option, tab, label or summary, is hovered or keyboard-focused), `"in"` (once, when it appears) or `"active"`. `active` alone implies `animate`. Icons without a motion ignore both.

Timing follows the shape: playful 420ms with an overshoot, rounded 320ms with a soft settle, conservative 200ms with no pop. It comes from the icon's own `shape`, or from the closest `data-border` when the attributes are set by hand. Under `prefers-reduced-motion` nothing moves; states still change.

The stylesheet works on attributes, so plain SVG works too: `data-icon="<name>"`, `data-animate="hover|in|active"` and `data-active` on the `<svg>` or any element around it. The moving pieces carry `data-part` (`tick`, `box`, `body`, `clapper`, `lid`, `shaft`, `head`, `top`, `middle`, `bottom`), and drawn parts carry `pathLength="1"`. The list lives in `src/motion.mjs` (`motions` in `@once-ui-system/icons/data`).

## Brands

```tsx
import { AveiroBrand } from "@once-ui-system/icons/brands";

<AveiroBrand title="Aveiro" />
```

Our own product marks (Once UI, Aveiro, Chirio, Tavilio, Sigilio, Stack, Frametic, Dopler) on the same grid, in their own entry point so the default set every Once UI install gets stays free of logos. A mark is one filled drawing; it ignores shape and line/solid. The sources live in `brands/source/`; `npm run brands:import` scales them into the 2px padding and writes `src/brands-paths.mjs`. The marks are trademarks of their products and are not covered by the MIT licence.

## Work on it

```sh
npm test         # every icon draws in every shape, inside the box
npm run build    # dist/: svg, data, react
npm run proof    # proof/index.html: the set, the grid, a sample UI, and core's current icons for comparison
node scripts/sheet.mjs   # proof/sheet.html: every icon and brand on one grid
node scripts/motion.mjs  # proof/motion.html: every animated icon, moved by src/motion.css
```

Icons live in `src/icons.mjs`, `src/icons-core.mjs` and `src/icons-apps.mjs` (review batches in `src/batches.mjs`), primitives in `src/primitives.mjs`, shape settings in `src/shapes.mjs`. Draw with the primitives rather than hand-written path data, so shapes stay consistent.

MIT licensed.
