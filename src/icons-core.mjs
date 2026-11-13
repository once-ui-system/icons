// The rest of core's set, drawn on the same grid and primitives as icons.mjs.
import { circle, dot, flip, line, rect, rounded } from "./primitives.mjs";

const vflip = (pts) => pts.map(([x, y]) => [x, 24 - y]);
const sq = (s) => s.cap === "square";
// Acute corners keep a hairline fillet even in conservative, so a miter never spikes past the padding.
const fil = (s, k = 1) => Math.max(s.corner * k, 0.3);
// A knock line that runs a little past both ends, so the solid form splits cleanly.
const past = (a, b, by = 1.5) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = (dx / l) * by, uy = (dy / l) * by;
  const r = (n) => +n.toFixed(2);
  return line([r(a[0] - ux), r(a[1] - uy)], [r(b[0] + ux), r(b[1] + uy)]);
};
const knockLine = (a, b) => ({ d: line(a, b), knock: true, cut: past(a, b) });
const ring = () => ({ d: circle(12, 12, 8.75), fill: true });

const HAND = [[8.75, 10.5], [11.5, 4], [13.5, 4], [14.25, 5.5], [13.5, 9.5], [19, 9.5], [20.25, 11.25], [18.75, 19], [17, 20.25], [8.75, 20.25]];
const CUFF = [[3.25, 10.25], [6.75, 10.25], [6.75, 20.25], [3.25, 20.25]];
const thumb = (down) => (s) => [
  { d: rounded(down ? vflip(CUFF) : CUFF, s.rect * 0.4, true), fill: true },
  { d: rounded(down ? vflip(HAND) : HAND, s.corner, true), fill: true },
];
const tray = (s) => ({ d: rounded([[3.75, 15.25], [3.75, 20.25], [20.25, 20.25], [20.25, 15.25]], s.corner) });
const EYE = "M2.75 12C5 7.5 8.25 5.25 12 5.25s7 2.25 9.25 6.75c-2.25 4.5-5.5 6.75-9.25 6.75S5 16.5 2.75 12Z";
const DOC = [[5.25, 3.25], [13.5, 3.25], [18.75, 8.5], [18.75, 20.75], [5.25, 20.75]];
const STAR4 = "M12 3.25C12.6 8.6 15.4 11.4 20.75 12 15.4 12.6 12.6 15.4 12 20.75 11.4 15.4 8.6 12.6 3.25 12 8.6 11.4 11.4 8.6 12 3.25Z";
const starPts = () => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 4.1 : 8.9;
    pts.push([12 + r * Math.cos(a), 12.6 + r * Math.sin(a)]);
  }
  return pts;
};
const gear = () => {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, at = (deg, r) => [12 + r * Math.cos(a + (deg * Math.PI) / 180), 12 + r * Math.sin(a + (deg * Math.PI) / 180)];
    pts.push(at(-15, 6.6), at(-9.5, 8.85), at(9.5, 8.85), at(15, 6.6));
  }
  return pts;
};
const TREND = [[3, 17.25], [9, 11.25], [13, 15.25], [20.25, 8]];
const TREND_HEAD = [[15, 7.25], [20.75, 7.25], [20.75, 13]];

export const CORE_ICONS = {
  // Actions
  edit: (s) => [
    { d: rounded([[15.75, 4.25], [19.75, 8.25], [8.5, 19.5], [3.75, 20.25], [4.5, 15.5]], fil(s, 0.5), true), fill: true },
    { d: line([13.81, 6.19], [17.81, 10.19]), knock: true, cut: past([13.81, 6.19], [17.81, 10.19], 1.2) },
  ],
  copy: (s) => [
    { d: rect(8.25, 8.25, 12, 12, s.rect), fill: true },
    { d: rounded([[8.25, 15.75], [3.75, 15.75], [3.75, 3.75], [15.75, 3.75], [15.75, 8.25]], s.rect) },
  ],
  download: (s) => [
    { d: line([12, 3.75], [12, 14.5]) + rounded([[7.5, 10.75], [12, 15.25], [16.5, 10.75]], s.tip) }, tray(s),
  ],
  upload: (s) => [
    { d: line([12, 15.25], [12, 4.5]) + rounded([[7.5, 8.25], [12, 3.75], [16.5, 8.25]], s.tip) }, tray(s),
  ],
  send: (s) => [
    { d: rounded([[3.75, 3.75], [20.75, 12], [3.75, 20.25], [6.75, 12]], fil(s), true), fill: true },
    { d: line([6.75, 12], [12.5, 12]), knock: true },
  ],
  refresh: (s) => [
    { d: "M4.72 9.35A7.75 7.75 0 0 1 19.28 9.35" + rounded([[19.75, 4.75], [19.75, 9.75], [14.75, 9.75]], s.tip) },
    { d: "M19.28 14.65A7.75 7.75 0 0 1 4.72 14.65" + rounded([[4.25, 19.25], [4.25, 14.25], [9.25, 14.25]], s.tip) },
  ],
  filter: (s) => [{ d: rounded([[3.75, 4.5], [20.25, 4.5], [14, 12], [14, 19], [10, 20.5], [10, 12]], s.corner * 0.6, true), fill: true }],
  adjustments: () => [
    { d: line([3.75, 6], [13.25, 6]) + line([16.75, 6], [20.25, 6]) + line([3.75, 12], [6.75, 12]) + line([10.25, 12], [20.25, 12])
      + line([3.75, 18], [11.25, 18]) + line([14.75, 18], [20.25, 18]) },
    { d: circle(15, 6, 1.75), fill: true }, { d: circle(8.5, 12, 1.75), fill: true }, { d: circle(13, 18, 1.75), fill: true },
  ],
  link: () => [
    { d: "M10.25 13.75a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.25 1.25" },
    { d: "M13.75 10.25a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.25-1.25" },
  ],
  logout: (s) => [
    { d: rounded([[10.5, 3.75], [4.5, 3.75], [4.5, 20.25], [10.5, 20.25]], s.corner) },
    { d: line([9.5, 12], [19.75, 12]) + rounded([[16.25, 8.25], [20.25, 12], [16.25, 15.75]], s.tip) },
  ],
  enter: (s) => [{ d: rounded([[20.25, 4.5], [20.25, 15.75], [4.25, 15.75]], s.corner) + rounded([[7.75, 12], [3.75, 15.75], [7.75, 19.5]], s.tip) }],
  return: (s) => [{ d: rounded([[8.25, 4.5], [3.75, 9], [8.25, 13.5]], s.tip) + "M4.25 9H14.5a5.5 5.5 0 0 1 0 11H12" }],
  forward: (s) => [{ d: rounded(flip([[8.25, 4.5], [3.75, 9], [8.25, 13.5]]), s.tip) + "M19.75 9H9.5a5.5 5.5 0 0 0 0 11H12" }],
  maximize: (s) => [{ d: [[[3.75, 9], [3.75, 3.75], [9, 3.75]], [[15, 3.75], [20.25, 3.75], [20.25, 9]], [[20.25, 15], [20.25, 20.25], [15, 20.25]], [[9, 20.25], [3.75, 20.25], [3.75, 15]]].map((c) => rounded(c, s.corner)).join("") }],
  minimize: (s) => [{ d: [[[3.75, 9], [9, 9], [9, 3.75]], [[15, 3.75], [15, 9], [20.25, 9]], [[20.25, 15], [15, 15], [15, 20.25]], [[9, 20.25], [9, 15], [3.75, 15]]].map((c) => rounded(c, s.corner)).join("") }],
  grip: (s) => [{ d: [5.5, 12, 18.5].flatMap((y) => [dot([9, y], sq(s)), dot([15, y], sq(s))]).join(""), dot: true }],
  grid: (s) => [[3.75, 3.75], [13.75, 3.75], [3.75, 13.75], [13.75, 13.75]].map(([x, y]) => ({ d: rect(x, y, 6.5, 6.5, s.rect * 0.6), fill: true })),
  eye: () => [{ d: EYE, fill: true }, { d: circle(12, 12, 2.75), knock: true }],
  eyeOff: () => [
    { d: EYE, fill: true }, { d: circle(12, 12, 2.75), knock: true },
    { d: "", knock: true, only: "solid", cut: line([5.06, 2.94], [21.06, 18.94]) },
    { d: line([4, 4], [20, 20]) },
  ],
  eyeDropper: (s) => [
    { d: rounded([[13, 8.5], [15.5, 11], [7.25, 19.25], [4.75, 19.25], [4.75, 16.75]], s.corner * 0.5, true), fill: true },
    { d: line([12, 7.5], [16.5, 12]) },
    { d: circle(17.4, 6.6, 2.75), fill: true },
  ],
  // Status
  info: (s) => [ring(), { d: line([12, 11], [12, 16.5]), knock: true }, { d: dot([12, 7.75], sq(s)), dot: true, knock: true }],
  help: (s) => [ring(), { d: "M9.5 9.75a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.45", knock: true }, { d: dot([12, 16.75], sq(s)), dot: true, knock: true }],
  danger: (s) => [ring(), { d: line([12, 7.75], [12, 12.75]), knock: true }, { d: dot([12, 16.25], sq(s)), dot: true, knock: true }],
  warning: (s) => [
    { d: rounded([[12, 3.5], [21, 19.75], [3, 19.75]], fil(s, 0.6), true), fill: true },
    { d: line([12, 9.5], [12, 13.5]), knock: true }, { d: dot([12, 16.5], sq(s)), dot: true, knock: true },
  ],
  checkbox: (s) => [{ d: rect(3.75, 3.75, 16.5, 16.5, s.rect), fill: true }, { d: rounded([[8, 12.25], [10.75, 15], [16, 9.25]], s.tip), knock: true }],
  security: (s) => [
    { d: "M12 3.25 19.75 6v5.5c0 4.5-3.25 8-7.75 9.25C7.5 19.5 4.25 16 4.25 11.5V6Z", fill: true },
    { d: rounded([[9, 12.25], [11.25, 14.5], [15.25, 10]], s.tip), knock: true },
  ],
  time: (s) => [ring(), { d: rounded([[12, 7.25], [12, 12], [15.5, 14]], s.corner * 0.5), knock: true }],
  flag: (s) => [
    { d: rounded([[5.25, 4.5], [19.5, 4.5], [16.25, 9.5], [19.5, 14.5], [5.25, 14.5]], fil(s, 0.6), true), fill: true },
    { d: line([5.25, 3.75], [5.25, 20.75]) },
  ],
  bookmark: (s) => [{ d: rounded([[6, 3.25], [18, 3.25], [18, 20.75], [12, 16.25], [6, 20.75]], s.corner, true), fill: true }],
  heart: () => [{ d: "M12 20.25S3.25 15 3.25 9.25A4.75 4.75 0 0 1 12 6.5a4.75 4.75 0 0 1 8.75 2.75C20.75 15 12 20.25 12 20.25Z", fill: true }],
  like: thumb(false),
  dislike: thumb(true),
  starFill: (s) => [{ d: rounded(starPts(), fil(s, 0.7), true), filled: true }],
  sparkle: () => [{ d: STAR4, fill: true }],
  bolt: (s) => [{ d: rounded([[13.5, 2.75], [5, 13.5], [11.25, 13.5], [10.5, 21.25], [19, 10.5], [12.75, 10.5]], fil(s, 0.3), true), fill: true }],
  light: () => [
    { d: circle(12, 12, 4), fill: true },
    { d: Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4, c = Math.cos(a), sn = Math.sin(a), r = (n) => +n.toFixed(2);
        return line([r(12 + 6.6 * c), r(12 + 6.6 * sn)], [r(12 + 8.75 * c), r(12 + 8.75 * sn)]);
      }).join("") },
  ],
  dark: () => [{ d: "M20.25 14.25A8.5 8.5 0 1 1 9.75 3.75a7.75 7.75 0 0 0 10.5 10.5Z", fill: true }],
  opacity: () => [
    { d: circle(12, 12, 8.75), fill: true },
    { d: "M12 3.25a8.75 8.75 0 0 1 0 17.5Z", dot: true, only: "line" },
    { d: "M11.25 5a7 7 0 0 0 0 14Z", dot: true, knock: true, only: "solid" },
  ],
  smiley: (s) => [ring(), { d: dot([9, 10], sq(s)) + dot([15, 10], sq(s)), dot: true, knock: true }, { d: "M8.5 14.25a4 4 0 0 0 7 0", knock: true }],
  // Objects and places
  settings: (s) => [{ d: rounded(gear(), s.corner * 0.35, true), fill: true }, { d: circle(12, 12, 2.75), knock: true }],
  image: (s) => [
    { d: rect(3.25, 4.25, 17.5, 15.5, s.rect), fill: true },
    { d: rounded([[4.25, 16.04], [9, 11.5], [13.5, 16], [16, 13.5], [19.75, 17.06]], s.corner * 0.6), knock: true,
      cut: rounded([[1.75, 18.43], [9, 11.5], [13.5, 16], [16, 13.5], [22.2, 19.4]], s.corner * 0.6) },
    { d: circle(15.75, 9, 1.75), knock: true },
  ],
  video: (s) => [
    { d: rect(2.75, 6, 12.5, 12, s.rect), fill: true },
    { d: rounded([[15.25, 10], [21, 6.75], [21, 17.25], [15.25, 14]], s.corner * 0.6, true), fill: true },
  ],
  play: (s) => [{ d: rounded([[7, 4.5], [19.5, 12], [7, 19.5]], s.corner, true), fill: true }],
  pause: (s) => [{ d: rect(6, 4.25, 4, 15.5, s.rect * 0.5), fill: true }, { d: rect(14, 4.25, 4, 15.5, s.rect * 0.5), fill: true }],
  volume: (s) => [
    { d: rounded([[3.75, 9], [7.25, 9], [12, 4.75], [12, 19.25], [7.25, 15], [3.75, 15]], s.corner * 0.6, true), fill: true },
    { d: "M15.5 9a4 4 0 0 1 0 6M18 6.25a8 8 0 0 1 0 11.5" },
  ],
  volumeOff: (s) => [
    { d: rounded([[3.75, 9], [7.25, 9], [12, 4.75], [12, 19.25], [7.25, 15], [3.75, 15]], s.corner * 0.6, true), fill: true },
    { d: line([15.75, 9.5], [20.75, 14.5]) + line([20.75, 9.5], [15.75, 14.5]) },
  ],
  file: (s) => [
    { d: rounded(DOC, s.corner, true), fill: true },
    { d: rounded([[13.5, 3.25], [13.5, 8.5], [18.75, 8.5]], s.corner * 0.5), knock: true,
      cut: rounded([[13.5, 2.25], [13.5, 8.5], [19.75, 8.5]], s.corner * 0.5) },
  ],
  folder: (s) => [
    { d: rounded([[3.25, 5], [9.5, 5], [11.5, 7.25], [20.75, 7.25], [20.75, 19.25], [3.25, 19.25]], s.rect * 0.7, true), fill: true },
    knockLine([3.25, 10.25], [20.75, 10.25]),
  ],
  clipboard: (s) => [
    { d: rounded([[9, 4.75], [5.25, 4.75], [5.25, 20.75], [18.75, 20.75], [18.75, 4.75], [15, 4.75]], s.rect), fill: true },
    { d: rect(9, 3, 6, 3.5, s.rect * 0.4), fill: true },
    { d: line([8.75, 11], [15.25, 11]) + line([8.75, 15], [13.25, 15]), knock: true },
  ],
  inbox: (s) => [
    { d: rect(3.25, 4.25, 17.5, 15.5, s.rect), fill: true },
    { d: rounded([[3.25, 13.25], [8, 13.25], [9.5, 15.75], [14.5, 15.75], [16, 13.25], [20.75, 13.25]], s.corner * 0.5), knock: true,
      cut: rounded([[1.75, 13.25], [8, 13.25], [9.5, 15.75], [14.5, 15.75], [16, 13.25], [22.25, 13.25]], s.corner * 0.5) },
  ],
  newspaper: (s) => [
    { d: rect(3.25, 4.25, 14, 15.5, s.rect), fill: true },
    { d: rounded([[17.25, 8.5], [20.75, 8.5], [20.75, 19.75], [17.25, 19.75]], s.rect * 0.6) },
    { d: line([6.5, 8.75], [14, 8.75]) + line([6.5, 12.25], [14, 12.25]) + line([6.5, 15.75], [11.5, 15.75]), knock: true },
  ],
  book: (s) => [
    { d: rounded([[2.75, 5.25], [8.75, 5.25], [12, 7.5], [12, 20], [8.75, 18.25], [2.75, 18.25]], s.corner * 0.6, true), fill: true },
    { d: rounded(flip([[2.75, 5.25], [8.75, 5.25], [12, 7.5], [12, 20], [8.75, 18.25], [2.75, 18.25]]), s.corner * 0.6, true), fill: true },
    { d: "", knock: true, only: "solid", cut: line([12, 6.5], [12, 21.25]) },
  ],
  computer: (s) => [
    { d: rect(4.5, 5, 15, 10.5, s.rect), fill: true },
    { d: rounded([[4.5, 15.5], [19.5, 15.5], [21.25, 19], [2.75, 19]], s.corner * 0.5, true), fill: true },
    { d: "", knock: true, only: "solid", cut: line([3, 15.5], [21, 15.5]) },
  ],
  screen: (s) => [
    { d: rect(2.75, 4, 18.5, 12.5, s.rect), fill: true },
    { d: line([12, 16.5], [12, 20]) + line([8, 20], [16, 20]) },
  ],
  code: (s) => [{ d: rounded([[8.5, 7], [3.5, 12], [8.5, 17]], s.tip) + rounded([[15.5, 7], [20.5, 12], [15.5, 17]], s.tip) + line([13.5, 5], [10.5, 19]) }],
  cube: (s) => [
    { d: rounded([[12, 2.75], [20, 7.25], [20, 16.75], [12, 21.25], [4, 16.75], [4, 7.25]], s.corner * 0.6, true), fill: true },
    { d: rounded([[4, 7.25], [12, 11.75], [20, 7.25]], s.corner * 0.4) + line([12, 11.75], [12, 21.25]), knock: true,
      cut: rounded([[2.69, 6.51], [12, 11.75], [21.31, 6.51]], s.corner * 0.4) + line([12, 11.75], [12, 22.75]) },
  ],
  globe: () => [
    ring(),
    { d: "M12 3.25c-2.5 2.4-3.75 5.3-3.75 8.75s1.25 6.35 3.75 8.75c2.5-2.4 3.75-5.3 3.75-8.75S14.5 5.65 12 3.25Z", knock: true },
    knockLine([3.25, 12], [20.75, 12]),
  ],
  world: () => [
    ring(),
    { d: "M12 3.25c-2.5 2.4-3.75 5.3-3.75 8.75s1.25 6.35 3.75 8.75c2.5-2.4 3.75-5.3 3.75-8.75S14.5 5.65 12 3.25Z", knock: true },
    knockLine([3.98, 8.5], [20.02, 8.5]), knockLine([3.98, 15.5], [20.02, 15.5]),
  ],
  // A football: a pentagon in the middle and five seams running out to the edge.
  ball: () => {
    const P = (r, off = 0) => Array.from({ length: 5 }, (_, i) => {
      const a = -Math.PI / 2 + off + (i * 2 * Math.PI) / 5;
      return [+(12 + r * Math.cos(a)).toFixed(2), +(12 + r * Math.sin(a)).toFixed(2)];
    });
    const inner = P(3.1), outer = P(8.75);
    const seams = inner.map((p, i) => line(p, outer[i])).join("");
    const cuts = inner.map((p, i) => line(p, P(10.25)[i])).join("");
    return [ring(), { d: rounded(inner, 0.3, true), knock: true }, { d: seams, knock: true, cut: cuts }];
  },
  food: (s) => [
    { d: "M4 10.75a8 6.5 0 0 1 16 0Z", fill: true },
    { d: line([3.25, 14], [20.75, 14]) },
    { d: rounded([[4.5, 17], [19.5, 17], [18.75, 20.25], [5.25, 20.25]], s.corner * 0.6, true), fill: true },
  ],
  paw: () => [
    ...[[6, 10.25], [9.5, 6], [14.5, 6], [18, 10.25]].map(([x, y]) => ({ d: circle(x, y, 1.9), fill: true })),
    { d: "M12 12.25c-3 0-5.75 3.75-5.75 6 0 1.5 1.25 2.25 2.75 2.25 1.25 0 2-.5 3-.5s1.75.5 3 .5c1.5 0 2.75-.75 2.75-2.25 0-2.25-2.75-6-5.75-6Z", fill: true },
  ],
  gift: (s) => [
    { d: rect(3.25, 7.25, 17.5, 3.75, s.rect * 0.5), fill: true },
    { d: rounded([[4.75, 11], [4.75, 20.25], [19.25, 20.25], [19.25, 11]], s.rect * 0.5), fill: true },
    { d: "", knock: true, only: "solid", cut: line([2, 11], [22, 11]) },
    { d: line([12, 7.25], [12, 20.25]), knock: true, cut: line([12, 5.75], [12, 21.75]) },
    { d: "M12 7.25C10.5 4 7.25 3.5 7.25 5.5S10 7.25 12 7.25Zm0 0c1.5-3.25 4.75-3.75 4.75-1.75S14 7.25 12 7.25Z" },
  ],
  // People and organisation
  people: () => [
    { d: circle(9, 8.25, 3.25), fill: true },
    { d: "M3 19.75c0-3.2 2.7-5.25 6-5.25s6 2.05 6 5.25Z", fill: true },
    { d: circle(16.25, 7.75, 2.75), fill: true },
    { d: "M17 14.6c2.3.4 3.75 2.3 3.75 5.15", fill: true },
  ],
  personRemove: (s) => [
    { d: circle(10, 7.75, 3.75), fill: true },
    { d: sq(s) ? "M2.75 20.25V19a4.5 4.5 0 0 1 4.5-4.5h5.5a4.5 4.5 0 0 1 4.5 4.5v1.25Z" : "M2.75 20.25c0-3.6 3.25-5.75 7.25-5.75s7.25 2.15 7.25 5.75Z", fill: true },
    { d: line([16.5, 10.25], [21, 10.25]) },
  ],
  organization: (s) => [
    { d: rounded([[4.25, 20.25], [4.25, 3.25], [13.75, 3.25], [13.75, 20.25]], s.rect * 0.5), fill: true },
    { d: rounded([[13.75, 8.5], [19.75, 8.5], [19.75, 20.25], [13.75, 20.25]], s.rect * 0.5, true), fill: true },
    { d: line([2.75, 20.25], [21.25, 20.25]) },
    { d: [[7.25, 7], [10.75, 7], [7.25, 10.75], [10.75, 10.75], [7.25, 14.5], [10.75, 14.5]].map((p) => dot(p, sq(s))).join(""), dot: true, knock: true },
  ],
  symbol: () => [{ d: circle(12, 12, 3.5), fill: true }, { d: "M15.5 12v1.25a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.5 6.9" }],
  wordmark: (s) => [
    { d: line([7, 4.25], [12.5, 4.25]) + line([7, 19.75], [12.5, 19.75]) + line([9.75, 4.25], [9.75, 19.75]) },
    { d: rounded([[14.25, 8], [20.25, 8], [20.25, 16], [14.25, 16]], s.rect * 0.6) + rounded([[5.25, 8], [3.75, 8], [3.75, 16], [5.25, 16]], s.rect * 0.6) },
  ],
  // Commerce
  cart: (s) => [
    { d: rounded([[2.75, 3.75], [4.75, 3.75], [5.6, 7]], s.corner * 0.5) },
    { d: rounded([[5.6, 7], [20.5, 7], [18.75, 14.5], [7.25, 14.5]], s.corner * 0.6, true), fill: true },
    { d: circle(8.5, 19, 1.5), fill: true }, { d: circle(17.5, 19, 1.5), fill: true },
  ],
  store: (s) => [
    { d: rounded([[4.25, 3.75], [19.75, 3.75], [21, 9], [3, 9]], fil(s, 0.6), true), fill: true },
    { d: line([9, 3.75], [8.5, 9]) + line([15, 3.75], [15.5, 9]), knock: true },
    { d: rounded([[4.25, 9], [4.25, 20.25], [19.75, 20.25], [19.75, 9]], s.corner), fill: true },
    { d: "", knock: true, only: "solid", cut: line([2.5, 9], [21.5, 9]) },
    { d: rounded([[10, 20.25], [10, 15], [14, 15], [14, 20.25]], s.corner * 0.6), knock: true },
  ],
  tag: (s) => [
    { d: rounded([[3.75, 3.75], [11, 3.75], [20.25, 13], [13, 20.25], [3.75, 11]], fil(s), true), fill: true },
    { d: dot([8, 8], sq(s)), dot: true, knock: true },
  ],
  payment: (s) => [{ d: rect(2.75, 5, 18.5, 14, s.rect), fill: true }, knockLine([2.75, 9.5], [21.25, 9.5]), { d: line([6, 15.25], [10, 15.25]), knock: true }],
  banknotes: (s) => [
    { d: rect(2.75, 4.75, 18.5, 11.5, s.rect * 0.8), fill: true },
    { d: circle(12, 10.5, 2.5), knock: true },
    { d: line([4.75, 19.25], [19.25, 19.25]) },
  ],
  // Charts and gauges
  barChart: (s) => [[4.25, 12.5], [10.25, 4], [16.25, 8.5]].map(([x, y]) => ({ d: rect(x, y, 3.5, 20.25 - y, s.rect * 0.5), fill: true })),
  trend: (s) => [{ d: rounded([[3.75, 3.75], [3.75, 20.25], [20.25, 20.25]], s.corner) }, { d: rounded([[7.5, 15], [11, 11], [14, 13.5], [19.25, 7.25]], s.corner * 0.6) }],
  trendUp: (s) => [{ d: rounded(TREND, s.corner * 0.6) + rounded(TREND_HEAD, s.tip) }],
  trendDown: (s) => [{ d: rounded(vflip(TREND), s.corner * 0.6) + rounded(vflip(TREND_HEAD), s.tip) }],
  linearGauge: (s) => [
    { d: rect(2.75, 7.25, 18.5, 9.5, s.rect), fill: true },
    { d: rect(6, 10.5, 7.5, 3, Math.min(s.rect * 0.4, 1.5)), dot: true, knock: true },
  ],
  radialGauge: (s) => [
    { d: rounded([[3.25, 17.25], [20.75, 17.25]], 0) + "A8.75 8.75 0 0 0 3.25 17.25Z", fill: true },
    { d: line([12, 17.25], [15.75, 11.75]), knock: true },
  ],
};
