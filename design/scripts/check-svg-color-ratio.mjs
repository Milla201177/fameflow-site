import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nodeModulePaths = [
  process.env.NODE_PATH,
  "/Users/milalasska/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
].filter(Boolean);
const { PNG } = require(require.resolve("pngjs", { paths: nodeModulePaths }));
const { chromium } = require(require.resolve("playwright", { paths: nodeModulePaths }));

const outDir = "outputs/svg-components";
const tmpDir = "/private/tmp/fameflow-svg-ratio";
mkdirSync(tmpDir, { recursive: true });

const files = readdirSync(outDir)
  .filter((file) => file.endsWith(".svg") && !file.startsWith("00-"))
  .sort();

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }

  return { h, s, l };
}

function classify(r, g, b, a) {
  if (a < 16) return "transparent";
  const { h, s, l } = rgbToHsl(r, g, b);
  const channelSpread = Math.max(r, g, b) - Math.min(r, g, b);

  if (s < 0.14 || channelSpread < 18 || l < 0.18 || l > 0.96) {
    return "monochrome";
  }

  if (h >= 235 && h <= 270) {
    return "lavender";
  }

  if (h >= 135 && h <= 175) {
    return "mint";
  }

  return "other";
}

function pct(value, total) {
  return total ? Number(((value / total) * 100).toFixed(1)) : 0;
}

const browser = await chromium.launch({ headless: true });
const totals = { monochrome: 0, lavender: 0, mint: 0, other: 0 };
const perFile = [];

for (const file of files) {
  const page = await browser.newPage({ viewport: { width: 520, height: 520 }, deviceScaleFactor: 1 });
  const url = `file://${resolve(join(outDir, file))}`;
  await page.goto(url);
  const box = await page.locator("svg").boundingBox();
  const pngPath = join(tmpDir, file.replace(".svg", ".png"));
  await page.screenshot({
    path: pngPath,
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(box.width),
      height: Math.ceil(box.height),
    },
    omitBackground: true,
  });
  await page.close();

  const png = PNG.sync.read(readFileSync(pngPath));
  const counts = { monochrome: 0, lavender: 0, mint: 0, other: 0 };
  for (let i = 0; i < png.data.length; i += 4) {
    const bucket = classify(png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]);
    if (bucket !== "transparent") counts[bucket] += 1;
  }

  const total = counts.monochrome + counts.lavender + counts.mint + counts.other;
  Object.keys(totals).forEach((key) => {
    totals[key] += counts[key];
  });
  perFile.push({
    file,
    totalPixels: total,
    monochrome: pct(counts.monochrome, total),
    lavenderPrimary: pct(counts.lavender, total),
    mintSecondary: pct(counts.mint, total),
    other: pct(counts.other, total),
  });
}

await browser.close();

const totalPixels = totals.monochrome + totals.lavender + totals.mint + totals.other;
const summary = {
  target: {
    monochrome: 60,
    lavenderPrimary: 30,
    mintSecondary: 10,
  },
  actual: {
    monochrome: pct(totals.monochrome, totalPixels),
    lavenderPrimary: pct(totals.lavender, totalPixels),
    mintSecondary: pct(totals.mint, totalPixels),
    other: pct(totals.other, totalPixels),
  },
  note: "Measured rendered pixels of individual SVG components, excluding transparent pixels and the overview sheet background.",
  files: perFile,
};

writeFileSync(join(outDir, "color-ratio-report.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(
  join(outDir, "color-ratio-report.md"),
  `# FameFlow SVG Color Ratio Report

Target: 60% monochrome, 30% primary lavender/primary button, 10% secondary mint.

Actual across individual component SVGs:

- Monochrome: ${summary.actual.monochrome}%
- Primary lavender/button: ${summary.actual.lavenderPrimary}%
- Secondary mint: ${summary.actual.mintSecondary}%
- Other accent pixels: ${summary.actual.other}%

Method: ${summary.note}
`
);

console.log(JSON.stringify(summary.actual, null, 2));
