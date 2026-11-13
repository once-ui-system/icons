// Motion prototype: proof/motion.html. Icons that move, in every shape, plus what it means for NavIcon.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ICONS } from "../src/icons.mjs";
import { SHAPES, STROKE } from "../src/shapes.mjs";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "proof");
const pick = (name, s) => ICONS[name](s).map((p) => ({ d: p.d, fill: !!p.fill, knock: !!p.knock, cut: p.cut || null }));
const NAMES = ["check", "bell", "plus", "chevronDown", "arrowRight", "refresh", "eye", "heart", "trash", "checkbox"];
const data = Object.fromEntries(Object.entries(SHAPES).map(([k, s]) => [k, { cap: s.cap, join: s.join, icons: Object.fromEntries(NAMES.map((n) => [n, pick(n, s)])) }]));

// Timing follows the shape: playful overshoots, rounded settles, conservative is quick and exact.
const TIMING = {
  playful: { ease: "cubic-bezier(.34,1.56,.64,1)", out: "cubic-bezier(.22,1,.36,1)", dur: 420, pop: 1.14 },
  rounded: { ease: "cubic-bezier(.22,1,.36,1)", out: "cubic-bezier(.22,1,.36,1)", dur: 320, pop: 1.07 },
  conservative: { ease: "cubic-bezier(.4,0,.2,1)", out: "cubic-bezier(.4,0,.2,1)", dur: 200, pop: 1 },
};

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
h2.section { margin:16px 0 0; font-size:20px; font-weight:600; letter-spacing:-.01em }
p { margin:0; color:var(--muted); max-width:70ch }
.controls { display:flex; flex-wrap:wrap; gap:10px 18px; align-items:center; position:sticky; top:0; z-index:2; background:var(--bg); padding:10px 0 }
.label { font-size:12px; color:var(--muted) }
.seg { display:inline-flex; background:var(--panel); border:1px solid var(--line); border-radius:11px; padding:3px; gap:2px }
.seg button { font:500 13px var(--display); color:var(--muted); background:none; border:0; padding:6px 12px; border-radius:8px; cursor:pointer }
.seg button[aria-pressed="true"] { background:var(--raised); color:var(--fg); box-shadow:0 0 0 1px var(--line) }
button:focus-visible, [role="button"]:focus-visible { outline:2px solid var(--accent); outline-offset:2px }
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
svg.i { fill:none; stroke:currentColor; stroke-width:${STROKE}; overflow:visible; --knock: var(--raised) }
svg.i * { transform-box: view-box; transform-origin: 12px 12px }
.mono { font:12px var(--mono); color:var(--muted) }

/* menu <-> close */
.mc line { transition: transform var(--dur) var(--ease), opacity calc(var(--dur) * .6) ease }
.mc .t { transform-origin: 12px 6.75px } .mc .m { transform-origin: 12px 12px } .mc .b { transform-origin: 12px 17.25px }
.open .mc .t, .mc.open .t { transform: translateY(5.25px) rotate(45deg) scaleX(1.06) }
.open .mc .m, .mc.open .m { transform: scaleX(0); opacity: 0 }
.open .mc .b, .mc.open .b { transform: translateY(-5.25px) rotate(-45deg) scaleX(1.06) }
/* two-line menu, like NavIcon today but in the icon set's stroke and caps */
.mc2 line { transition: transform var(--dur) var(--ease) }
.mc2 .t { transform-origin: 12px 9px } .mc2 .b { transform-origin: 12px 15px }
.open .mc2 .t { transform: translateY(3px) rotate(45deg) scaleX(1.06) }
.open .mc2 .b { transform: translateY(-3px) rotate(-45deg) scaleX(1.06) }

/* check: short leg quickly, long leg settles, a small pop at the end (none in conservative) */
.play-check .ck path { animation: ck calc(var(--dur) * 1.9) linear both }
@keyframes ck { 0% { stroke-dashoffset: 1; animation-timing-function: cubic-bezier(.5,0,.9,.6) } 32% { stroke-dashoffset: .68; animation-timing-function: cubic-bezier(.2,.7,.3,1) } 100% { stroke-dashoffset: 0 } }
.play-check .ck { animation: pop calc(var(--dur) * 1.1) var(--ease) calc(var(--dur) * 1.5) both }
@keyframes pop { 0% { transform: scale(1) } 45% { transform: scale(var(--pop)) } 100% { transform: scale(1) } }
.ck path { stroke-dasharray: 1 }
/* checkbox: the box fills, then the tick draws through it */
.cb .box { transition: fill var(--dur) var(--out) }
.on .cb .box { fill: currentColor }
.cb .tick { stroke-dasharray: 1; stroke-dashoffset: 1; stroke: var(--knock); transition: stroke-dashoffset 0s }
.on .cb .tick { stroke-dashoffset: 0; transition: stroke-dashoffset calc(var(--dur) * 1.4) var(--out) calc(var(--dur) * .45) }
.on .cb { animation: pop calc(var(--dur) * 1.2) var(--ease) }

/* bell: the body swings from its top, the clapper follows */
.bell g, .bell .clap { transform-origin: 12px 4px }
.play-ring .bell g { animation: swing calc(var(--dur) * 2.4) ease-out }
.play-ring .bell .clap { animation: swing2 calc(var(--dur) * 2.4) ease-out 50ms }
@keyframes swing { 0%{transform:rotate(0)} 15%{transform:rotate(14deg)} 35%{transform:rotate(-11deg)} 55%{transform:rotate(7deg)} 75%{transform:rotate(-3deg)} 100%{transform:rotate(0)} }
@keyframes swing2 { 0%{transform:rotate(0)} 20%{transform:rotate(18deg)} 42%{transform:rotate(-14deg)} 62%{transform:rotate(8deg)} 82%{transform:rotate(-3deg)} 100%{transform:rotate(0)} }

/* plus -> close: a quarter-turn and a little longer */
.pc path { transition: transform var(--dur) var(--ease) }
.open .pc path { transform: rotate(135deg) scale(1.1) }
/* chevron flips for accordions */
.cv path { transition: transform var(--dur) var(--ease) }
.open .cv path { transform: rotate(180deg) }
/* arrow nudges on hover */
.ar path { transition: transform var(--dur) var(--ease) }
.hover .ar path, .btn:hover .ar path { transform: translateX(2.5px) }
/* button arrow: a chevron at rest, the shaft grows in and the head moves forward on hover (replaces core's Arrow) */
.ga .shaft { transform-origin: 18.75px 12px; transform: scaleX(0); opacity: 0; transition: transform var(--dur) var(--ease), opacity calc(var(--dur) * .5) ease }
.ga .head { transform: translateX(-3px); transition: transform var(--dur) var(--ease) }
.hover .ga .shaft, .btn:hover .ga .shaft { transform: scaleX(1); opacity: 1 }
.hover .ga .head, .btn:hover .ga .head { transform: translateX(0) }
/* refresh spins once */
.play-spin .rf { animation: spin calc(var(--dur) * 3.8) cubic-bezier(.45,0,.2,1) }
@keyframes spin { to { transform: rotate(360deg) } }
/* eye blinks */
.play-blink .ey { animation: blink calc(var(--dur) * 1.1) ease-in-out }
@keyframes blink { 0%,100% { transform: scaleY(1) } 45%,55% { transform: scaleY(.08) } }
/* heart: line to solid with a beat */
.hr path { transition: fill calc(var(--dur) * .6) var(--out) }
.on .hr path { fill: currentColor }
.on .hr { animation: beat calc(var(--dur) * 1.8) var(--ease) }
@keyframes beat { 0% { transform: scale(1) } 25% { transform: scale(calc(var(--pop) + .08)) } 50% { transform: scale(.94) } 100% { transform: scale(1) } }
/* trash: the lid lifts and tips on hover */
.tr .lid { transition: transform var(--dur) var(--ease); transform-origin: 19px 6.5px }
.hover .tr .lid, .btn:hover .tr .lid { transform: translateY(-1.6px) rotate(14deg) }

/* NavIcon */
.navrow { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:14px }
.bar { display:flex; align-items:center; justify-content:space-between; height:56px; padding:0 8px 0 16px; border-radius:12px; background:var(--raised); border:1px solid var(--line) }
.logo { font-weight:600; letter-spacing:-.01em }
.nav { width:40px; height:40px; border-radius:10px; display:grid; place-items:center; cursor:pointer; position:relative; color:var(--fg) }
.nav:hover { background:var(--panel) }
.nav svg { width:24px; height:24px }
.today .ln { position:absolute; left:50%; top:50%; width:24px; height:1px; background:currentColor; transition: transform .3s ease }
.today .ln:first-child { transform: translateX(-50%) translateY(-4px) } .today .ln:last-child { transform: translateX(-50%) translateY(4px) }
.open.today .ln:first-child { transform: translateX(-50%) rotate(45deg) } .open.today .ln:last-child { transform: translateX(-50%) rotate(-45deg) }
.menu { overflow:hidden; display:grid; grid-template-rows:0fr; transition: grid-template-rows var(--dur) var(--out) }
.menu > div { min-height:0; display:grid; gap:2px; padding:0 8px }
.open + .menu, .menu.show { grid-template-rows:1fr }
.menu a { display:block; padding:8px 10px; border-radius:8px; color:var(--fg); text-decoration:none; font-size:14px }
.menu a:hover { background:var(--panel) }
.navcard { display:grid; gap:10px; background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:16px; min-width:0 }

@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important } }
</style>
<div class="wrap">
  <h1>Icon Motion</h1>
  <p>Icons that move, to get a feel for it. Click or hover each stage, or use the button under it at real size. Timing follows the shape: playful overshoots a little, rounded settles softly, conservative is quick and exact with no pop. With reduced motion turned on, everything stays still.</p>
  <div class="controls">
    <span class="label">Shape</span>
    <div class="seg" data-group="shape"><button type="button" data-v="playful">Playful</button><button type="button" data-v="rounded">Rounded</button><button type="button" data-v="conservative">Conservative</button></div>
    <span class="mono" id="timing"></span>
  </div>

  <h2 class="section">NavIcon</h2>
  <p>Today NavIcon draws two 1px lines that don't match any icon. With the icon set, it becomes the menu icon itself: the same stroke, caps and timing as every other icon in the theme. Open each one to compare. The three-line version is the menu icon as drawn; the two-line version keeps today's lighter look.</p>
  <div class="navrow">
    <div class="navcard"><span class="kind">Today</span>
      <div class="bar"><span class="logo">Fjell</span><div class="nav today" role="button" tabindex="0" aria-label="Menu" aria-expanded="false"><span class="ln"></span><span class="ln"></span></div></div>
    </div>
    <div class="navcard"><span class="kind">Menu icon, three lines</span>
      <div class="bar"><span class="logo">Fjell</span><div class="nav" role="button" tabindex="0" aria-label="Menu" aria-expanded="false"><svg class="i mc" viewBox="0 0 24 24"></svg></div></div>
    </div>
    <div class="navcard"><span class="kind">Menu icon, two lines</span>
      <div class="bar"><span class="logo">Fjell</span><div class="nav" role="button" tabindex="0" aria-label="Menu" aria-expanded="false"><svg class="i mc2" viewBox="0 0 24 24"></svg></div></div>
    </div>
  </div>

  <h2 class="section">Icons</h2>
  <div class="cards">
    <section class="card"><span class="kind">Entrance</span><h3>Check</h3><p>The short leg goes quickly, the long leg settles, then a small pop.</p>
      <button class="stage" data-play="check"><svg class="i ck" viewBox="0 0 24 24"></svg></button>
      <button class="btn" data-play="check"><svg class="i ck" viewBox="0 0 24 24"></svg>Saved</button></section>
    <section class="card"><span class="kind">State</span><h3>Checkbox</h3><p>The box fills, then the tick draws through it.</p>
      <button class="stage" data-toggle="on"><svg class="i cb" viewBox="0 0 24 24"></svg></button>
      <button class="btn" data-toggle="on"><svg class="i cb" viewBox="0 0 24 24"></svg>Agree</button></section>
    <section class="card"><span class="kind">Hover</span><h3>Bell</h3><p>The body swings from its top and the clapper follows a beat later.</p>
      <button class="stage" data-play="ring"><svg class="i bell" viewBox="0 0 24 24"></svg></button>
      <button class="btn" data-play="ring"><svg class="i bell" viewBox="0 0 24 24"></svg>Notifications</button></section>
    <section class="card"><span class="kind">State</span><h3>Plus to close</h3><p>A turn and a touch longer, for add buttons that become cancel.</p>
      <button class="stage" data-toggle="open"><svg class="i pc" viewBox="0 0 24 24"></svg></button>
      <button class="btn" data-toggle="open"><svg class="i pc" viewBox="0 0 24 24"></svg>Add</button></section>
    <section class="card"><span class="kind">State</span><h3>Chevron</h3><p>Flips for an accordion or a select opening.</p>
      <button class="stage" data-toggle="open"><svg class="i cv" viewBox="0 0 24 24"></svg></button>
      <button class="btn" data-toggle="open">Details<svg class="i cv" viewBox="0 0 24 24"></svg></button></section>
    <section class="card"><span class="kind">Hover</span><h3>Arrow</h3><p>Leans forward on hover, for links and next steps.</p>
      <button class="stage" data-hover><svg class="i ar" viewBox="0 0 24 24"></svg></button>
      <button class="btn">Continue<svg class="i ar" viewBox="0 0 24 24"></svg></button></section>
    <section class="card"><span class="kind">Hover</span><h3>Button arrow</h3><p>A chevron at rest; on hover the shaft grows in and the head moves forward. CSS only, so it would replace Button's arrowIcon and the Arrow component's JavaScript.</p>
      <button class="stage" data-hover><svg class="i ga" viewBox="0 0 24 24"></svg></button>
      <button class="btn">Get started<svg class="i ga" viewBox="0 0 24 24"></svg></button></section>
    <section class="card"><span class="kind">Action</span><h3>Refresh</h3><p>One full turn when pressed.</p>
      <button class="stage" data-play="spin"><svg class="i rf" viewBox="0 0 24 24"></svg></button>
      <button class="btn" data-play="spin"><svg class="i rf" viewBox="0 0 24 24"></svg>Refresh</button></section>
    <section class="card"><span class="kind">Hover</span><h3>Eye</h3><p>Blinks once.</p>
      <button class="stage" data-play="blink"><svg class="i ey" viewBox="0 0 24 24"></svg></button>
      <button class="btn" data-play="blink"><svg class="i ey" viewBox="0 0 24 24"></svg>Show</button></section>
    <section class="card"><span class="kind">State</span><h3>Heart</h3><p>Line turns solid with a beat, for like and favourite.</p>
      <button class="stage" data-toggle="on"><svg class="i hr" viewBox="0 0 24 24"></svg></button>
      <button class="btn" data-toggle="on"><svg class="i hr" viewBox="0 0 24 24"></svg>Favourite</button></section>
    <section class="card"><span class="kind">Hover</span><h3>Trash</h3><p>The lid lifts and tips before a delete.</p>
      <button class="stage" data-hover><svg class="i tr" viewBox="0 0 24 24"></svg></button>
      <button class="btn"><svg class="i tr" viewBox="0 0 24 24"></svg>Delete</button></section>
  </div>
</div>
<script>
const DATA = ${JSON.stringify(data)};
const TIMING = ${JSON.stringify(TIMING)};
let shape = "rounded";
try { shape = localStorage.getItem("icon-motion-shape") || shape; } catch (e) {}
const P = (d, extra = "") => '<path d="' + d + '"' + extra + '/>';
function render() {
  const D = DATA[shape], I = D.icons, t = TIMING[shape], root = document.documentElement.style;
  document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === shape)));
  root.setProperty("--dur", t.dur + "ms"); root.setProperty("--ease", t.ease); root.setProperty("--out", t.out); root.setProperty("--pop", t.pop);
  document.getElementById("timing").textContent = t.dur + "ms · " + t.ease;
  document.querySelectorAll("svg.i").forEach((s) => { s.setAttribute("stroke-linecap", D.cap); s.setAttribute("stroke-linejoin", D.join); });
  const fill = (sel, html) => document.querySelectorAll(sel).forEach((s) => { s.innerHTML = html; });
  fill("svg.mc", '<line class="t" x1="4" y1="6.75" x2="20" y2="6.75"/><line class="m" x1="4" y1="12" x2="20" y2="12"/><line class="b" x1="4" y1="17.25" x2="20" y2="17.25"/>');
  fill("svg.mc2", '<line class="t" x1="4" y1="9" x2="20" y2="9"/><line class="b" x1="4" y1="15" x2="20" y2="15"/>');
  fill("svg.ck", P(I.check[0].d, ' pathLength="1"'));
  fill("svg.cb", P(I.checkbox[0].d, ' class="box"') + P(I.checkbox[1].d, ' class="tick" pathLength="1"'));
  fill("svg.bell", '<g>' + P(I.bell[0].d) + P(I.bell[1].d) + '</g>' + P(I.bell[2].d, ' class="clap"'));
  fill("svg.pc", P(I.plus[0].d));
  fill("svg.cv", P(I.chevronDown[0].d));
  fill("svg.ar", P(I.arrowRight[0].d));
  fill("svg.ga", '<path class="shaft" d="M5.25 12H17.75"/><path class="head" d="' + I.arrowRight[0].d.replace(/^M[^M]*/, "") + '"/>');
  fill("svg.rf", '<g class="rf">' + I.refresh.map((p) => P(p.d)).join("") + '</g>');
  fill("svg.ey", '<g class="ey">' + P(I.eye[0].d) + P(I.eye[1].d) + '</g>');
  fill("svg.hr", P(I.heart[0].d));
  fill("svg.tr", '<g class="lid">' + P(I.trash[0].d) + P(I.trash[1].d) + '</g>' + I.trash.slice(2).map((p) => P(p.d)).join(""));
}
document.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => { shape = b.dataset.v; try { localStorage.setItem("icon-motion-shape", shape); } catch (e) {} render(); }));
function play(el) { const c = "play-" + el.dataset.play; el.classList.remove(c); void el.offsetWidth; el.classList.add(c); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove(c), 2400); }
document.querySelectorAll("[data-play]").forEach((el) => { el.addEventListener("mouseenter", () => play(el)); el.addEventListener("click", () => play(el)); });
document.querySelectorAll("[data-toggle]").forEach((el) => el.addEventListener("click", () => el.classList.toggle(el.dataset.toggle)));
document.querySelectorAll("[data-hover]").forEach((el) => { el.addEventListener("mouseenter", () => el.classList.add("hover")); el.addEventListener("mouseleave", () => el.classList.remove("hover")); el.addEventListener("click", () => el.classList.toggle("hover")); });
document.querySelectorAll(".nav").forEach((n) => {
  const toggle = () => { const o = n.classList.toggle("open"); n.setAttribute("aria-expanded", String(o)); };
  n.addEventListener("click", toggle);
  n.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
});
render();
// Show a few once on load.
setTimeout(() => { document.querySelectorAll(".stage[data-play]").forEach(play); document.querySelectorAll(".nav").forEach((n) => n.click()); }, 600);
setTimeout(() => document.querySelectorAll(".nav").forEach((n) => n.click()), 1800);
</script>
`;
fs.writeFileSync(path.join(OUT, "motion.html"), html);
console.log("wrote proof/motion.html");
