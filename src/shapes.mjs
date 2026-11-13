// The three shapes match Once UI's data-border values. One drawing renders in
// all three: only caps, joins and radii change.
//   rect   - corner radius of boxes (calendar, mail, lock)
//   corner - fillet on bends of open paths and polygons (home walls, trash)
//   tip    - fillet on the point of chevrons, arrows and the check

export const STROKE = 1.5;
export const SHAPES = {
  playful: { cap: "round", join: "round", rect: 4.5, corner: 2.4, tip: 1.6 },
  rounded: { cap: "round", join: "round", rect: 2.75, corner: 1.2, tip: 0 },
  conservative: { cap: "square", join: "miter", rect: 0.75, corner: 0, tip: 0 },
};

export const DEFAULT_SHAPE = "rounded";
