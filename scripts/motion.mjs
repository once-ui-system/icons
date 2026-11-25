// Motion proof: proof/motion.html. Every animated icon, moved by the real stylesheet
// (src/motion.css, shipped as @once-ui-system/icons/motion.css) in all three shapes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ICONS } from "../src/icons.mjs";
import { MOTIONS } from "../src/motion.mjs";
import { partAttrs, svgAttr } from "../src/render.mjs";
import { SHAPES, STROKE } from "../src/shapes.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "proof");
const MOTION_CSS = fs.readFileSync(path.join(ROOT, "src", "motion.css"), "utf8");
// Each icon's paths per shape, as the build writes them (data-part, pathLength included).
const svgInner = (name, s) => ICONS[name](s).map((p) => partAttrs(p, false, "var(--icon-knock)")).filter(Boolean)
  .map((a) => "<path " + Object.entries(a).map(([k, v]) => `${svgAttr(k)}="${v}"`).join(" ") + "/>").join("");
const data = Object.fromEntries(Object.entries(SHAPES).map(([k, s]) => [k, { cap: s.cap, join: s.join, icons: Object.fromEntries(Object.keys(MOTIONS).map((n) => [n, svgInner(n, s)])) }]));
const TIMING = {
  playful: "420ms · overshoot 1.14", rounded: "320ms · settle 1.07", conservative: "200ms · exact, no pop",
};

const CARDS = [
  ["check", "Entrance", "Check", "The short leg goes quickly, the long leg settles, then a small pop.", "Saved", "replay"],
  ["checkbox", "State", "Checkbox", "The box fills, then the tick draws through it.", "Agree", "toggle"],
  ["bell", "Hover", "Bell", "The body swings from its top and the clapper follows a beat later.", "Notifications", "hover"],
  ["plus", "State", "Plus to close", "A turn and a touch longer, for add buttons that become cancel.", "Add", "toggle"],
  ["chevronDown", "State", "Chevron", "Flips for an accordion or a select opening.", "Details", "toggle", true],
  ["arrowRight", "Hover", "Arrow", "Leans the way it points, for links and next steps.", "Continue", "hover", true],
  ["refresh", "Hover", "Refresh", "One full turn.", "Refresh", "hover"],
  ["eye", "Hover", "Eye", "Blinks once.", "Show", "hover"],
  ["heart", "State", "Heart", "The line turns solid with a beat, for like and favourite.", "Favourite", "toggle"],
  ["trash", "Hover", "Trash", "The lid lifts and tips before a delete.", "Delete", "hover"],
  ["menu", "State", "Menu", "Three lines fold into a cross in the same spot. NavIcon draws this.", "Menu", "toggle"],
];
const icon = (name) => `<svg class="i" viewBox="0 0 24 24" data-name="${name}" data-icon="${name}" data-animate="${MOTIONS[name]}"></svg>`;
const card = ([name, kind, title, text, label, how, suffix]) => `
    <section class="card"><span class="kind">${kind} · ${MOTIONS[name]}</span><h3>${title}</h3><p>${text}</p>
      <button class="stage" data-how="${how}">${icon(name)}</button>
      <button class="btn" data-how="${how}">${suffix ? label + icon(name) : icon(name) + label}</button></section>`;

const html = `<title>Icon Motion</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400&display=swap">
<style>
:root { --bg:#0b0b0c; --panel:#141416; --raised:#1b1b1e; --line:#2a2a2e; --fg:#ededee; --muted:#8d8d94; --accent:#7c8cff;
  --display:"Geist", ui-sans-serif, system-ui, sans-serif; --mono:"Geist Mono", ui-monospace, monospace; color-scheme: dark }
@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) { --bg:#f9f9f9; --panel:#f1f1f3; --raised:#fff; --line:#e1e1e5; --fg:#17171a; --muted:#6b6b73; --accent:#4655e0; color-scheme: light } }
:root[data-theme="light"] { --bg:#f9f9f9; --panel:#f1f1f3; --raised:#fff; --line:#e1e1e5; --fg:#17171a; --muted:#6b6b73; --accent:#4655e0; color-scheme: light }
* { box-sizing: border-box }
body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.5 var(--display);
  padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); padding-block:32px 56px }
.wrap { max-width:1180px; margin:0 auto; display:grid; grid-template-columns:minmax(0,1fr); gap:20px }
h1 { margin:0; font-size:clamp(26px,3.5vw,36px); font-weight:600; letter-spacing:-.02em }
p { margin:0; color:var(--muted); max-width:70ch }
.controls { display:flex; flex-wrap:wrap; gap:10px 18px; align-items:center; position:sticky; top:0; z-index:2; background:var(--bg); padding:10px 0 }
.label { font-size:12px; color:var(--muted) }
.seg { display:inline-flex; background:var(--panel); border:1px solid var(--line); border-radius:11px; padding:3px; gap:2px }
.seg button { font:500 13px var(--display); color:var(--muted); background:none; border:0; padding:6px 12px; border-radius:8px; cursor:pointer }
.seg button[aria-pressed="true"] { background:var(--raised); color:var(--fg); box-shadow:0 0 0 1px var(--line) }
button:focus-visible { outline:2px solid var(--accent); outline-offset:2px }
.cards { display:grid; grid-template-columns:repeat(auto-fill, minmax(210px, 1fr)); gap:14px }
.card { background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:16px; display:grid; gap:12px; min-width:0; align-content:start }
.card h3 { margin:0; font-size:15px; font-weight:600 }
.card p { font-size:13px }
.kind { font:11px var(--mono); color:var(--accent); text-transform:uppercase; letter-spacing:.06em }
.stage { all:unset; cursor:pointer; display:grid; place-items:center; height:150px; border-radius:12px; background:var(--raised); border:1px solid var(--line); color:var(--fg) }
.stage:focus-visible { outline:2px solid var(--accent); outline-offset:2px }
.stage svg { width:88px; height:88px }
.btn { font:500 14px var(--display); display:inline-flex; align-items:center; gap:8px; height:36px; padding:0 14px 0 12px; border-radius:10px;
  background:var(--raised); color:var(--fg); border:1px solid var(--line); cursor:pointer; justify-self:start }
.btn svg { width:18px; height:18px }
svg.i { fill:none; stroke:currentColor; stroke-width:${STROKE}; overflow:visible; --icon-knock: var(--raised) }
.mono { font:12px var(--mono); color:var(--muted) }
/* The stylesheet the package ships, unchanged: */
${MOTION_CSS}
</style>
<div class="wrap" data-border="rounded">
  <h1>Icon Motion</h1>
  <p>Every animated icon, moved by the stylesheet the package ships. Hover or focus a stage or a button for hover motions, click for state ones (data-active), click the check to replay its entrance. Timing follows the shape: playful overshoots a little, rounded settles softly, conservative is quick and exact with no pop. With reduced motion turned on, nothing moves and states still change.</p>
  <div class="controls">
    <span class="label">Shape</span>
    <div class="seg"><button type="button" data-v="playful">Playful</button><button type="button" data-v="rounded">Rounded</button><button type="button" data-v="conservative">Conservative</button></div>
    <span class="mono" id="timing"></span>
  </div>
  <div class="cards">${CARDS.map(card).join("")}
  </div>
</div>
<script>
const DATA = ${JSON.stringify(data)};
const TIMING = ${JSON.stringify(TIMING)};
let shape = "rounded";
try { shape = localStorage.getItem("icon-motion-shape") || shape; } catch (e) {}
const wrap = document.querySelector(".wrap");
function render() {
  const D = DATA[shape];
  wrap.dataset.border = shape;
  document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === shape)));
  document.getElementById("timing").textContent = TIMING[shape];
  document.querySelectorAll("svg.i").forEach((s) => { s.setAttribute("stroke-linecap", D.cap); s.setAttribute("stroke-linejoin", D.join); s.innerHTML = D.icons[s.dataset.name]; });
}
document.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => { shape = b.dataset.v; try { localStorage.setItem("icon-motion-shape", shape); } catch (e) {} render(); }));
const replay = (el) => el.querySelectorAll("svg.i").forEach((s) => s.replaceWith(s.cloneNode(true)));
document.querySelectorAll('[data-how="replay"]').forEach((el) => el.addEventListener("click", () => replay(el)));
document.querySelectorAll('[data-how="toggle"]').forEach((el) => el.addEventListener("click", () => el.querySelectorAll("svg.i").forEach((s) => s.toggleAttribute("data-active"))));
render();
</script>
`;
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "motion.html"), html);
console.log("wrote proof/motion.html");
