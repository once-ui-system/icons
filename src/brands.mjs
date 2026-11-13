// The brands set: our own product marks on the icon grid, shipped as its own entry
// point (@once-ui-system/icons/brands) so a plain Once UI install never carries them.
// Marks are one filled drawing: they do not change with data-border or line/solid.
import { BRAND_PATHS } from "./brands-paths.mjs";
import { circle } from "./primitives.mjs";

export const BRAND_TITLES = {
  onceUI: "Once UI", aveiro: "Aveiro", chirio: "Chirio", tavilio: "Tavilio",
  sigilio: "Sigilio", stack: "Stack", frametic: "Frametic", dopler: "Dopler",
};

const imported = Object.fromEntries(Object.entries(BRAND_PATHS).map(([name, ds]) => [name, () => ds.map((d) => ({ d, dot: true }))]));

/** Each brand: () => parts, rendered as solid. */
export const BRANDS = {
  ...imported,
  // Proposal: Sigilio has no mark of its own yet (its repo still carries Stack's).
  // A seal with an S cut through it.
  sigilio: () => [
    { d: circle(12, 12, 9.75), dot: true },
    { d: "M15 9.25A3 2.75 0 1 0 12 12A3 2.75 0 1 1 9 14.75", knock: true },
  ],
};
