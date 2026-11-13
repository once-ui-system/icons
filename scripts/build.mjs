// Builds dist/ from src/: raw SVGs per shape, IconNode data (the shape core's
// generator and native sync:icons read), and React components.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { partAttrs } from "../src/render.mjs";
import { ICONS } from "../src/icons.mjs";
import { BRANDS, BRAND_TITLES } from "../src/brands.mjs";
import { DEFAULT_SHAPE, SHAPES, STROKE } from "../src/shapes.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
fs.rmSync(DIST, { recursive: true, force: true });

/** IconNode: { tag, attr, child } — the same shape react-icons and core use. */
export function node(name, shape, solid = false) {
  const s = SHAPES[shape];
  return {
    tag: "svg",
    attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: String(STROKE),
      strokeLinecap: s.cap, strokeLinejoin: s.join, "aria-hidden": "true" },
    child: ICONS[name](s).map((p) => partAttrs(p, solid, "var(--icon-knock, #fff)")).filter(Boolean)
      .map((attr) => ({ tag: "path", attr, child: [] })),
  };
}

const kebab = (k) => (k === "viewBox" ? k : k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));
const toSvg = (n, root = true) =>
  `<${n.tag}${root ? ' xmlns="http://www.w3.org/2000/svg" width="24" height="24"' : ""}${Object.entries(n.attr)
    .map(([k, v]) => ` ${kebab(k)}="${v}"`).join("")}>${n.child.map((c) => toSvg(c, false)).join("")}</${n.tag}>`;
const pascal = (s) => s[0].toUpperCase() + s.slice(1);

const names = Object.keys(ICONS).sort();
const data = {};
for (const shape of Object.keys(SHAPES)) {
  data[shape] = {};
  for (const name of names) {
    data[shape][name] = { line: node(name, shape), solid: node(name, shape, true) };
    for (const style of ["line", "solid"]) {
      const file = path.join(DIST, "svg", shape, `${name}${style === "solid" ? "-solid" : ""}.svg`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, `${toSvg(data[shape][name][style])}\n`);
    }
  }
}

fs.mkdirSync(path.join(DIST, "data"), { recursive: true });
fs.writeFileSync(path.join(DIST, "data", "index.js"),
  `export const shapes = ${JSON.stringify(Object.keys(SHAPES))};\nexport const defaultShape = "${DEFAULT_SHAPE}";\nexport const iconData = ${JSON.stringify(data)};\n`);
fs.writeFileSync(path.join(DIST, "data", "index.d.ts"),
  `export type IconShape = ${Object.keys(SHAPES).map((s) => `"${s}"`).join(" | ")};
export type IconName = ${names.map((n) => `"${n}"`).join(" | ")};
export interface IconNode { tag: string; attr: Record<string, string>; child: IconNode[] }
export declare const shapes: IconShape[];
export declare const defaultShape: IconShape;
export declare const iconData: Record<IconShape, Record<IconName, { line: IconNode; solid: IconNode }>>;
`);

// React: one component per icon, tree-shakable; `shape` and `solid` props.
fs.mkdirSync(path.join(DIST, "react"), { recursive: true });
fs.writeFileSync(path.join(DIST, "react", "index.js"), `import { createElement as h } from "react";
import { iconData, defaultShape } from "../data/index.js";
const render = (n, k) => h(n.tag, { key: k, ...n.attr }, n.child.map(render));
export function createIcon(name) {
  const Icon = ({ shape = defaultShape, solid = false, ...props }) => {
    const n = iconData[shape][name][solid ? "solid" : "line"];
    return h("svg", { ...n.attr, width: "1em", height: "1em", ...props }, n.child.map(render));
  };
  Icon.displayName = "${"${"}name${"}"}";
  return Icon;
}
${names.map((n) => `export const ${pascal(n)}Icon = /*#__PURE__*/ createIcon("${n}");`).join("\n")}
`.replace('"${name}"', "name"));
fs.writeFileSync(path.join(DIST, "react", "index.d.ts"), `import type { ComponentType, SVGProps } from "react";
import type { IconName, IconShape } from "../data/index.js";
export interface IconProps extends SVGProps<SVGSVGElement> { shape?: IconShape; solid?: boolean }
export declare function createIcon(name: IconName): ComponentType<IconProps>;
${names.map((n) => `export declare const ${pascal(n)}Icon: ComponentType<IconProps>;`).join("\n")}
`);
// Brands: our product marks, a separate entry point so the default set stays logo-free.
// One filled drawing each, the same in every shape.
const brandNames = Object.keys(BRANDS).sort();
const brandNode = (name) => ({
  tag: "svg",
  attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: String(STROKE),
    strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
  child: BRANDS[name]().map((p) => partAttrs(p, true, "var(--icon-knock, #fff)")).filter(Boolean).map((attr) => ({ tag: "path", attr, child: [] })),
});
const brandData = Object.fromEntries(brandNames.map((n) => [n, brandNode(n)]));
for (const n of brandNames) {
  fs.mkdirSync(path.join(DIST, "svg", "brands"), { recursive: true });
  fs.writeFileSync(path.join(DIST, "svg", "brands", `${n}.svg`), `${toSvg(brandData[n])}\n`);
}
fs.mkdirSync(path.join(DIST, "brands"), { recursive: true });
fs.writeFileSync(path.join(DIST, "brands", "index.js"), `import { createElement as h } from "react";
export const brandTitles = ${JSON.stringify(Object.fromEntries(brandNames.map((n) => [n, BRAND_TITLES[n]])))};
export const brandData = ${JSON.stringify(brandData)};
const render = (n, k) => h(n.tag, { key: k, ...n.attr }, n.child.map(render));
export function createBrand(name) {
  const Brand = ({ title = brandTitles[name], ...props }) => {
    const n = brandData[name];
    return h("svg", { ...n.attr, "aria-hidden": undefined, role: "img", width: "1em", height: "1em", ...props }, [h("title", { key: "t" }, title), ...n.child.map(render)]);
  };
  Brand.displayName = name;
  return Brand;
}
${brandNames.map((n) => `export const ${pascal(n)}Brand = /*#__PURE__*/ createBrand("${n}");`).join("\n")}
`);
fs.writeFileSync(path.join(DIST, "brands", "index.d.ts"), `import type { ComponentType, SVGProps } from "react";
import type { IconNode } from "../data/index.js";
export type BrandName = ${brandNames.map((n) => `"${n}"`).join(" | ")};
export interface BrandProps extends SVGProps<SVGSVGElement> { title?: string }
export declare const brandTitles: Record<BrandName, string>;
export declare const brandData: Record<BrandName, IconNode>;
export declare function createBrand(name: BrandName): ComponentType<BrandProps>;
${brandNames.map((n) => `export declare const ${pascal(n)}Brand: ComponentType<BrandProps>;`).join("\n")}
`);
console.log(`built ${names.length} icons x ${Object.keys(SHAPES).length} shapes, ${brandNames.length} brands`);
