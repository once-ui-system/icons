import { circle, dot, flip, line, rect, rounded, turn } from "./primitives.mjs";
import { CORE_ICONS } from "./icons-core.mjs";
import { APP_ICONS } from "./icons-apps.mjs";

// Shared skeletons: chevrons and arrows are one drawing turned four ways.
const CHEVRON = [[9, 4.75], [16.25, 12], [9, 19.25]];
// Tip at 18.75 so the cap or miter stays inside the 2px padding; the shaft stops
// a unit short of the tip so no cap pokes through the head.
const ARROW_HEAD = [[12.5, 5.75], [18.75, 12], [12.5, 18.25]];
const ARROW_SHAFT = [[5.25, 12], [17.75, 12]];
const DOUBLE = [[[6.25, 5.5], [12.75, 12], [6.25, 18.5]], [[11.75, 5.5], [18.25, 12], [11.75, 18.5]]];
const chevron = (q) => (s) => [{ d: rounded(turn(CHEVRON, q), s.tip) }];
const arrow = (q) => (s) => [{ d: line(...turn(ARROW_SHAFT, q)) + rounded(turn(ARROW_HEAD, q), s.tip) }];
const double = (mirror) => (s) => [{ d: DOUBLE.map((c) => rounded(mirror ? flip(c) : c, s.tip)).join("") }];

/**
 * Each icon: (shape) => [{ d, fill?, knock?, cut?, dot? }].
 * fill  - the solid style fills this part.
 * knock - in solid, this line is drawn in the background colour to divide the fill.
 * cut   - the knock line for solid, overshooting the outline with butt caps so it
 *         divides the shape cleanly; in line style `d` ends on the outline instead.
 * dot   - always a filled dot.
 */
export const ICONS = {
  check: (s) => [{ d: rounded([[4.75, 12.5], [9.5, 17.25], [19.25, 7]], s.tip) }],
  close: () => [{ d: line([6, 6], [18, 18]) + line([18, 6], [6, 18]) }],
  plus: () => [{ d: line([12, 4.75], [12, 19.25]) + line([4.75, 12], [19.25, 12]) }],
  chevronRight: chevron(0),
  chevronDown: chevron(1),
  chevronLeft: chevron(2),
  chevronUp: chevron(3),
  chevronDoubleRight: double(false),
  chevronDoubleLeft: double(true),
  chevronsLeftRight: (s) => [{ d: rounded([[8.5, 6.75], [3.25, 12], [8.5, 17.25]], s.tip) + rounded([[15.5, 6.75], [20.75, 12], [15.5, 17.25]], s.tip) }],
  arrowRight: arrow(0),
  arrowDown: arrow(1),
  arrowLeft: arrow(2),
  arrowUp: arrow(3),
  arrowUpRight: (s) => [{ d: line([6.25, 17.75], [16.75, 7.25]) + rounded([[9, 6.5], [17.5, 6.5], [17.5, 15]], s.tip) }],
  minus: () => [{ d: line([4.75, 12], [19.25, 12]) }],
  menu: () => [{ d: line([4, 6.75], [20, 6.75]) + line([4, 12], [20, 12]) + line([4, 17.25], [20, 17.25]) }],
  moreHorizontal: (s) => [{ d: [5.5, 12, 18.5].map((x) => dot([x, 12], s.cap === "square")).join(""), dot: true }],
  search: () => [{ d: circle(10.75, 10.75, 6.5), fill: true }, { d: line([15.5, 15.5], [20, 20]) }],
  home: (s) => [
    { d: rounded([[3.25, 10.75], [12, 3.75], [20.75, 10.75]], s.tip) },
    { d: rounded([[5.75, 9], [5.75, 20.25], [18.25, 20.25], [18.25, 9]], s.corner), fill: true },
    // Solid: one filled house under the roof line, and a door cut clean through the base.
    { d: "M5.75 20.25V8.75L12 3.75l6.25 5v11.5Z", fill: true, only: "solid" },
    { d: rounded([[10, 20.25], [10, 15], [14, 15], [14, 20.25]], s.corner * 0.6), knock: true, cut: rounded([[10, 21.75], [10, 15], [14, 15], [14, 21.75]], s.corner * 0.6) },
  ],
  bell: (s) => [
    { d: "M6.25 16.75V11a5.75 5.75 0 0 1 11.5 0v5.75", fill: true },
    { d: line([4.75, 16.75], [19.25, 16.75]) },
    { d: "M10 20a2 2 0 0 0 4 0" },
  ],
  calendar: (s) => [
    { d: rect(3.75, 5.25, 16.5, 15, s.rect), fill: true },
    { d: line([3.75, 10], [20.25, 10]), knock: true, cut: line([2.25, 10], [21.75, 10]) },
    { d: line([8.25, 3.25], [8.25, 6.75]) + line([15.75, 3.25], [15.75, 6.75]) },
  ],
  mail: (s) => [
    { d: rect(3.25, 5.5, 17.5, 13, s.rect), fill: true },
    // The flap runs into the sides, so the solid form splits into a top and a bottom.
    { d: rounded([[4, 8.72], [12, 13.75], [20, 8.72]], s.corner * 0.8), knock: true,
      cut: rounded([[2.25, 7.62], [12, 13.75], [21.75, 7.62]], s.corner * 0.8) },
  ],
  person: (s) => [
    { d: circle(12, 7.75, 3.75), fill: true },
    { d: s.cap === "square"
        ? "M4.75 20.25V19a4.5 4.5 0 0 1 4.5-4.5h5.5a4.5 4.5 0 0 1 4.5 4.5v1.25Z"
        : "M4.75 20.25c0-3.6 3.25-5.75 7.25-5.75s7.25 2.15 7.25 5.75Z", fill: true },
  ],
  lock: (s) => [
    { d: rect(4.75, 10.5, 14.5, 9.75, s.rect), fill: true },
    { d: "M8 10.5V7.75a4 4 0 0 1 8 0v2.75" },
    { d: line([12, 14.25], [12, 16.5]), knock: true },
  ],
  trash: (s) => [
    { d: line([4, 6.5], [20, 6.5]) },
    { d: rounded([[9.25, 6.5], [9.25, 3.75], [14.75, 3.75], [14.75, 6.5]], s.corner * 0.6) },
    { d: rounded([[6, 6.5], [6.9, 20.25], [17.1, 20.25], [18, 6.5]], s.corner), fill: true },
    { d: line([10, 10.5], [10, 16.25]) + line([14, 10.5], [14, 16.25]), knock: true },
  ],
  document: (s) => [
    { d: rounded([[5.25, 3.25], [13.5, 3.25], [18.75, 8.5], [18.75, 20.75], [5.25, 20.75]], s.corner, true), fill: true },
    { d: rounded([[13.5, 3.25], [13.5, 8.5], [18.75, 8.5]], s.corner * 0.5), knock: true,
      cut: rounded([[13.5, 2.25], [13.5, 8.5], [19.75, 8.5]], s.corner * 0.5) },
    { d: line([8.75, 13], [15.25, 13]) + line([8.75, 16.5], [13.25, 16.5]), knock: true },
  ],
  star: (s) => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 4.1 : 8.9;
      pts.push([12 + r * Math.cos(a), 12.6 + r * Math.sin(a)]);
    }
    return [{ d: rounded(pts, Math.max(s.corner * 0.7, 0.3), true), fill: true }];
  },
};
// chat corners: bubble uses the rect radius on its four outer corners, small at the tail
ICONS.chat = (s) => [{ d: (() => {
  const pts = [[3.25, 4.5], [20.75, 4.5], [20.75, 16.75], [12.5, 16.75], [7.75, 20.25], [7.75, 16.75], [3.25, 16.75]];
  return rounded(pts, s.rect, true);
})(), fill: true }];


Object.assign(ICONS, CORE_ICONS, APP_ICONS);
