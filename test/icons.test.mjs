import assert from "node:assert/strict";
import { test } from "node:test";
import { ICONS } from "../src/icons.mjs";
import { SHAPES } from "../src/shapes.mjs";

const nums = (d) => (d.match(/-?\d*\.?\d+/g) || []).map(Number);

test("every icon draws in every shape", () => {
  for (const name of Object.keys(ICONS))
    for (const [shape, s] of Object.entries(SHAPES)) {
      const parts = ICONS[name](s);
      assert.ok(parts.length > 0, `${name}/${shape}`);
      for (const p of parts) assert.match(p.d || (p.only === "solid" && p.cut) || "", /^M/, `${name}/${shape} starts with a move`);
      for (const p of parts) assert.ok(!/NaN|Infinity/.test(p.d), `${name}/${shape} has a bad number`);
    }
});

test("absolute coordinates stay inside the 24 box", () => {
  for (const name of Object.keys(ICONS))
    for (const [shape, s] of Object.entries(SHAPES))
      for (const p of ICONS[name](s))
        for (const seg of p.d.match(/[MLHV][^MLHVACQSTZaclhvqst]*/g) || [])
          for (const n of nums(seg)) assert.ok(n >= 1 && n <= 23, `${name}/${shape}: ${n} outside 1..23`);
});

test("brands: every mark draws", async () => {
  const { BRANDS, BRAND_TITLES } = await import("../src/brands.mjs");
  assert.deepEqual(Object.keys(BRANDS).sort(), Object.keys(BRAND_TITLES).sort());
  for (const [name, draw] of Object.entries(BRANDS)) {
    const parts = draw();
    assert.ok(parts.length > 0, name);
    for (const p of parts) {
      assert.match(p.d, /^M/, `${name} starts with a move`);
      assert.ok(!/NaN|Infinity/.test(p.d), `${name} has a bad number`);
    }
  }
});
