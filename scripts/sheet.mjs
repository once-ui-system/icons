// Every icon on one shared 24-unit grid: proof/sheet.html.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { partAttrs, partSvg } from "../src/render.mjs";
import { ICONS } from "../src/icons.mjs";
import { SHAPES, STROKE } from "../src/shapes.mjs";
import { BATCHES } from "../src/batches.mjs";
import { BRANDS, BRAND_TITLES } from "../src/brands.mjs";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "proof");
fs.mkdirSync(OUT, { recursive: true });
const order = [...new Set([...BATCHES.flatMap((b) => b.names), ...Object.keys(ICONS)])];
const parts = {};
for (const [k, s] of Object.entries(SHAPES)) parts[k] = Object.fromEntries(order.map((n) => [n, ICONS[n](s)]));

const html = `<title>Icon Sheet</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400&display=swap">
<style>
/* One continuous grid: each icon owns a 24-unit cell, cells are 4 units apart, lines run through all of them. */
:root { --bg:#0b0b0c; --panel:#141416; --raised:#1b1b1e; --line:#2a2a2e; --fg:#ededee; --muted:#8d8d94; --accent:#7c8cff;
  --unit: rgba(124,140,255,.13); --cell: rgba(124,140,255,.38); --key: rgba(255,170,90,.55);
  --display:"Geist", ui-sans-serif, system-ui, sans-serif; --mono:"Geist Mono", ui-monospace, monospace; color-scheme: dark }
@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) { --bg:#f9f9f9; --panel:#f1f1f3; --raised:#fff; --line:#e1e1e5; --fg:#17171a; --muted:#6b6b73; --accent:#4655e0;
  --unit: rgba(70,85,224,.10); --cell: rgba(70,85,224,.35); --key: rgba(214,110,20,.55); color-scheme: light } }
:root[data-theme="light"] { --bg:#f9f9f9; --panel:#f1f1f3; --raised:#fff; --line:#e1e1e5; --fg:#17171a; --muted:#6b6b73; --accent:#4655e0;
  --unit: rgba(70,85,224,.10); --cell: rgba(70,85,224,.35); --key: rgba(214,110,20,.55); color-scheme: light }
* { box-sizing: border-box }
body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.5 var(--display);
  padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); padding-block:32px 56px }
.wrap { max-width:1240px; margin:0 auto; display:grid; grid-template-columns:minmax(0,1fr); gap:20px }
h1 { margin:0; font-size:clamp(26px,3.5vw,36px); font-weight:600; letter-spacing:-.02em }
p { margin:0; color:var(--muted); max-width:70ch }
.controls { display:flex; flex-wrap:wrap; gap:10px 18px; align-items:center }
.label { font-size:12px; color:var(--muted) }
.seg { display:inline-flex; background:var(--panel); border:1px solid var(--line); border-radius:11px; padding:3px; gap:2px }
.seg button { font:500 13px var(--display); color:var(--muted); background:none; border:0; padding:6px 12px; border-radius:8px; cursor:pointer }
.seg button[aria-pressed="true"] { background:var(--raised); color:var(--fg); box-shadow:0 0 0 1px var(--line) }
.seg button:focus-visible { outline:2px solid var(--accent); outline-offset:2px }
.board { overflow-x:auto; background:var(--panel); border-radius:12px; padding:12px }
.board svg { display:block; width:100%; height:auto; min-width:640px }
.legend { display:flex; flex-wrap:wrap; gap:16px; font-size:13px; color:var(--muted) }
.legend i { display:inline-block; width:18px; height:0; border-top:2px solid; vertical-align:middle; margin-right:6px }
</style>
<div class="wrap">
  <h1>Icon Sheet</h1>
  <p>All ${order.length} icons drawn so far, on one shared grid. Each square is one icon's 24 by 24 box, the faint lines are single units, and the dashed line is the 2px padding. Stroke ${STROKE}. Numbers follow the review batches.</p>
  <div class="controls">
    <span class="label">Shape</span>
    <div class="seg" data-group="shape"><button type="button" data-v="playful">Playful</button><button type="button" data-v="rounded">Rounded</button><button type="button" data-v="conservative">Conservative</button></div>
    <span class="label">Style</span>
    <div class="seg" data-group="style"><button type="button" data-v="line">Line</button><button type="button" data-v="solid">Solid</button></div>
    <span class="label">Guides</span>
    <div class="seg" data-group="guides"><button type="button" data-v="on">On</button><button type="button" data-v="off">Off</button></div>
  </div>
  <div class="legend"><span><i style="color:var(--cell)"></i>24 box</span><span><i style="color:var(--key);border-top-style:dashed"></i>2px padding</span><span><i style="color:var(--unit)"></i>1 unit</span></div>
  <div class="board" id="board"></div>
  <h2 style="margin:12px 0 0;font-size:22px;font-weight:600;letter-spacing:-.01em">Brands</h2>
  <p>Our product marks on the same grid, in their own <code>@once-ui-system/icons/brands</code> entry so a plain Once UI install never carries them. They are the real logos scaled into the padding, one filled drawing that ignores shape and style.</p>
  <div class="board" id="brands"></div>
</div>
<script>
${partAttrs.toString()}
${partSvg.toString()}
const ORDER = ${JSON.stringify(order)};
const BRAND_PARTS = ${JSON.stringify(Object.fromEntries(Object.keys(BRAND_TITLES).map((n) => [n, BRANDS[n]()])))};
const BRAND_TITLES = ${JSON.stringify(BRAND_TITLES)};
const PARTS = ${JSON.stringify(parts)};
const SHAPES = ${JSON.stringify(SHAPES)};
const BATCH = ${JSON.stringify(Object.fromEntries(BATCHES.flatMap((b) => b.names.map((n) => [n, b.id]))))};
let st = { shape: "rounded", style: "solid", guides: "on" };
try { Object.assign(st, JSON.parse(localStorage.getItem("icon-sheet-v2") || "{}")); } catch (e) {}
const COLS = 8, CELL = 24, GAP = 6, LABEL = 5;
function render() {
  document.querySelectorAll(".seg").forEach((g) => g.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(st[g.dataset.group] === b.dataset.v))));
  const s = SHAPES[st.shape], rows = Math.ceil(ORDER.length / COLS);
  const W = COLS * CELL + (COLS + 1) * GAP, H = rows * (CELL + LABEL) + (rows + 1) * GAP;
  let g = "";
  if (st.guides === "on") {
    for (let x = 0; x <= W; x++) g += '<path d="M' + x + ' 0V' + H + '" stroke="var(--unit)" stroke-width="0.04"/>';
    for (let y = 0; y <= H; y++) g += '<path d="M0 ' + y + 'H' + W + '" stroke="var(--unit)" stroke-width="0.04"/>';
  }
  const counts = {};
  ORDER.forEach((n, i) => {
    const x = GAP + (i % COLS) * (CELL + GAP), y = GAP + Math.floor(i / COLS) * (CELL + LABEL + GAP);
    counts[BATCH[n]] = (counts[BATCH[n]] || 0) + 1;
    if (st.guides === "on") g += '<rect x="' + x + '" y="' + y + '" width="24" height="24" fill="none" stroke="var(--cell)" stroke-width="0.08"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="20" height="20" fill="none" stroke="var(--key)" stroke-width="0.06" stroke-dasharray="0.4 0.3"/>';
    const body = PARTS[st.shape][n].map((p) => partSvg(p, st.style === "solid", "var(--panel)")).join("");
    g += '<g transform="translate(' + x + ' ' + y + ')" fill="none" stroke="currentColor" stroke-width="${STROKE}" stroke-linecap="' + s.cap + '" stroke-linejoin="' + s.join + '">' + body + '</g>';
    g += '<text x="' + x + '" y="' + (y + 24 + 3.2) + '" font-family="Geist Mono, monospace" font-size="1.7" fill="var(--muted)">' + (BATCH[n] ?? "") + '.' + counts[BATCH[n]] + ' ' + n + '</text>';
  });
  document.getElementById("board").innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="All icons on one grid" style="color:var(--fg)">' + g + '</svg>';
  const bn = Object.keys(BRAND_PARTS), BW = bn.length * CELL + (bn.length + 1) * GAP, BH = CELL + LABEL + 2 * GAP;
  let bg = "";
  bn.forEach((n, i) => {
    const x = GAP + i * (CELL + GAP), y = GAP;
    if (st.guides === "on") bg += '<rect x="' + x + '" y="' + y + '" width="24" height="24" fill="none" stroke="var(--cell)" stroke-width="0.08"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="20" height="20" fill="none" stroke="var(--key)" stroke-width="0.06" stroke-dasharray="0.4 0.3"/>';
    bg += '<g transform="translate(' + x + ' ' + y + ')" fill="none" stroke="currentColor" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">' + BRAND_PARTS[n].map((p) => partSvg(p, true, "var(--panel)")).join("") + '</g>';
    bg += '<text x="' + x + '" y="' + (y + 24 + 3.2) + '" font-family="Geist Mono, monospace" font-size="1.7" fill="var(--muted)">' + BRAND_TITLES[n] + '</text>';
  });
  document.getElementById("brands").innerHTML = '<svg viewBox="0 0 ' + BW + ' ' + BH + '" role="img" aria-label="Brand marks on the grid" style="color:var(--fg)">' + bg + '</svg>';
  try { localStorage.setItem("icon-sheet-v2", JSON.stringify(st)); } catch (e) {}
}
document.querySelectorAll(".seg").forEach((g) => g.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { st[g.dataset.group] = b.dataset.v; render(); } }));
render();
</script>
`;
fs.writeFileSync(path.join(OUT, "sheet.html"), html);
console.log("sheet.html", order.length, "icons");
