import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { partSvg } from "../src/render.mjs";
import { ICONS } from "../src/icons.mjs";
import { SHAPES, STROKE } from "../src/shapes.mjs";
import { BATCHES } from "../src/batches.mjs";
const arg = process.argv.indexOf("--batch");
const BATCH = arg > -1 ? BATCHES.find((b) => b.id === Number(process.argv[arg + 1])) : null;
const SHOWN = BATCH ? BATCH.names : Object.keys(ICONS);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(HERE, "..", "proof");
fs.mkdirSync(DIR, { recursive: true });
const svg = (name, shapeName, solid) => {
  const s = SHAPES[shapeName];
  const body = ICONS[name](s).map((p) => partSvg(p, solid, "var(--icon-knock, #fff)")).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="${STROKE}" stroke-linecap="${s.cap}" stroke-linejoin="${s.join}" aria-hidden="true">${body}</svg>`;
};
const icons = {};
for (const shape of Object.keys(SHAPES)) {
  icons[shape] = {};
  for (const name of Object.keys(ICONS)) icons[shape][name] = { line: svg(name, shape, false), solid: svg(name, shape, true) };
}
const todayAll = JSON.parse(fs.readFileSync(path.join(HERE, "heroicons-today.json"), "utf8"));
const today = Object.fromEntries(SHOWN.map((n) => [n, todayAll[n] || ""]));

const html = `<title>${BATCH ? `Icons batch ${BATCH.id}` : "Once UI Icons"}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<style>
/* Layout: a working specimen. Controls up top, the set, then one icon on its grid, then the set in UI. */
:root {
  --bg: #0b0b0c; --panel: #141416; --raised: #1b1b1e; --line: #2a2a2e; --fg: #ededee; --muted: #8d8d94;
  --accent: #7c8cff; --knock: #141416; --grid: rgba(124,140,255,.16); --key: rgba(124,140,255,.45);
  --display: "Geist", ui-sans-serif, system-ui, sans-serif; --mono: "Geist Mono", ui-monospace, monospace;
  --r: 8px; color-scheme: dark;
}
@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) {
  --bg: #f9f9f9; --panel: #f1f1f3; --raised: #ffffff; --line: #e1e1e5; --fg: #17171a; --muted: #6b6b73;
  --accent: #4655e0; --knock: #f1f1f3; --grid: rgba(70,85,224,.12); --key: rgba(70,85,224,.4); color-scheme: light } }
:root[data-theme="light"] {
  --bg: #f9f9f9; --panel: #f1f1f3; --raised: #ffffff; --line: #e1e1e5; --fg: #17171a; --muted: #6b6b73;
  --accent: #4655e0; --knock: #f1f1f3; --grid: rgba(70,85,224,.12); --key: rgba(70,85,224,.4); color-scheme: light }
body[data-shape="playful"] { --r: 16px } body[data-shape="rounded"] { --r: 8px } body[data-shape="conservative"] { --r: 2px }
* { box-sizing: border-box }
body { background: var(--bg); color: var(--fg); font: 15px/1.55 var(--display); margin: 0;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 40px 64px }
.wrap { max-width: 1040px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr); gap: 48px }
.wrap > * { min-width: 0 }
h1 { font-size: clamp(28px, 4vw, 40px); font-weight: 600; letter-spacing: -.02em; margin: 0; text-wrap: balance }
h2 { font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin: 0 0 16px }
p { margin: 0; max-width: 64ch; color: var(--muted) }
code, .mono { font-family: var(--mono); font-size: 13px }
header { display: grid; gap: 12px }
.controls { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5;
  background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(8px); padding-block: 12px; border-bottom: 1px solid var(--line) }
.seg { display: inline-flex; background: var(--panel); border: 1px solid var(--line); border-radius: calc(var(--r) + 3px); padding: 3px; gap: 2px }
.seg button { font: 500 13px var(--display); color: var(--muted); background: none; border: 0; padding: 6px 12px; border-radius: var(--r); cursor: pointer }
.seg button[aria-pressed="true"] { background: var(--raised); color: var(--fg); box-shadow: 0 0 0 1px var(--line) }
.seg button:focus-visible, .cell:focus-visible, .ui button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }
.label { font-size: 12px; color: var(--muted) }
.set { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 8px }
.cell { background: var(--panel); border: 1px solid transparent; border-radius: var(--r); padding: 20px 8px 10px; display: grid; justify-items: center; gap: 12px;
  color: var(--fg); cursor: pointer; font: inherit }
.cell[aria-pressed="true"] { border-color: var(--accent) }
.cell .mono { font-size: 11px; color: var(--muted) }
.glyph { display: grid; place-items: center; width: 32px; height: 32px }
.glyph svg { width: var(--size, 24px); height: var(--size, 24px) }
svg { --icon-knock: var(--knock) }
.focus { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px }
.focus figure { margin: 0; background: var(--panel); border-radius: var(--r); padding: 16px; display: grid; gap: 10px }
.focus figure[data-on="true"] { box-shadow: inset 0 0 0 1px var(--accent) }
.board { position: relative; aspect-ratio: 1; max-width: 100%; background:
  linear-gradient(var(--grid) 1px, transparent 1px) 0 0 / calc(100% / 24) calc(100% / 24),
  linear-gradient(90deg, var(--grid) 1px, transparent 1px) 0 0 / calc(100% / 24) calc(100% / 24) }
.board::after { content: ""; position: absolute; inset: calc(100% / 12); border: 1px dashed var(--key) }
.board svg { position: absolute; inset: 0; width: 100%; height: 100% }
figcaption { display: flex; justify-content: space-between; gap: 8px; font-size: 13px }
figcaption .mono { color: var(--muted); font-size: 12px }
.compare { display: grid; gap: 8px; overflow-x: auto }
.row { display: grid; grid-template-columns: 120px repeat(${SHOWN.length}, 32px); gap: 12px; align-items: center; min-width: max-content }
.row svg { width: 24px; height: 24px }
.ui { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 12px; background: var(--panel); border-radius: calc(var(--r) + 4px); padding: 12px }
.nav { display: grid; gap: 2px; align-content: start }
.nav a { display: flex; gap: 10px; align-items: center; padding: 8px 10px; border-radius: var(--r); color: var(--muted); text-decoration: none; font-size: 14px }
.nav a[aria-current="page"] { background: var(--raised); color: var(--fg) }
.nav svg, .ui button svg { width: 18px; height: 18px; flex: none }
.main { background: var(--raised); border-radius: var(--r); padding: 20px; display: grid; gap: 16px; align-content: start; min-width: 0 }
.bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center }
.ui button { display: inline-flex; align-items: center; gap: 8px; font: 500 14px var(--display); border-radius: var(--r); border: 1px solid var(--line);
  background: var(--panel); color: var(--fg); padding: 8px 14px; cursor: pointer }
.ui button.primary { background: var(--fg); color: var(--bg); border-color: var(--fg) }
.ui button.icon { padding: 8px; }
.ui button.danger { color: #e5484d }
.field { display: flex; align-items: center; gap: 8px; border: 1px solid var(--line); border-radius: var(--r); padding: 8px 12px; color: var(--muted); flex: 1 1 200px; min-width: 0 }
.field svg { width: 18px; height: 18px }
.item { display: flex; gap: 12px; align-items: center; padding: 12px; border: 1px solid var(--line); border-radius: var(--r) }
.item svg { width: 20px; height: 20px; color: var(--muted); flex: none }
.item div { min-width: 0; flex: 1 }
.item b { font-weight: 500; display: block } .item span { color: var(--muted); font-size: 13px }
table { border-collapse: collapse; width: 100%; font-size: 14px }
th, td { text-align: left; padding: 10px 12px 10px 0; border-bottom: 1px solid var(--line) }
th { color: var(--muted); font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: .06em }
.tablewrap { overflow-x: auto }
@media (max-width: 720px) { .focus { grid-template-columns: 1fr } .ui { grid-template-columns: 1fr } .nav { grid-auto-flow: column; overflow-x: auto } }
</style>

<div class="wrap">
  <header>
    <h1>${BATCH ? `Batch ${BATCH.id}: ${BATCH.title}` : "Once UI Icons"}</h1>
    <p>${BATCH ? `${BATCH.names.length} icons for review. Refer to them by number or name. Same rules as the proof: 24 grid, stroke ${STROKE}, three shapes that follow <code>data-border</code>.` : `A proof of ${Object.keys(ICONS).length} icons drawn as code on a 24 grid. One drawing gives three shapes, and the shape is the same setting as the theme's <code>data-border</code>, so icons round off or sharpen with the rest of the interface.`}</p>
  </header>

  <div class="controls" role="toolbar" aria-label="Preview settings">
    <span class="label">Shape</span>
    <div class="seg" data-group="shape"><button type="button" data-v="playful">Playful</button><button type="button" data-v="rounded">Rounded</button><button type="button" data-v="conservative">Conservative</button></div>
    <span class="label">Style</span>
    <div class="seg" data-group="style"><button type="button" data-v="line">Line</button><button type="button" data-v="solid">Solid</button></div>
    <span class="label">Size</span>
    <div class="seg" data-group="size"><button type="button" data-v="16">16</button><button type="button" data-v="20">20</button><button type="button" data-v="24">24</button><button type="button" data-v="32">32</button></div>
  </div>

  <section>
    <h2>The set</h2>
    <div class="set" id="set"></div>
  </section>

  <section>
    <h2>On the grid</h2>
    <div class="focus" id="focus"></div>
    <p style="margin-top:12px">Dashed square: the 2px padding every icon keeps inside its 24 box. Stroke ${STROKE} at every size.</p>
  </section>

  <section>
    <h2>In an interface</h2>
    <div class="ui" id="ui">
      <nav class="nav" aria-label="Example navigation">
        <a href="#" aria-current="page" data-i="home">Home</a>
        <a href="#" data-i="calendar">Bookings</a>
        <a href="#" data-i="chat">Messages</a>
        <a href="#" data-i="document">Contracts</a>
        <a href="#" data-i="person">Clients</a>
      </nav>
      <div class="main">
        <div class="bar">
          <div class="field" data-i="search">Search clients</div>
          <button type="button" class="icon" aria-label="Notifications" data-i="bell"></button>
          <button type="button" class="primary" data-i="plus">New client</button>
        </div>
        <div class="item" data-i="mail"><div><b>Halden &amp; Co</b><span>Invitation sent, waiting for company details</span></div><button type="button" class="icon" aria-label="Open" data-i="chevronRight"></button></div>
        <div class="item" data-i="lock"><div><b>Fjell Studio</b><span>Contract signed, locked for editing</span></div><button type="button" class="icon" aria-label="Open" data-i="chevronRight"></button></div>
        <div class="item" data-i="star"><div><b>Ember</b><span>Starred, two payments outstanding</span></div><button type="button" class="icon" aria-label="Open" data-i="chevronRight"></button></div>
        <div class="bar"><button type="button" data-i="check">Mark paid</button><button type="button" data-i="arrowRight">Send reminder</button><button type="button" class="danger" data-i="trash">Delete</button><button type="button" class="icon" aria-label="Close" data-i="close"></button></div>
      </div>
    </div>
  </section>

  <section>
    <h2>Today's built-ins next to ours</h2>
    <div class="compare" id="compare"></div>
    <p style="margin-top:12px">Top row: what core ships now (Heroicons outline; there is no plain check, so the circled one stands in). Bottom row: this proof at the shape picked above. Same grid and stroke, so a swap would not jolt existing apps.</p>
  </section>

  <section>
    <h2>The three shapes</h2>
    <div class="tablewrap"><table>
      <thead><tr><th>Shape</th><th>Caps</th><th>Joins</th><th>Box corners</th><th>Bends</th><th>Tips</th><th>Follows</th></tr></thead>
      <tbody>${Object.entries(SHAPES).map(([k, s]) => `<tr><td>${k[0].toUpperCase() + k.slice(1)}</td><td class="mono">${s.cap}</td><td class="mono">${s.join}</td><td class="mono">${s.rect}</td><td class="mono">${s.corner}</td><td class="mono">${s.tip || "sharp"}</td><td class="mono">data-border="${k}"</td></tr>`).join("")}</tbody>
    </table></div>
  </section>
</div>

<script>
const ICONS = ${JSON.stringify(icons)};
const TODAY = ${JSON.stringify(today)};
const NAMES = ${JSON.stringify(SHOWN)};
const SHAPES = ["playful", "rounded", "conservative"];
let st = { shape: "rounded", style: "line", size: "24", pick: NAMES[0] };
try { Object.assign(st, JSON.parse(localStorage.getItem("icons-proof") || "{}")); } catch (e) {}
if (!NAMES.includes(st.pick)) st.pick = NAMES[0];
const get = (shape, name) => ICONS[shape][name][st.style];

function render() {
  document.body.dataset.shape = st.shape;
  document.querySelectorAll(".seg").forEach((g) => g.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(st[g.dataset.group] === b.dataset.v))));
  const set = document.getElementById("set");
  set.style.setProperty("--size", st.size + "px");
  set.innerHTML = NAMES.map((n) => '<button type="button" class="cell" data-n="' + n + '" aria-pressed="' + (n === st.pick) + '"><span class="glyph">' + get(st.shape, n) + '</span><span class="mono">' + (NAMES.indexOf(n) + 1) + ' · ' + n + '</span></button>').join("");
  document.getElementById("focus").innerHTML = SHAPES.map((s) => '<figure data-on="' + (s === st.shape) + '"><div class="board">' + get(s, st.pick) + '</div><figcaption><span>' + s[0].toUpperCase() + s.slice(1) + '</span><span class="mono">' + st.pick + '</span></figcaption></figure>').join("");
  document.querySelectorAll("#ui [data-i]").forEach((el) => {
    el.querySelector("svg")?.remove();
    el.insertAdjacentHTML("afterbegin", ICONS[st.shape][el.dataset.i][el.matches('[aria-current="page"], .primary') ? "solid" : st.style]);
  });
  document.getElementById("compare").innerHTML =
    '<div class="row"><span class="label">Today</span>' + NAMES.map((n) => TODAY[n] || "").join("") + '</div>' +
    '<div class="row"><span class="label">Ours</span>' + NAMES.map((n) => ICONS[st.shape][n].line).join("") + '</div>';
  try { localStorage.setItem("icons-proof", JSON.stringify(st)); } catch (e) {}
}
document.querySelectorAll(".seg").forEach((g) => g.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { st[g.dataset.group] = b.dataset.v; render(); } }));
document.getElementById("set").addEventListener("click", (e) => { const b = e.target.closest(".cell"); if (b) { st.pick = b.dataset.n; render(); } });
document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
render();
</script>
`;
fs.writeFileSync(path.join(DIR, BATCH ? `batch-${BATCH.id}.html` : "index.html"), html);
console.log("index.html", html.length);
