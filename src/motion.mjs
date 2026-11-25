// Icons that move, and what sets each one off by default (`animate` or `animate={true}`).
// The motion itself is CSS: src/motion.css, shipped as @once-ui-system/icons/motion.css.
//   in     - plays once when the icon appears (a check after a save).
//   hover  - plays while the icon or the control around it is hovered or focused.
//   active - follows the on state: open, checked, liked.
const chevrons = ["chevronDown", "chevronUp", "chevronLeft", "chevronRight"];
const arrows = ["arrowRight", "arrowLeft", "arrowUp", "arrowDown"];

export const MOTIONS = {
  check: "in",
  checkbox: "active",
  bell: "hover",
  plus: "active",
  ...Object.fromEntries(chevrons.map((n) => [n, "active"])),
  ...Object.fromEntries(arrows.map((n) => [n, "hover"])),
  refresh: "hover",
  eye: "hover",
  heart: "active",
  trash: "hover",
  menu: "active",
};

/** The parts each motion moves on its own; every other motion moves the whole icon. */
export const MOTION_PARTS = {
  check: ["tick"],
  checkbox: ["box", "tick"],
  bell: ["body", "clapper"],
  trash: ["lid"],
  menu: ["top", "middle", "bottom"],
  ...Object.fromEntries(arrows.map((n) => [n, ["shaft", "head"]])),
};
