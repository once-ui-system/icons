// The brands set: our own product marks on the icon grid, shipped as its own entry
// point (@once-ui-system/icons/brands) so a plain Once UI install never carries them.
// Marks are one filled drawing: they do not change with data-border or line/solid.
import { BRAND_PATHS } from "./brands-paths.mjs";

export const BRAND_TITLES = {
  onceUI: "Once UI", aveiro: "Aveiro", chirio: "Chirio", tavilio: "Tavilio",
  sigilio: "Sigilio", stack: "Stack", frametic: "Frametic", dopler: "Dopler",
};

/** Each brand: () => parts, rendered as solid. A path with a hole carries evenodd. */
export const BRANDS = Object.fromEntries(Object.entries(BRAND_PATHS).map(([name, ds]) =>
  [name, () => ds.map((d) => (typeof d === "string" ? { d, dot: true } : { d: d.d, dot: true, evenodd: true }))]));
