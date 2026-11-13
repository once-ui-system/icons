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

- `@once-ui-system/icons/react`: one tree-shakable component per icon, `shape` and `solid` props, sized `1em`.
- `@once-ui-system/icons/data`: `iconData[shape][name].line | .solid` as `IconNode` trees, the format Once UI core's icon generator and the native `sync:icons` read.
- `@once-ui-system/icons/svg/<shape>/<name>.svg`: raw files (`<name>-solid.svg` for solid).

In Once UI core the shape comes from the theme, so apps don't pass it.

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
node scripts/motion.mjs  # proof/motion.html: the motion prototypes
```

Icons live in `src/icons.mjs`, `src/icons-core.mjs` and `src/icons-apps.mjs` (review batches in `src/batches.mjs`), primitives in `src/primitives.mjs`, shape settings in `src/shapes.mjs`. Draw with the primitives rather than hand-written path data, so shapes stay consistent.

MIT licensed.
