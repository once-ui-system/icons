// Icons the apps register on top of core's set (see /mnt/project-files/icons/coverage-audit.md).
import { circle, dot, line, rect, rounded } from "./primitives.mjs";

const sq = (s) => s.cap === "square";
const fil = (s, k = 1) => Math.max(s.corner * k, 0.3);
const r2 = (n) => +n.toFixed(2);
/** Rotate points about (12, 12) by deg (clockwise on screen). */
const rot = (pts, deg) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a);
  return pts.map(([x, y]) => [r2(12 + (x - 12) * c - (y - 12) * sn), r2(12 + (x - 12) * sn + (y - 12) * c)]);
};
const past = (a, b, by = 1.5) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  return line([r2(a[0] - (dx / l) * by), r2(a[1] - (dy / l) * by)], [r2(b[0] + (dx / l) * by), r2(b[1] + (dy / l) * by)]);
};
const ring = () => ({ d: circle(12, 12, 8.75), fill: true });

export const APP_ICONS = {
  checkCircle: (s) => [ring(), { d: rounded([[8.25, 12.25], [10.75, 14.75], [15.75, 9.5]], s.tip), knock: true }],
  text: () => [{ d: line([4, 6.75], [20, 6.75]) + line([4, 12], [20, 12]) + line([4, 17.25], [14, 17.25]) }],
  rocket: (s) => {
    const body = rot([[12, 2], [15.5, 7], [15.5, 15.5], [8.5, 15.5], [8.5, 7]], 45);
    const finL = rot([[8.5, 10.5], [5.5, 13.5], [5.5, 17.25], [8.5, 15.5]], 45);
    const finR = rot([[15.5, 10.5], [18.5, 13.5], [18.5, 17.25], [15.5, 15.5]], 45);
    const [w] = rot([[12, 9.5]], 45), f = rot([[12, 17.5], [12, 20.25]], 45);
    return [
      { d: rounded(body, Math.max(s.corner * 1.6, 0.6), true), fill: true },
      { d: rounded(finL, fil(s, 0.5), true) + rounded(finR, fil(s, 0.5), true), fill: true },
      { d: circle(w[0], w[1], 1.6), knock: true },
      { d: line(f[0], f[1]) },
    ];
  },
  brush: (s) => {
    const head = rot([[8.75, 13], [15.25, 13], [15.25, 16.25], [12, 21.5], [8.75, 16.25]], 45);
    const ferrule = rot([[9, 10.25], [15, 10.25], [15, 13], [9, 13]], 45);
    const handle = rot([[12, 2], [12, 10.25]], 45);
    return [
      { d: line(handle[0], handle[1]) },
      { d: rounded(ferrule, fil(s, 0.3), true), fill: true },
      { d: rounded(head, Math.max(s.corner * 1.2, 0.4), true), fill: true },
      { d: "", knock: true, only: "solid", cut: past(...rot([[8.5, 13], [15.5, 13]], 45), 0.6) },
    ];
  },
  lightbulb: () => [
    { d: "M9 16.25c0-1.6-.9-2.6-1.9-3.7A6 6 0 1 1 16.9 12.55c-1 1.1-1.9 2.1-1.9 3.7Z", fill: true },
    { d: line([12, 12.75], [12, 16.25]), knock: true },
    { d: line([9.25, 18.75], [14.75, 18.75]) + line([10.5, 21.25], [13.5, 21.25]) },
  ],
  truck: (s) => [
    { d: rect(2.75, 5.75, 11, 10.5, s.rect * 0.6), fill: true },
    { d: rounded([[13.75, 9], [17.5, 9], [21.25, 12.75], [21.25, 16.25], [13.75, 16.25]], fil(s, 0.6), true), fill: true },
    { d: circle(7, 18.25, 1.9), fill: true }, { d: circle(17.25, 18.25, 1.9), fill: true },
  ],
  map: (s) => [
    { d: rounded([[3.25, 6], [9, 3.75], [15, 6], [20.75, 3.75], [20.75, 18], [15, 20.25], [9, 18], [3.25, 20.25]], s.corner * 0.5, true), fill: true },
    { d: line([9, 3.75], [9, 18]) + line([15, 6], [15, 20.25]), knock: true, cut: line([9, 2.25], [9, 19.5]) + line([15, 4.5], [15, 21.75]) },
  ],
  mobile: (s) => [{ d: rect(6.25, 2.75, 11.5, 18.5, s.rect), fill: true }, { d: line([10.75, 18], [13.25, 18]), knock: true }],
  scissors: () => [
    { d: circle(6.5, 6.75, 2.5), fill: true }, { d: circle(6.5, 17.25, 2.5), fill: true },
    { d: line([8.6, 8.1], [20, 16.5]) + line([8.6, 15.9], [20, 7.5]) },
  ],
  megaphone: (s) => [
    { d: rounded([[4, 9.25], [8, 9.25], [18.25, 4.25], [18.25, 19.75], [8, 14.75], [4, 14.75]], fil(s, 0.6), true), fill: true },
    { d: rounded([[6.5, 14.75], [7.5, 19.75], [10, 19.75], [9.5, 16.25]], s.corner * 0.4) },
    { d: line([20.75, 10.25], [20.75, 13.75]) },
  ],
  terminal: (s) => [
    { d: rect(2.75, 4.25, 18.5, 15.5, s.rect), fill: true },
    { d: rounded([[7, 9.5], [9.75, 12], [7, 14.5]], s.tip) + line([12, 14.5], [16.5, 14.5]), knock: true },
  ],
  lockOpen: (s) => [
    { d: rect(4.75, 10.5, 14.5, 9.75, s.rect), fill: true },
    { d: "M8 10.5V7.25a4 4 0 0 1 7.85-1.1" },
    { d: line([12, 14.25], [12, 16.5]), knock: true },
  ],
  tshirt: (s) => [{ d: rounded([[15.5, 3.75], [20.75, 6.25], [19.25, 10.5], [17, 9.75], [17, 20.25], [7, 20.25], [7, 9.75], [4.75, 10.5], [3.25, 6.25], [8.5, 3.75]], fil(s, 0.6)) + "A3.5 3.5 0 0 0 15.5 3.75Z", fill: true }],
  shoppingBag: (s) => [
    { d: rounded([[4.75, 8], [19.25, 8], [18.5, 20.75], [5.5, 20.75]], s.rect * 0.6, true), fill: true },
    { d: "M9 8V6.25a3 3 0 0 1 6 0V8" },
    { d: dot([9, 11.25], sq(s)) + dot([15, 11.25], sq(s)), dot: true, knock: true },
  ],
  key: (s) => [
    { d: circle(8, 16, 4.25), fill: true },
    { d: line([11, 13], [19.75, 4.25]) + line([16.75, 7.25], [19, 9.5]) + line([14.5, 9.5], [16.25, 11.25]) },
    { d: dot([6.75, 17.25], sq(s)), dot: true, knock: true },
  ],
  stack: (s) => [
    { d: rect(3.25, 10.25, 17.5, 10, s.rect), fill: true },
    { d: line([5.25, 7.25], [18.75, 7.25]) + line([7.25, 4.25], [16.75, 4.25]) },
  ],
  microphone: (s) => [
    { d: rect(9, 2.75, 6, 11, sq(s) ? 1 : 3), fill: true },
    { d: "M5.75 11.5a6.25 6.25 0 0 0 12.5 0" + line([12, 17.75], [12, 21]) },
  ],
};

const DOC = [[5.25, 3.25], [13.5, 3.25], [18.75, 8.5], [18.75, 20.75], [5.25, 20.75]];
const dots = (pts, s) => ({ d: pts.map((p) => dot(p, sq(s))).join(""), dot: true });
const kdots = (pts, s) => ({ d: pts.map((p) => dot(p, sq(s))).join(""), dot: true, knock: true });
const knockLine = (a, b) => ({ d: line(a, b), knock: true, cut: past(a, b) });
const pill = (s) => (sq(s) ? 1.5 : 5.5);
const badge = () => {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 8, r = i % 2 ? 7.6 : 9;
    pts.push([r2(12 + r * Math.cos(a)), r2(12 + r * Math.sin(a))]);
  }
  return pts;
};
Object.assign(APP_ICONS, {
  // Batch 8
  idCard: (s) => [
    { d: rect(2.75, 5, 18.5, 14, s.rect), fill: true },
    { d: circle(8.25, 10.5, 1.75) + "M5.75 15.75c.5-1.5 1.4-2.25 2.5-2.25s2 .75 2.5 2.25" + line([13.5, 10], [18, 10]) + line([13.5, 13.75], [16.5, 13.75]), knock: true },
  ],
  language: (s) => [{ d: rounded([[3.5, 20], [7.25, 10.5], [11, 20]], s.tip) + line([4.9, 16.5], [9.6, 16.5]) + line([12.5, 5], [20.75, 5]) + line([16.5, 3.25], [16.5, 5])
      + "M19 5c-.9 3.75-3.25 6.75-6.25 8.5M14.25 8c1.1 2.4 3 4.25 5.75 5.5" }],
  camera: (s) => [
    { d: rounded([[2.75, 8], [7.25, 8], [8.75, 5.25], [15.25, 5.25], [16.75, 8], [21.25, 8], [21.25, 19.25], [2.75, 19.25]], s.corner * 0.7, true), fill: true },
    { d: circle(12, 13.5, 3.25), knock: true },
  ],
  columns: (s) => [{ d: rect(3.25, 4.25, 17.5, 15.5, s.rect), fill: true }, knockLine([9.08, 4.25], [9.08, 19.75]), knockLine([14.92, 4.25], [14.92, 19.75])],
  chevronUpDown: (s) => [{ d: rounded([[7.75, 9.25], [12, 5], [16.25, 9.25]], s.tip) + rounded([[7.75, 14.75], [12, 19], [16.25, 14.75]], s.tip) }],
  list: (s) => [dots([[5, 6.75], [5, 12], [5, 17.25]], s), { d: line([9, 6.75], [20, 6.75]) + line([9, 12], [20, 12]) + line([9, 17.25], [20, 17.25]) }],
  music: (s) => [
    { d: rounded([[9.25, 17], [9.25, 6.25], [19.75, 3.75], [19.75, 14.75]], s.corner * 0.3) },
    { d: circle(6.75, 17, 2.5), fill: true }, { d: circle(17.25, 14.75, 2.5), fill: true },
  ],
  layers: (s) => [
    { d: rounded([[12, 3.25], [20.75, 7.75], [12, 12.25], [3.25, 7.75]], fil(s, 0.6), true), fill: true },
    { d: rounded([[3.25, 12], [12, 16.5], [20.75, 12]], fil(s, 0.6)) + rounded([[3.25, 16.25], [12, 20.75], [20.75, 16.25]], fil(s, 0.6)) },
  ],
  arrowsRightLeft: (s) => [{ d: line([4, 8], [19.5, 8]) + rounded([[16.25, 4.5], [19.75, 8], [16.25, 11.5]], s.tip) + line([4.5, 16], [20, 16]) + rounded([[7.75, 12.5], [4.25, 16], [7.75, 19.5]], s.tip) }],
  phone: () => [{ d: "M3.75 6.5c0 7.6 6.15 13.75 13.75 13.75h1a1.75 1.75 0 0 0 1.75-1.75v-1.9c0-.6-.4-1.1-1-1.2l-3.6-.9c-.5-.1-1 .1-1.3.5l-.8 1.1a10.6 10.6 0 0 1-5.6-5.6l1.1-.8c.4-.3.6-.8.5-1.3l-.9-3.6c-.1-.6-.6-1-1.2-1H5.5A1.75 1.75 0 0 0 3.75 5.5Z", fill: true }],
  briefcase: (s) => [
    { d: rect(3.25, 7.25, 17.5, 12.5, s.rect), fill: true },
    { d: rounded([[9, 7.25], [9, 4.5], [15, 4.5], [15, 7.25]], s.corner * 0.6) },
    knockLine([3.25, 12.75], [20.75, 12.75]),
  ],
  heading: () => [{ d: line([6.5, 4.75], [6.5, 19.25]) + line([17.5, 4.75], [17.5, 19.25]) + line([6.5, 12], [17.5, 12]) }],
  swatch: (s) => [
    { d: rect(3.25, 3.25, 7, 17.5, s.rect * 0.7), fill: true },
    { d: rounded([[10.25, 8.25], [14.25, 4.25], [19.25, 9.25], [10.25, 18.25]], s.corner * 0.6) + rounded([[10.25, 20.75], [20.75, 20.75], [20.75, 14.25], [sq(s) ? 15 : 14.5, 14.25]], s.corner * 0.6) },
    kdots([[6.75, 16.75]], s),
  ],
  fire: () => [
    { d: "M12 21.25c-3.9 0-6.75-2.75-6.75-6.5 0-3.5 2.25-5.25 3.75-7.5.25 1.75 1 2.75 2 3.25C11 7 12.5 4.5 15 2.75c.25 3.25 3.75 5.5 3.75 11 0 4.25-2.85 7.5-6.75 7.5Z", fill: true },
    { d: "M12 18.5c-1.25 0-2.25-.9-2.25-2.25 0-1.5 1.25-2.25 2.25-3.75 1 1.5 2.25 2.25 2.25 3.75 0 1.35-1 2.25-2.25 2.25Z", knock: true },
  ],
  // Batch 9
  window: (s) => [{ d: rect(2.75, 4, 18.5, 16, s.rect), fill: true }, knockLine([2.75, 8.75], [21.25, 8.75]), kdots([[6, 6.4], [8.75, 6.4]], s)],
  cpu: (s) => [
    { d: rect(6, 6, 12, 12, s.rect * 0.6), fill: true },
    { d: rect(9.5, 9.5, 5, 5, s.rect * 0.3), knock: true },
    { d: [9.5, 14.5].map((v) => line([v, 3.25], [v, 6]) + line([v, 18], [v, 20.75]) + line([3.25, v], [6, v]) + line([18, v], [20.75, v])).join("") },
  ],
  stop: (s) => [{ d: rect(5, 5, 14, 14, s.rect), fill: true }],
  trophy: (s) => [
    { d: "M7 3.75h10v6a5 5 0 0 1-10 0Z", fill: true },
    { d: "M7 5.5H4.75v1.75A3 3 0 0 0 7.15 10.85M17 5.5h2.25v1.75A3 3 0 0 1 16.85 10.85" },
    { d: line([12, 14.75], [12, 17.75]) + rounded([[8, 20.5], [8, 17.75], [16, 17.75], [16, 20.5], [8, 20.5]], s.corner * 0.4) },
  ],
  academicCap: (s) => [
    { d: rounded([[12, 4.5], [21.25, 9], [12, 13.5], [2.75, 9]], fil(s, 0.6), true), fill: true },
    { d: "M6.5 11.5v4.25c1.5 1.5 3.5 2.25 5.5 2.25s4-.75 5.5-2.25V11.5" + line([21.25, 9], [21.25, 14.5]) },
  ],
  personAdd: (s) => [
    { d: circle(10, 7.75, 3.75), fill: true },
    { d: sq(s) ? "M2.75 20.25V19a4.5 4.5 0 0 1 4.5-4.5h5.5a4.5 4.5 0 0 1 4.5 4.5v1.25Z" : "M2.75 20.25c0-3.6 3.25-5.75 7.25-5.75s7.25 2.15 7.25 5.75Z", fill: true },
    { d: line([18.75, 8], [18.75, 12.5]) + line([16.5, 10.25], [21, 10.25]) },
  ],
  accessibility: (s) => [
    // The universal access mark: a figure with open arms inside a ring.
    ring(),
    { d: sq(s) ? "M10.75 6h2.5v2.5h-2.5Z" : "M10.75 7.25a1.25 1.25 0 1 0 2.5 0a1.25 1.25 0 1 0 -2.5 0Z", dot: true, knock: true },
    { d: rounded([[7.75, 10.25], [12, 11], [16.25, 10.25]], s.corner * 0.4) + line([12, 11], [12, 13.75]) + rounded([[9.75, 17], [12, 13.75], [14.25, 17]], s.corner * 0.4), knock: true },
  ],
  externalLink: (s) => [{ d: rounded([[10.5, 5], [5, 5], [5, 19], [19, 19], [19, 13.5]], s.rect * 0.8) + line([11, 13], [18.75, 5.25]) + rounded([[13.75, 4.75], [19.25, 4.75], [19.25, 10.25]], s.tip) }],
  table: (s) => [{ d: rect(3.25, 4.25, 17.5, 15.5, s.rect), fill: true }, knockLine([3.25, 9.5], [20.75, 9.5]), knockLine([3.25, 14.5], [20.75, 14.5]),
    { d: line([9.5, 9.5], [9.5, 19.75]), knock: true, cut: line([9.5, 9.5], [9.5, 21.25]) }],
  toggle: (s) => [{ d: rect(2.75, 6.5, 18.5, 11, pill(s)), fill: true }, { d: circle(15.75, 12, 2.75), knock: true }],
  presentation: (s) => [
    { d: rect(3.25, 3.75, 17.5, 11.5, s.rect * 0.7), fill: true },
    { d: rounded([[7, 11.5], [10, 8.75], [13, 10.75], [17, 7]], s.corner * 0.5), knock: true },
    { d: line([12, 15.25], [12, 17.5]) + rounded([[8.5, 20.75], [12, 17.5], [15.5, 20.75]], s.corner * 0.5) },
  ],
  message: () => [{ d: "M12 4.25c4.8 0 8.75 3.2 8.75 7.25S16.8 18.75 12 18.75c-1.1 0-2.15-.15-3.1-.45L4.25 19.75l1.4-3.5C4.1 14.95 3.25 13.3 3.25 11.5 3.25 7.45 7.2 4.25 12 4.25Z", fill: true }],
  tablet: (s) => [{ d: rect(4.75, 2.75, 14.5, 18.5, s.rect), fill: true }, { d: line([10.75, 18], [13.25, 18]), knock: true }],
  // Batch 10
  ticket: (s) => {
    const r = Math.max(s.rect * 0.5, 0.3);
    return [{ d: `M2.75 ${6 + r}a${r} ${r} 0 0 1 ${r} -${r}h${18.5 - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}V10a2 2 0 0 0 0 4v${4 - r}a${r} ${r} 0 0 1 -${r} ${r}H${2.75 + r}a${r} ${r} 0 0 1 -${r} -${r}V14a2 2 0 0 0 0-4Z`, fill: true },
      { d: line([15.25, 8], [15.25, 9.25]) + line([15.25, 11.4], [15.25, 12.6]) + line([15.25, 14.75], [15.25, 16]), knock: true }];
  },
  mapPin: () => [{ d: "M12 21s-6.75-5.75-6.75-11.25a6.75 6.75 0 0 1 13.5 0C18.75 15.25 12 21 12 21Z", fill: true }, { d: circle(12, 9.75, 2.5), knock: true }],
  report: (s) => [
    { d: rounded(DOC, s.corner, true), fill: true },
    { d: rounded([[13.5, 3.25], [13.5, 8.5], [18.75, 8.5]], s.corner * 0.5), knock: true, cut: rounded([[13.5, 2.25], [13.5, 8.5], [19.75, 8.5]], s.corner * 0.5) },
    { d: line([9, 17.25], [9, 14.75]) + line([12, 17.25], [12, 12.25]) + line([15, 17.25], [15, 13.75]), knock: true },
  ],
  drag: () => [{ d: line([4.75, 9.5], [19.25, 9.5]) + line([4.75, 14.5], [19.25, 14.5]) }],
  moreVertical: (s) => [dots([[12, 5.5], [12, 12], [12, 18.5]], s)],
  bug: () => [
    { d: "M12 7.5c3 0 5 2.5 5 6.25s-2 6.5-5 6.5-5-2.75-5-6.5S9 7.5 12 7.5Z", fill: true },
    { d: "M9.25 7.9a2.75 2.75 0 0 1 5.5 0" + line([7, 12], [3.75, 10.75]) + line([17, 12], [20.25, 10.75]) + line([7, 16], [4, 17.5]) + line([17, 16], [20, 17.5]) },
    { d: line([12, 10.25], [12, 18.25]), knock: true },
  ],
  robot: (s) => {
    // Rounder head, big eyes and a smile: friendly rather than industrial.
    const eye = ([x, y]) => (sq(s) ? `M${x - 1.5} ${y - 1.5}h3v3h-3Z` : `M${x - 1.6} ${y}a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0Z`);
    return [
      { d: rect(4.25, 8, 15.5, 12, Math.max(s.rect * 1.45, 1)), fill: true },
      { d: line([12, 8], [12, 5.75]) + line([2.75, 12.5], [2.75, 15.5]) + line([21.25, 12.5], [21.25, 15.5]) },
      { d: sq(s) ? "M10.75 2.75h2.5v2.5h-2.5Z" : "M10.75 4a1.25 1.25 0 1 0 2.5 0a1.25 1.25 0 1 0 -2.5 0Z", dot: true },
      { d: eye([9.25, 13]) + eye([14.75, 13]), dot: true, knock: true },
      { d: sq(s) ? "M10.25 16.75h3.5" : "M10.25 16.5q1.75 1.5 3.5 0", knock: true },
    ];
  },
  sidebar: (s) => [{ d: rect(3.25, 4.25, 17.5, 15.5, s.rect), fill: true }, knockLine([9, 4.25], [9, 19.75])],
  wifi: (s) => [{ d: "M3.5 9.5a12 12 0 0 1 17 0M6.5 12.75a7.75 7.75 0 0 1 11 0M9.5 15.9a3.5 3.5 0 0 1 5 0" }, dots([[12, 18.75]], s)],
  lifebuoy: () => {
    const segs = [45, 135, 225, 315].map((deg) => { const a = (deg * Math.PI) / 180; return [[r2(12 + 3.75 * Math.cos(a)), r2(12 + 3.75 * Math.sin(a))], [r2(12 + 8.75 * Math.cos(a)), r2(12 + 8.75 * Math.sin(a))]]; });
    return [ring(), { d: circle(12, 12, 3.75), knock: true }, { d: segs.map(([a, b]) => line(a, b)).join(""), knock: true, cut: segs.map(([a, b]) => past(a, b, 1.2)).join("") }];
  },
  medal: () => [
    { d: line([7.5, 3.25], [10.25, 9.5]) + line([16.5, 3.25], [13.75, 9.5]) },
    { d: circle(12, 15, 5.5), fill: true }, { d: circle(12, 15, 2.25), knock: true },
  ],
  pieChart: () => [{ d: "M12 3.25a8.75 8.75 0 1 0 8.75 8.75H12Z", fill: true }, { d: "M14 10V3.75a6.25 6.25 0 0 1 6.25 6.25Z", fill: true }],
  wrench: () => [{ d: "M19.6 7.15 16.75 10l-2.75-.75L13.25 6.5 16.1 3.65A4.75 4.75 0 0 0 10.35 10.1L3.9 16.55a1.85 1.85 0 0 0 2.6 2.6L12.95 12.7A4.75 4.75 0 0 0 19.6 7.15Z", fill: true }],
  backward: (s) => [{ d: rounded([[11.5, 6.25], [3.75, 12], [11.5, 17.75]], fil(s, 0.6), true), fill: true }, { d: rounded([[20.25, 6.25], [12.5, 12], [20.25, 17.75]], fil(s, 0.6), true), fill: true }],
  // Batch 11
  ban: () => [ring(), { d: line([5.8, 5.8], [18.2, 18.2]), knock: true, cut: line([4.6, 4.6], [19.4, 19.4]) }],
  beaker: (s) => [
    { d: rounded([[9.25, 3.25], [9.25, 9.5], [4, 19.25], [5.5, 20.75], [18.5, 20.75], [20, 19.25], [14.75, 9.5], [14.75, 3.25]], s.corner * 0.6), fill: true },
    { d: line([7.75, 3.25], [16.25, 3.25]) },
    { d: line([6.5, 15], [17.5, 15]), knock: true, cut: line([5.75, 15], [18.25, 15]) },
  ],
  paperclip: () => [{ d: "M15.5 7.25 9 13.75a1.75 1.75 0 0 0 2.5 2.5l6.75-6.75a3.75 3.75 0 0 0-5.3-5.3L6 11.15a5.75 5.75 0 0 0 8.15 8.15l5.6-5.6" }],
  checkBadge: (s) => [{ d: rounded(badge(), Math.max(s.corner * 0.5, 0.3), true), fill: true }, { d: rounded([[8.5, 12.25], [10.85, 14.6], [15.5, 9.75]], s.tip), knock: true }],
  crop: (s) => [{ d: rounded([[6.5, 2.75], [6.5, 17.5], [21.25, 17.5]], s.corner) + rounded([[2.75, 6.5], [17.5, 6.5], [17.5, 21.25]], s.corner) }],
  puzzle: () => [{ d: "M5.75 6H10a2 2 0 0 1 4 0h4.25v4.25a2 2 0 0 1 0 4V19H14a2 2 0 0 1-4 0H5.75v-4.75a2 2 0 0 1 0-4Z", fill: true }],
  skipBack: (s) => [{ d: line([5.25, 5.5], [5.25, 18.5]) }, { d: rounded([[18.75, 5.5], [8.5, 12], [18.75, 18.5]], fil(s, 0.6), true), fill: true }],
  skipForward: (s) => [{ d: line([18.75, 5.5], [18.75, 18.5]) }, { d: rounded([[5.25, 5.5], [15.5, 12], [5.25, 18.5]], fil(s, 0.6), true), fill: true }],
  tv: (s) => [{ d: rect(2.75, 6, 18.5, 12.5, s.rect), fill: true }, { d: rounded([[8.5, 2.75], [12, 6], [15.5, 2.75]], s.corner * 0.4) + line([8, 21], [16, 21]) }],
  ruler: (s) => [{ d: rect(2.75, 7.5, 18.5, 9, s.rect * 0.6), fill: true },
    { d: [6.5, 10.25, 14, 17.75].map((x, i) => line([x, 7.5], [x, i % 2 ? 12.25 : 10.75])).join(""), knock: true,
      cut: [6.5, 10.25, 14, 17.75].map((x, i) => line([x, 6], [x, i % 2 ? 12.25 : 10.75])).join("") }],
  // Two mitten hands, fingers and thumb merged, meeting in the middle. The front hand hides the
  // back one behind a gap the width of a knock line.
  layout: (s) => [{ d: rect(3.25, 3.25, 17.5, 17.5, s.rect), fill: true }, knockLine([3.25, 8.75], [20.75, 8.75]),
    { d: line([9.25, 8.75], [9.25, 20.75]), knock: true, cut: line([9.25, 8.75], [9.25, 22.25]) }],
  aspectRatio: (s) => [{ d: rect(2.75, 5, 18.5, 14, s.rect), fill: true },
    { d: rounded([[6.25, 11.25], [6.25, 8.5], [9.5, 8.5]], s.corner * 0.5) + rounded([[17.75, 12.75], [17.75, 15.5], [14.5, 15.5]], s.corner * 0.5), knock: true }],
  paragraph: () => [{ d: "M13.25 4.25H10a4 4 0 0 0 0 8h3.25Z", fill: true }, { d: line([13.25, 4.25], [13.25, 19.75]) + line([17, 4.25], [17, 19.75]) + line([13.25, 4.25], [18.75, 4.25]) }],
});
