// How one part becomes one <path>, shared by the build, the review sheets and the gallery.
// Returns the path's attributes in camelCase, or null when the part is not drawn in this style.
//   fill   - filled in solid.          filled - filled in both styles.
//   knock  - background colour in solid (cut: the overshooting solid version, butt caps).
//   dot    - a filled shape with no stroke; with knock it is cut out in solid.
//   only   - "line" or "solid": drawn in that style alone.
//   evenodd - fill with the evenodd rule (brand marks with holes).
//   cover  - filled with the background colour in both styles, to hide what lies behind the next part.
export function partAttrs(p, solid, knock) {
  if (p.only && p.only !== (solid ? "solid" : "line")) return null;
  if (p.cover) return { d: p.d, fill: knock, stroke: "none" };
  if (p.dot) return { d: p.d, fill: solid && p.knock ? knock : "currentColor", stroke: "none", ...(p.evenodd ? { fillRule: "evenodd" } : {}) };
  if (p.filled || (solid && p.fill)) return { d: p.d, fill: "currentColor" };
  if (solid && p.knock) return { d: p.cut ?? p.d, stroke: knock, ...(p.cut ? { strokeLinecap: "butt" } : {}) };
  return { d: p.d };
}
export function partSvg(p, solid, knock) {
  const a = partAttrs(p, solid, knock);
  if (!a) return "";
  return "<path " + Object.entries(a).map(([k, v]) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()) + '="' + v + '"').join(" ") + "/>";
}
