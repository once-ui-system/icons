// How one part becomes one <path>, shared by the build, the review sheets and the gallery.
// Returns the path's attributes in camelCase, or null when the part is not drawn in this style.
//   fill   - filled in solid.          filled - filled in both styles.
//   knock  - background colour in solid (cut: the overshooting solid version, butt caps).
//   dot    - a filled shape with no stroke; with knock it is cut out in solid.
//   only   - "line" or "solid": drawn in that style alone.
//   evenodd - fill with the evenodd rule (brand marks with holes).
//   cover  - filled with the background colour in both styles, to hide what lies behind the next part.
//   part   - a name for motion, written as data-part; draw adds pathLength="1" so the part can draw on.
export function partAttrs(p, solid, knock) {
  const a = baseAttrs(p, solid, knock);
  if (!a) return null;
  if (p.draw) a.pathLength = "1";
  if (p.part) a["data-part"] = p.part;
  return a;
}
function baseAttrs(p, solid, knock) {
  if (p.only && p.only !== (solid ? "solid" : "line")) return null;
  if (p.cover) return { d: p.d, fill: knock, stroke: "none" };
  if (p.dot) return { d: p.d, fill: solid && p.knock ? knock : "currentColor", stroke: "none", ...(p.evenodd ? { fillRule: "evenodd" } : {}) };
  if (p.filled || (solid && p.fill)) return { d: p.d, fill: "currentColor" };
  if (solid && p.knock) return { d: p.cut ?? p.d, stroke: knock, ...(p.cut ? { strokeLinecap: "butt" } : {}) };
  return { d: p.d };
}
// SVG attribute names: camelCase becomes kebab-case, except the attributes SVG itself spells in camelCase.
const CAMEL = new Set(["viewBox", "pathLength"]);
export const svgAttr = (k) => (CAMEL.has(k) || k.startsWith("data-") ? k : k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()));
export function partSvg(p, solid, knock) {
  const a = partAttrs(p, solid, knock);
  if (!a) return "";
  return "<path " + Object.entries(a).map(([k, v]) => svgAttr(k) + '="' + v + '"').join(" ") + "/>";
}
