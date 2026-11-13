// Drawing primitives on the 24 grid. Every icon is built from these, so a
// shape's radii, caps and joins reach every icon the same way.

const f = (n) => +n.toFixed(2);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const len = (v) => Math.hypot(v[0], v[1]);
const norm = (v) => { const l = len(v); return [v[0] / l, v[1] / l]; };

/** A polyline or polygon whose corners are filleted with radius r (true arcs). */
export function rounded(points, r, closed = false) {
  const n = points.length;
  const at = (i) => points[(i + n) % n];
  const corner = (i) => {
    const v = at(i), a = norm(sub(at(i - 1), v)), b = norm(sub(at(i + 1), v));
    const theta = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1])));
    if (!r || theta > 3.1) return null;
    let d = r / Math.tan(theta / 2);
    d = Math.min(d, len(sub(at(i - 1), v)) / 2, len(sub(at(i + 1), v)) / 2);
    const rr = d * Math.tan(theta / 2);
    const p1 = [v[0] + a[0] * d, v[1] + a[1] * d], p2 = [v[0] + b[0] * d, v[1] + b[1] * d];
    const sweep = a[0] * b[1] - a[1] * b[0] < 0 ? 1 : 0;
    return { p1, p2, rr, sweep };
  };
  let d = "";
  const first = closed ? 0 : 1, last = closed ? n - 1 : n - 2;
  const start = closed ? (corner(0)?.p2 ?? at(0)) : at(0);
  d += `M${f(start[0])} ${f(start[1])}`;
  for (let i = closed ? 1 : first; i <= last; i++) {
    const c = corner(i);
    if (!c) { d += `L${f(at(i)[0])} ${f(at(i)[1])}`; continue; }
    d += `L${f(c.p1[0])} ${f(c.p1[1])}A${f(c.rr)} ${f(c.rr)} 0 0 ${c.sweep} ${f(c.p2[0])} ${f(c.p2[1])}`;
  }
  if (closed) {
    const c = corner(0);
    if (c) d += `L${f(c.p1[0])} ${f(c.p1[1])}A${f(c.rr)} ${f(c.rr)} 0 0 ${c.sweep} ${f(c.p2[0])} ${f(c.p2[1])}`;
    d += "Z";
  } else d += `L${f(at(n - 1)[0])} ${f(at(n - 1)[1])}`;
  return d;
}

export const rect = (x, y, w, h, r) => rounded([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], Math.min(r, w / 2, h / 2), true);
export const line = (a, b) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
export const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;


/** Rotate points about the grid centre (12, 12) by a multiple of 90 degrees. */
export const turn = (points, quarter) => points.map(([x, y]) => {
  for (let i = 0; i < ((quarter % 4) + 4) % 4; i++) [x, y] = [24 - y, x];
  return [x, y];
});
/** Mirror points across the vertical centre line. */
export const flip = (points) => points.map(([x, y]) => [24 - x, y]);
/** A dot, 2.1 across (the stroke's visual weight): a filled circle, square in conservative. Mark its part `dot: true`. */
export const dot = ([x, y], square = false) => square
  ? `M${x - 1.05} ${y - 1.05}h2.1v2.1h-2.1Z`
  : `M${x - 1.05} ${y}a1.05 1.05 0 1 0 2.1 0a1.05 1.05 0 1 0 -2.1 0Z`;
