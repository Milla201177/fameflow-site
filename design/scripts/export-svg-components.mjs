import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "outputs/svg-components";
mkdirSync(outDir, { recursive: true });

const colors = {
  bg: "#FAFAFC",
  surface: "#FFFFFF",
  soft: "#F7F4FF",
  brand: "#DBD4FA",
  brandSoft: "#F6F4FE",
  character: "#C6FCE4",
  primary: "#8F7CF6",
  green: "#67D7AA",
  text: "#1E1E24",
  muted: "#6F6F7A",
  disabled: "#A8A8B3",
  border: "#E8E6F2",
  dark: "#14141C",
  warning: "#F5D780",
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const svg = (width, height, body, extra = "") => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
<title>FameFlow component</title>
<defs>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#1E1E24" flood-opacity="0.10"/>
  </filter>
  <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
    <stop stop-color="#DBD4FA"/>
    <stop offset="1" stop-color="#8F7CF6"/>
  </linearGradient>
  <linearGradient id="greenGrad" x1="0" y1="0" x2="120" y2="96" gradientUnits="userSpaceOnUse">
    <stop stop-color="#C6FCE4"/>
    <stop offset="1" stop-color="#67D7AA"/>
  </linearGradient>
  <linearGradient id="purpleGrad" x1="0" y1="0" x2="140" y2="96" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F5F1FF"/>
    <stop offset="1" stop-color="#DBD4FA"/>
  </linearGradient>
  ${extra}
</defs>
${body}
</svg>
`;

const rect = (x, y, w, h, r, fill, stroke = "none", sw = 1, attrs = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${attrs}/>`;

const text = (x, y, value, size = 14, weight = 500, fill = colors.text, anchor = "start") =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="${weight}" letter-spacing="0" text-anchor="${anchor}">${esc(value)}</text>`;

const line = (x1, y1, x2, y2, stroke = colors.text, sw = 2) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;

const icon = {
  sparkle: (x, y, c = colors.text) => `<path d="M${x + 12} ${y + 3} ${x + 14.4} ${y + 9.1} ${x + 21} ${y + 9.4}l-5.1 4.1 1.7 6.5-5.6-3.6L${x + 6.4} ${y + 20}l1.7-6.5L${x + 3} ${y + 9.4}l6.6-.3L${x + 12} ${y + 3}Z" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/>`,
  user: (x, y, c = colors.text) => `<circle cx="${x + 12}" cy="${y + 8}" r="4" stroke="${c}" stroke-width="1.8"/><path d="M${x + 5} ${y + 21}c1.4-4 4-6 7-6s5.6 2 7 6" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`,
  image: (x, y, c = colors.text) => `<rect x="${x + 4}" y="${y + 5}" width="16" height="14" rx="2" stroke="${c}" stroke-width="1.8"/><path d="m${x + 7} ${y + 16} 4-4 3 3 2-2 1 3" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  grid: (x, y, c = colors.text) => `<rect x="${x + 4}" y="${y + 4}" width="6" height="6" rx="1" stroke="${c}" stroke-width="1.8"/><rect x="${x + 14}" y="${y + 4}" width="6" height="6" rx="1" stroke="${c}" stroke-width="1.8"/><rect x="${x + 4}" y="${y + 14}" width="6" height="6" rx="1" stroke="${c}" stroke-width="1.8"/><rect x="${x + 14}" y="${y + 14}" width="6" height="6" rx="1" stroke="${c}" stroke-width="1.8"/>`,
  video: (x, y, c = colors.text) => `<rect x="${x + 4}" y="${y + 7}" width="12" height="10" rx="2" stroke="${c}" stroke-width="1.8"/><circle cx="${x + 10}" cy="${y + 12}" r="2" stroke="${c}" stroke-width="1.8"/><path d="m${x + 16} ${y + 10} 4-2v8l-4-2" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  audio: (x, y, c = colors.text) => `<path d="M${x + 9} ${y + 18}V${y + 5}l11-2v13" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x + 6}" cy="${y + 18}" r="3" stroke="${c}" stroke-width="1.8"/><circle cx="${x + 17}" cy="${y + 16}" r="3" stroke="${c}" stroke-width="1.8"/>`,
  chevron: (x, y, c = colors.muted) => `<path d="m${x + 8} ${y + 5} 6 7-6 7" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  check: (x, y, c = colors.primary) => `<path d="m${x + 5} ${y + 12} 4 4 10-10" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  plus: (x, y, c = colors.text) => `${line(x + 12, y + 5, x + 12, y + 19, c)}${line(x + 5, y + 12, x + 19, y + 12, c)}`,
  menu: (x, y, c = colors.text) => `${line(x + 5, y + 7, x + 19, y + 7, c, 2.4)}${line(x + 5, y + 12, x + 19, y + 12, c, 2.4)}${line(x + 5, y + 17, x + 19, y + 17, c, 2.4)}`,
};

const logoMark = (x, y) => `
  <g>
    <rect x="${x}" y="${y}" width="32" height="32" rx="9" fill="url(#logoGrad)"/>
    <path d="M${x + 9} ${y + 20}V${y + 10}h14M${x + 9} ${y + 15}h11" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  </g>`;

const roundButton = (x, y, symbol) => `${rect(x, y, 40, 40, 20, colors.surface, colors.border)}<g transform="translate(${x + 8} ${y + 8})">${symbol(0, 0)}</g>`;

const chip = (x, y, label, active = false, w = 82, accent = colors.primary) =>
  `${rect(x, y, w, 36, 18, active ? accent : colors.surface, active ? accent : colors.border)}${text(x + w / 2, y + 23, label, 13, 600, active ? "#fff" : colors.text, "middle")}`;

const galleryCard = ({ id, label, title, ink, accent, tagFill, thumbStops, portrait }) => `
  <defs>
    <linearGradient id="${id}-thumb" x1="0" y1="0" x2="167" y2="128" gradientUnits="userSpaceOnUse">
      <stop stop-color="${thumbStops[0]}"/>
      <stop offset="0.52" stop-color="${thumbStops[1]}"/>
      <stop offset="1" stop-color="${thumbStops[2]}"/>
    </linearGradient>
    <linearGradient id="${id}-fade" x1="83.5" y1="58" x2="83.5" y2="128" gradientUnits="userSpaceOnUse">
      <stop stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.28"/>
    </linearGradient>
  </defs>
  ${rect(0, 0, 167, 188, 8, colors.surface, "none", 1, 'filter="url(#shadow)"')}
  ${rect(0, 0, 167, 128, 8, `url(#${id}-thumb)`)}
  <ellipse cx="68" cy="36" rx="34" ry="16" fill="#FFFFFF" fill-opacity="0.46"/>
  <ellipse cx="90" cy="46" rx="26" ry="15" fill="${portrait}" fill-opacity="0.72"/>
  <circle cx="82" cy="43" r="18" fill="${portrait}" fill-opacity="0.62"/>
  <rect x="0" y="58" width="167" height="70" fill="url(#${id}-fade)"/>
  <circle cx="28" cy="28" r="20" fill="${accent}"/>
  <circle cx="28" cy="28" r="19.5" stroke="${ink}" stroke-opacity="0.42"/>
  <g transform="translate(16 16)">${icon.image(0, 0, ink)}</g>
  <circle cx="143" cy="24" r="16" fill="#FFFFFF" fill-opacity="0.84"/>
  <path d="M151.5 21.8c0 4.6-8.5 9.2-8.5 9.2s-8.5-4.6-8.5-9.2A4.5 4.5 0 0 1 143 19a4.5 4.5 0 0 1 8.5 2.8Z" stroke="#17151F" stroke-width="1.8" fill="none"/>
  ${rect(8, 136, label === "Celebrity" ? 74 : 80, 20, 10, tagFill)}
  ${text(16, 151, label, 14, 400, ink)}
  ${text(8, 175, title, 14, 500, colors.text)}
  <circle cx="147" cy="161" r="1.5" fill="${colors.text}"/>
  <circle cx="147" cy="168" r="1.5" fill="${colors.text}"/>
  <circle cx="147" cy="175" r="1.5" fill="${colors.text}"/>
`;

const components = [
  {
    name: "01-app-header",
    width: 390,
    height: 72,
    body: `
      ${rect(0, 0, 390, 72, 0, colors.bg)}
      ${logoMark(24, 20)}
      ${text(64, 42, "FameFlow", 18, 700)}
      ${roundButton(278, 16, () => `<circle cx="12" cy="12" r="5" stroke="${colors.text}" stroke-width="2"/><path d="M12 1v2M12 21v2M1 12h2M21 12h2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M19.8 4.2l-1.4 1.4M5.6 18.4l-1.4 1.4" stroke="${colors.text}" stroke-width="2" stroke-linecap="round"/>`)}
      ${roundButton(326, 16, icon.menu)}
    `,
  },
  {
    name: "02-mode-switch",
    width: 342,
    height: 64,
    body: `
      ${rect(0, 0, 342, 64, 32, colors.surface, "rgba(219,212,250,0.78)", 1, 'filter="url(#shadow)"')}
      ${rect(4, 4, 165, 56, 28, colors.brand, "rgba(45,35,95,0.18)", 2)}
      <circle cx="34" cy="22" r="2" fill="#2D235F" fill-opacity="0.16"/>
      <circle cx="134" cy="42" r="2" fill="#2D235F" fill-opacity="0.12"/>
      <g transform="translate(22 20)">${icon.sparkle(0, 0, "#2D235F")}</g>
      ${text(54, 41, "Celebrity", 24, 600, "#2D235F")}
      <g transform="translate(194 20)">${icon.user(0, 0, "#92929A")}</g>
      ${text(226, 41, "Character", 24, 600, "#92929A")}
    `,
  },
  {
    name: "03-subject-row-empty",
    width: 342,
    height: 86,
    body: `
      ${rect(0, 0, 342, 86, 8, colors.surface, colors.border, 1, 'filter="url(#shadow)"')}
      <g transform="translate(16 23)">
        <circle cx="16" cy="20" r="16" fill="url(#purpleGrad)" stroke="${colors.bg}" stroke-width="2"/>
        <circle cx="32" cy="20" r="16" fill="#F9C7B8" stroke="${colors.bg}" stroke-width="2"/>
        <circle cx="48" cy="20" r="16" fill="url(#greenGrad)" stroke="${colors.bg}" stroke-width="2"/>
        <circle cx="48" cy="17" r="8" fill="#FFFFFF" fill-opacity="0.78"/>
        <path d="M38 33c4-10 16-10 20 0" fill="#FFFFFF" fill-opacity="0.58"/>
      </g>
      ${rect(96, 10, 104, 32, 16, colors.brand, "rgba(45,35,95,0.18)")}
      <circle cx="114" cy="19" r="2" fill="#2D235F" fill-opacity="0.16"/>
      <g transform="translate(104 18)">${icon.sparkle(0, 0, "#2D235F")}</g>
      ${text(128, 31, "Star mode", 14, 400, "#2D235F")}
      ${rect(96, 50, 136, 28, 14, "transparent", "rgba(219,212,250,0.78)")}
      ${text(164, 69, "Choose celebrity", 14, 400, "#2D235F", "middle")}
      <g transform="translate(306 31)">${icon.chevron(0, 0, colors.text)}</g>
    `,
  },
  {
    name: "04-media-tabbar",
    width: 342,
    height: 58,
    body: `
      ${rect(0, 0, 342, 58, 29, colors.surface, colors.border, 1, 'filter="url(#shadow)"')}
      ${rect(5, 5, 108, 48, 24, colors.brandSoft, "rgba(219,212,250,0.58)")}
      ${rect(21, 5, 76, 4, 2, colors.brand)}
      <g transform="translate(27 21)">${icon.image(0, 0, "#2D235F")}</g>${text(51, 36, "Image", 14, 400, "#2D235F")}
      <g transform="translate(140 21)">${icon.video(0, 0, colors.muted)}</g>${text(164, 36, "Video", 14, 400, colors.muted)}
      <g transform="translate(254 21)">${icon.audio(0, 0, colors.muted)}</g>${text(278, 36, "Audio", 14, 400, colors.muted)}
    `,
  },
  {
    name: "05-prompt-composer",
    width: 342,
    height: 363,
    body: `
      ${rect(0, 0, 342, 363, 24, colors.surface, colors.border, 1, 'filter="url(#shadow)"')}
      <g transform="translate(16 16)">
        <g>
          <path d="M21.4 11.6 12.3 20.7a5 5 0 0 1-7.1-7.1l9.2-9.2a3.2 3.2 0 1 1 4.5 4.5l-9.3 9.3a1.5 1.5 0 0 1-2.1-2.1l8.6-8.6" stroke="${colors.muted}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        ${text(40, 31, "Enter a text prompt or", 17, 500, colors.muted)}
        ${text(40, 57, "reference image", 17, 500, colors.muted)}
        <g transform="translate(276 0)">
          <path d="M16 4a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z" stroke="${colors.muted}" stroke-width="1.8"/>
          <path d="M23 12a7 7 0 0 1-14 0M16 19v3" stroke="${colors.muted}" stroke-width="1.8" stroke-linecap="round"/>
        </g>
      </g>
      ${rect(16, 234, 174, 48, 16, colors.brandSoft, "rgba(219,212,250,0.78)", 1, 'filter="url(#shadow)"')}
      <g transform="translate(28 246)"><path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" stroke="${colors.text}" stroke-width="1.8" stroke-linejoin="round"/></g>
      ${text(66, 264, "Enhance prompt", 14, 600, colors.text)}
      ${rect(16, 298, 150, 48, 16, colors.surface, "rgba(219,212,250,0.78)", 1, 'filter="url(#shadow)"')}
      ${text(32, 326, "Model", 14, 400, colors.muted)}
      ${text(104, 326, "Fast", 14, 700, colors.text)}
      <g transform="translate(134 310) rotate(90 12 12)">${icon.chevron(0, 0, colors.text)}</g>
      ${rect(174, 298, 150, 48, 16, colors.surface, "rgba(219,212,250,0.78)", 1, 'filter="url(#shadow)"')}
      ${text(190, 326, "Size", 14, 400, colors.muted)}
      ${text(260, 326, "9:16", 14, 700, colors.text)}
      <g transform="translate(292 310) rotate(90 12 12)">${icon.chevron(0, 0, colors.text)}</g>
    `,
  },
  {
    name: "06-select-controls",
    width: 342,
    height: 64,
    body: `
      ${rect(0, 0, 162, 64, 18, colors.surface, colors.border)}
      ${text(18, 24, "Model", 12, 500, colors.muted)}
      ${text(18, 48, "Fast", 17, 700)}
      <g transform="translate(132 20) rotate(90 12 12)">${icon.chevron(0, 0)}</g>
      ${rect(180, 0, 162, 64, 18, colors.surface, colors.border)}
      ${text(198, 24, "Size", 12, 500, colors.muted)}
      ${text(198, 48, "9:16", 17, 700)}
      <g transform="translate(312 20) rotate(90 12 12)">${icon.chevron(0, 0)}</g>
    `,
  },
  {
    name: "07-primary-buttons",
    width: 342,
    height: 136,
    body: `
      ${rect(0, 0, 342, 48, 16, colors.primary)}
      ${text(171, 31, "Generate", 16, 700, "#FFFFFF", "middle")}
      ${rect(0, 64, 164, 48, 16, colors.surface, colors.border)}
      ${text(82, 95, "Cancel", 15, 700, colors.text, "middle")}
      ${rect(178, 64, 164, 48, 16, colors.character)}
      ${text(260, 95, "Continue", 15, 700, "#0B5B46", "middle")}
    `,
  },
  {
    name: "08-copilot-card",
    width: 172,
    height: 132,
    body: `
      ${rect(0, 0, 172, 132, 20, colors.surface, colors.border)}
      ${rect(16, 16, 42, 42, 14, colors.brand)}
      <g transform="translate(25 25)">${icon.sparkle(0, 0, "#2D235F")}</g>
      ${text(16, 84, "Choose a mode", 16, 700)}
      ${text(16, 108, "Pick star or creator", 13, 500, colors.muted)}
    `,
  },
  {
    name: "09-quick-chips",
    width: 342,
    height: 192,
    body: `
      ${rect(0, 0, 342, 192, 8, colors.surface, colors.border, 1, 'filter="url(#shadow)"')}
      ${text(16, 40, "A few quick questions", 24, 600, colors.text)}
      ${text(16, 91, "Format", 14, 400, colors.text)}
      ${rect(88, 62, 236, 48, 24, colors.surface, "none", 1, 'filter="url(#shadow)"')}
      ${rect(92, 66, 73.33, 40, 20, colors.brand)}
      <circle cx="110" cy="74" r="2" fill="#2D235F" fill-opacity="0.16"/>
      <circle cx="150" cy="94" r="2" fill="#2D235F" fill-opacity="0.12"/>
      ${text(128.5, 91, "Image", 14, 400, "#2D235F", "middle")}
      ${text(206, 91, "Video", 14, 400, colors.text, "middle")}
      ${text(282, 91, "Audio", 14, 400, colors.text, "middle")}
      ${text(16, 155, "Size", 14, 400, colors.text)}
      ${rect(88, 126, 236, 48, 24, colors.surface, "none", 1, 'filter="url(#shadow)"')}
      ${rect(92, 130, 73.33, 40, 20, colors.brand)}
      <circle cx="110" cy="138" r="2" fill="#2D235F" fill-opacity="0.16"/>
      <circle cx="150" cy="158" r="2" fill="#2D235F" fill-opacity="0.12"/>
      ${text(128.5, 155, "9:16", 14, 400, "#2D235F", "middle")}
      ${text(206, 155, "1:1", 14, 400, colors.text, "middle")}
      ${text(282, 155, "16:9", 14, 400, colors.text, "middle")}
    `,
  },
  {
    name: "10-gallery-filters",
    width: 342,
    height: 120,
    body: `
      ${rect(0, 0, 342, 48, 24, colors.surface, colors.border, 1, 'filter="url(#shadow)"')}
      ${rect(4, 4, 80.5, 40, 20, colors.brand)}
      ${text(44.25, 29, "All", 14, 400, "#2D235F", "middle")}
      ${text(128.75, 29, "Celebrity", 14, 400, colors.text, "middle")}
      ${text(213.25, 29, "Character", 14, 400, colors.text, "middle")}
      ${text(297.75, 29, "Favorites", 14, 400, colors.text, "middle")}
      ${rect(0, 64, 167, 56, 28, colors.brandSoft, "rgba(219,212,250,0.76)", 1, 'filter="url(#shadow)"')}
      <g transform="translate(16 80)">${icon.user(0, 0, colors.text)}</g>${text(49, 99, "All subje...", 14, 400)}
      <g transform="translate(127 80) rotate(90 12 12)">${icon.chevron(0, 0, colors.text)}</g>
      ${rect(175, 64, 167, 56, 28, colors.brandSoft, "rgba(219,212,250,0.76)", 1, 'filter="url(#shadow)"')}
      <g transform="translate(191 80)">${icon.grid(0, 0, colors.text)}</g>${text(224, 99, "All media", 14, 400)}
      <g transform="translate(302 80) rotate(90 12 12)">${icon.chevron(0, 0, colors.text)}</g>
    `,
  },
  {
    name: "11-gallery-card-celebrity",
    width: 167,
    height: 188,
    body: galleryCard({
      id: "gallery-celebrity",
      label: "Celebrity",
      title: "Dwayne Johnson",
      ink: "#4D35C7",
      accent: "#E3DDFC",
      tagFill: "#F5F3FE",
      thumbStops: ["#8FC4E8", "#E9C89F", "#496C61"],
      portrait: "#F1C5A6",
    }),
  },
  {
    name: "11-gallery-card-character",
    width: 167,
    height: 188,
    body: galleryCard({
      id: "gallery-character",
      label: "Character",
      title: "Lyria Silverwind",
      ink: "#0B5B46",
      accent: "#B1F2E4",
      tagFill: "#E3FAF5",
      thumbStops: ["#DBEEF5", "#B7C7C2", "#6A7D83"],
      portrait: "#DFF7F0",
    }),
  },
  {
    name: "12-campaign-card",
    width: 342,
    height: 96,
    body: `
      ${rect(0, 0, 342, 96, 20, colors.surface, colors.border)}
      ${rect(16, 16, 64, 64, 16, "url(#greenGrad)")}
      ${text(96, 36, "Summer Launch", 17, 700)}
      ${text(96, 60, "18 assets · Instagram", 13, 500, colors.muted)}
      ${rect(252, 32, 66, 32, 16, colors.character)}
      ${text(285, 53, "Active", 12, 700, "#0B5B46", "middle")}
    `,
  },
  {
    name: "13-field-card",
    width: 342,
    height: 82,
    body: `
      ${rect(0, 0, 342, 82, 18, colors.surface, colors.border)}
      ${text(18, 27, "Campaign name", 13, 600, colors.muted)}
      ${text(18, 57, "Summer Launch", 17, 700)}
    `,
  },
  {
    name: "14-stepper",
    width: 182,
    height: 36,
    body: `
      ${line(28, 18, 154, 18, colors.border, 3)}
      <circle cx="18" cy="18" r="16" fill="${colors.primary}"/>${text(18, 23, "1", 14, 700, "#fff", "middle")}
      <circle cx="91" cy="18" r="16" fill="${colors.surface}" stroke="${colors.border}"/>${text(91, 23, "2", 14, 700, colors.muted, "middle")}
      <circle cx="164" cy="18" r="16" fill="${colors.surface}" stroke="${colors.border}"/>${text(164, 23, "3", 14, 700, colors.muted, "middle")}
    `,
  },
  {
    name: "15-influencer-row",
    width: 342,
    height: 84,
    body: `
      ${rect(0, 0, 342, 84, 20, colors.surface, colors.border)}
      <circle cx="42" cy="42" r="25" fill="url(#purpleGrad)"/>
      ${text(82, 35, "Nigel Green", 16, 700)}
      ${text(82, 58, "Fashion · 91% match", 13, 500, colors.muted)}
      ${rect(260, 26, 54, 32, 16, colors.character)}
      ${text(287, 47, "Add", 13, 700, "#0B5B46", "middle")}
    `,
  },
  {
    name: "16-bottom-nav",
    width: 390,
    height: 88,
    body: `
      ${rect(0, 0, 390, 88, 0, "rgba(250,250,252,0.96)")}
      ${rect(22, 12, 82, 56, 18, colors.brand)}
      <g transform="translate(51 19)">${icon.sparkle(0, 0, "#2D235F")}</g>${text(63, 58, "Create", 11, 700, "#2D235F", "middle")}
      <g transform="translate(137 19)">${icon.image(0, 0, colors.muted)}</g>${text(149, 58, "Gallery", 11, 600, colors.muted, "middle")}
      <g transform="translate(226 19)">${icon.user(0, 0, colors.muted)}</g>${text(238, 58, "Co-Pilot", 11, 600, colors.muted, "middle")}
      <g transform="translate(316 19)">${icon.menu(0, 0, colors.muted)}</g>${text(328, 58, "Menu", 11, 600, colors.muted, "middle")}
    `,
  },
  {
    name: "17-bottom-sheet",
    width: 390,
    height: 288,
    body: `
      ${rect(0, 0, 390, 288, 24, colors.surface, colors.border)}
      ${rect(165, 12, 60, 5, 3, colors.border)}
      ${text(24, 52, "Choose subject", 22, 700)}
      ${rect(24, 76, 342, 64, 18, colors.soft, colors.border)}
      <circle cx="56" cy="108" r="20" fill="${colors.brand}"/>${text(92, 104, "Ava Stone", 16, 700)}${text(92, 124, "Celebrity", 12, 500, colors.muted)}<g transform="translate(330 96)">${icon.check(0, 0)}</g>
      ${rect(24, 152, 342, 64, 18, colors.surface, colors.border)}
      <circle cx="56" cy="184" r="20" fill="${colors.character}"/>${text(92, 180, "Mina", 16, 700)}${text(92, 200, "Character", 12, 500, colors.muted)}
      ${rect(24, 228, 342, 48, 16, colors.primary)}
      ${text(195, 259, "Use selected subject", 15, 700, "#fff", "middle")}
    `,
  },
  {
    name: "18-side-menu",
    width: 318,
    height: 620,
    body: `
      ${rect(0, 0, 318, 620, 0, colors.surface)}
      ${logoMark(24, 24)}${text(64, 46, "FameFlow", 18, 700)}
      ${rect(24, 82, 270, 72, 20, colors.soft, colors.border)}
      ${text(44, 110, "Current project", 12, 600, colors.muted)}${text(44, 136, "TEST", 18, 700)}${text(186, 126, "Switch", 13, 700, colors.primary)}<g transform="translate(260 108)">${icon.chevron(0, 0)}</g>
      ${text(24, 190, "Create", 12, 700, colors.muted)}
      ${rect(24, 204, 270, 52, 16, colors.surface, colors.border)}${text(44, 237, "Co-Pilot", 15, 700)}<g transform="translate(260 218)">${icon.chevron(0,0)}</g>
      ${rect(24, 264, 270, 52, 16, colors.surface, colors.border)}${text(44, 297, "Generate", 15, 700)}<g transform="translate(260 278)">${icon.chevron(0,0)}</g>
      ${rect(24, 324, 270, 52, 16, colors.surface, colors.border)}${text(44, 357, "Gallery", 15, 700)}<g transform="translate(260 338)">${icon.chevron(0,0)}</g>
      ${text(24, 412, "Account", 12, 700, colors.muted)}
      ${text(44, 446, "Olivia Reed", 16, 700)}
      ${rect(24, 466, 270, 64, 18, colors.soft, colors.border)}${text(44, 500, "1,240 credits", 18, 700)}${rect(198, 482, 76, 32, 16, colors.primary)}${text(236, 503, "Add cash", 12, 700, "#fff", "middle")}
      ${rect(24, 542, 270, 52, 16, colors.surface, colors.border)}${text(44, 575, "Settings", 15, 700)}<g transform="translate(260 556)">${icon.chevron(0,0)}</g>
    `,
  },
  {
    name: "19-toast",
    width: 300,
    height: 56,
    body: `
      ${rect(0, 0, 300, 56, 18, "#1E1E24")}
      ${text(150, 35, "Generation started.", 15, 700, "#FFFFFF", "middle")}
    `,
  },
  {
    name: "20-empty-state",
    width: 342,
    height: 260,
    body: `
      ${rect(0, 0, 342, 260, 24, colors.surface, colors.border)}
      <circle cx="171" cy="74" r="42" fill="${colors.soft}"/>
      <g transform="translate(159 62)">${icon.audio(0, 0, colors.primary)}</g>
      ${text(171, 144, "No audio yet", 22, 700, colors.text, "middle")}
      ${text(171, 172, "Create your first generated audio.", 14, 500, colors.muted, "middle")}
      ${rect(54, 196, 234, 48, 16, colors.primary)}
      ${text(171, 227, "Create audio", 15, 700, "#fff", "middle")}
    `,
  },
  {
    name: "21-dialog",
    width: 342,
    height: 238,
    body: `
      ${rect(0, 0, 342, 238, 24, colors.surface, colors.border, 1, 'filter="url(#shadow)"')}
      ${text(24, 42, "Add cash", 22, 700)}
      ${text(24, 70, "Choose amount", 14, 500, colors.muted)}
      ${chip(24, 94, "$25", true, 86)}
      ${chip(128, 94, "$50", false, 86)}
      ${chip(232, 94, "$100", false, 86)}
      ${rect(24, 166, 138, 48, 16, colors.surface, colors.border)}
      ${text(93, 197, "Cancel", 15, 700, colors.text, "middle")}
      ${rect(180, 166, 138, 48, 16, colors.primary)}
      ${text(249, 197, "Continue", 15, 700, "#fff", "middle")}
    `,
  },
  {
    name: "22-offline-card",
    width: 342,
    height: 250,
    body: `
      ${rect(0, 0, 342, 250, 24, colors.surface, colors.border)}
      ${rect(132, 34, 78, 78, 22, colors.soft)}
      ${rect(150, 50, 24, 24, 6, colors.primary)}${rect(168, 68, 24, 24, 6, colors.character)}
      ${text(171, 148, "No internet connection", 21, 700, colors.text, "middle")}
      ${text(171, 176, "Check connection and try again.", 14, 500, colors.muted, "middle")}
      ${rect(54, 198, 234, 48, 16, colors.primary)}
      ${text(171, 229, "Try again", 15, 700, "#fff", "middle")}
    `,
  },
  {
    name: "23-source-menu",
    width: 342,
    height: 238,
    body: `
      ${rect(0, 0, 342, 238, 24, colors.surface, colors.border)}
      ${text(24, 44, "Add reference", 22, 700)}
      ${rect(24, 70, 294, 48, 16, colors.surface, colors.border)}<g transform="translate(42 82)">${icon.image(0, 0, colors.primary)}</g>${text(80, 101, "Media library", 15, 700)}
      ${rect(24, 126, 294, 48, 16, colors.surface, colors.border)}<g transform="translate(42 138)">${icon.video(0, 0, colors.primary)}</g>${text(80, 157, "Take photo/video", 15, 700)}
      ${rect(24, 182, 294, 48, 16, colors.surface, colors.border)}<g transform="translate(42 194)">${icon.plus(0, 0, colors.primary)}</g>${text(80, 213, "Choose file", 15, 700)}
    `,
  },
  {
    name: "24-project-option",
    width: 342,
    height: 68,
    body: `
      ${rect(0, 0, 342, 68, 18, colors.soft, colors.primary, 1.5)}
      ${text(18, 42, "TEST-A", 17, 700)}
      ${rect(198, 18, 76, 32, 16, colors.brand)}
      ${text(236, 39, "Current", 12, 700, "#2D235F", "middle")}
      <circle cx="310" cy="34" r="14" fill="${colors.primary}"/><g transform="translate(298 22)">${icon.check(0, 0, "#fff")}</g>
    `,
  },
];

for (const component of components) {
  writeFileSync(join(outDir, `${component.name}.svg`), svg(component.width, component.height, component.body));
}

const gap = 32;
const labelHeight = 28;
const columns = 3;
const colWidth = 430;
let y = 32;
let x = 32;
let rowHeight = 0;
const sheetParts = [
  rect(0, 0, 1360, 2800, 0, "#F3F1F8"),
  text(32, 58, "FameFlow SVG Component Kit", 30, 800),
  text(32, 88, "Import this file into Figma, then detach/edit each grouped component.", 15, 500, colors.muted),
];
y = 124;

components.forEach((component, index) => {
  if (index % columns === 0 && index !== 0) {
    x = 32;
    y += rowHeight + gap + labelHeight;
    rowHeight = 0;
  }
  const frameH = component.height + labelHeight + 28;
  sheetParts.push(`<g id="${component.name}" transform="translate(${x} ${y})">`);
  sheetParts.push(rect(0, 0, Math.max(component.width + 32, 382), frameH, 18, "#FFFFFF", "#DEDBE8"));
  sheetParts.push(text(16, 24, component.name, 13, 700, colors.muted));
  sheetParts.push(`<g transform="translate(16 ${labelHeight + 16})">${component.body}</g>`);
  sheetParts.push("</g>");
  rowHeight = Math.max(rowHeight, frameH);
  x += colWidth;
});

writeFileSync(join(outDir, "00-fameflow-component-kit.svg"), svg(1360, Math.max(2800, y + rowHeight + 64), sheetParts.join("\n")));

const spec = {
  "01-app-header": {
    notes: ["screen padding 24px", "logo 32px", "actions gap 8px", "round buttons 40px / r20", "bg #FAFAFC"],
    arrows: [
      ["h", 24, 64, 116, "24px"],
      ["h", 278, 318, 116, "40px"],
      ["h", 318, 326, 116, "8px gap"],
    ],
  },
  "02-mode-switch": {
    notes: ["outer r32", "outer stroke 1 rgba lavender 78%", "inner padding 4px", "active 165x56 r28", "active stroke 2 rgba ink 18%", "fill #DBD4FA"],
    arrows: [
      ["h", 0, 342, 92, "342px"],
      ["v", -22, 0, 64, "64px"],
      ["h", 0, 4, 76, "4px"],
      ["h", 4, 169, 82, "165px"],
      ["v", 354, 4, 60, "56px"],
      ["h", 169, 197, 76, "28px gap"],
    ],
  },
  "03-subject-row-empty": {
    notes: ["outer r8", "stroke 1 #E8E6F2", "padding x16", "avatar stack starts 16px", "badge 104x32 r16", "status chip 136x28 r14"],
    arrows: [
      ["h", 0, 342, 116, "342px"],
      ["v", -22, 0, 86, "86px"],
      ["h", 0, 16, 98, "16px"],
      ["h", 16, 96, 104, "80px"],
      ["h", 96, 200, 98, "104px"],
      ["v", 354, 10, 42, "32px"],
    ],
  },
  "04-media-tabbar": {
    notes: ["outer r29", "stroke 1 #E8E6F2", "padding 5px", "active tab 108x48 r24", "top indicator 76x4 r2", "active fill #F6F4FE"],
    arrows: [
      ["h", 0, 342, 86, "342px"],
      ["v", -22, 0, 58, "58px"],
      ["h", 0, 5, 70, "5px"],
      ["h", 5, 113, 76, "108px"],
      ["v", 354, 5, 53, "48px"],
      ["h", 21, 97, 17, "76px"],
    ],
  },
  "05-prompt-composer": {
    notes: ["outer card 342x363 r24", "stroke 1 #E8E6F2", "padding 16px", "prompt row 308x201", "enhance 174x48 r16", "settings gap 8px", "selects 150x48 r16"],
    arrows: [
      ["h", 0, 342, 391, "342px"],
      ["v", -22, 0, 363, "363px"],
      ["h", 0, 16, 375, "16px"],
      ["h", 16, 324, 382, "308px"],
      ["v", 354, 16, 217, "201px"],
      ["v", 366, 217, 234, "17px"],
      ["h", 16, 190, 292, "174px"],
      ["v", 354, 234, 282, "48px"],
      ["v", 366, 282, 298, "16px"],
      ["h", 16, 166, 356, "150px"],
      ["h", 166, 174, 356, "8px"],
      ["h", 174, 324, 356, "150px"],
    ],
  },
  "06-select-controls": {
    notes: ["each select 162x64 r18", "stroke 1 #E8E6F2", "gap 18px", "label x18", "value baseline y48"],
    arrows: [
      ["h", 0, 162, 92, "162px"],
      ["h", 162, 180, 92, "18px gap"],
      ["h", 180, 342, 92, "162px"],
      ["v", -22, 0, 64, "64px"],
      ["h", 0, 18, 76, "18px"],
    ],
  },
  "07-primary-buttons": {
    notes: ["primary 342x48 r16", "fill #8F7CF6", "secondary 164x48 r16", "gap 14px", "mint fill #C6FCE4"],
    arrows: [
      ["h", 0, 342, 164, "342px"],
      ["v", -22, 0, 48, "48px"],
      ["v", 354, 48, 64, "16px gap"],
      ["h", 0, 164, 124, "164px"],
      ["h", 164, 178, 124, "14px gap"],
      ["h", 178, 342, 124, "164px"],
    ],
  },
  "08-copilot-card": {
    notes: ["card 172x132 r20", "stroke 1 #E8E6F2", "padding 16px", "icon tile 42x42 r14", "text y84 / y108"],
    arrows: [
      ["h", 0, 172, 160, "172px"],
      ["v", -22, 0, 132, "132px"],
      ["h", 0, 16, 144, "16px"],
      ["h", 16, 58, 150, "42px"],
      ["v", 184, 16, 58, "42px"],
    ],
  },
  "09-quick-chips": {
    notes: ["quick panel 342x192 r8", "padding 16px", "heading 24/30 semibold", "row 308x48", "label column 64px", "row gap 8px", "options 236x48 r24", "chip 73x40 r20"],
    arrows: [
      ["h", 0, 342, 220, "342px"],
      ["v", -22, 0, 192, "192px"],
      ["h", 0, 16, 204, "16px"],
      ["h", 16, 324, 214, "308px"],
      ["v", 354, 16, 46, "30px"],
      ["v", 366, 46, 62, "16px"],
      ["h", 16, 80, 116, "64px"],
      ["h", 80, 88, 116, "8px"],
      ["h", 88, 324, 118, "236px"],
      ["v", 354, 62, 110, "48px"],
      ["h", 92, 165.33, 106, "73px"],
      ["h", 165.33, 169.33, 106, "4px"],
      ["v", 366, 110, 126, "16px"],
    ],
  },
  "10-gallery-filters": {
    notes: ["mode control 342x48 r24", "mode padding 4px", "4 equal tabs 80.5x40", "active fill #DBD4FA", "row gap 16px", "filter buttons 167x56 r28", "filter gap 8px", "fill #F6F4FE stroke rgba(219,212,250,.76)"],
    arrows: [
      ["h", 0, 342, 144, "342px"],
      ["v", -22, 0, 48, "48px"],
      ["h", 0, 4, 56, "4px"],
      ["h", 4, 84.5, 58, "80.5px"],
      ["h", 84.5, 88.5, 58, "4px"],
      ["v", 354, 48, 64, "16px"],
      ["h", 0, 167, 152, "167px"],
      ["h", 167, 175, 152, "8px"],
      ["v", -22, 64, 120, "56px"],
    ],
  },
  "11-gallery-card-celebrity": {
    notes: ["celebrity card 167x188 r8", "preview 167x128", "body 167x60", "body padding 8px", "media button 40x40", "favorite 32x32", "tag 74x20 r10", "tag fill #F5F3FE ink #4D35C7"],
    arrows: [
      ["h", 0, 167, 216, "167px"],
      ["v", -22, 0, 188, "188px"],
      ["v", 179, 0, 128, "128px"],
      ["v", 191, 128, 188, "60px"],
      ["h", 0, 8, 200, "8px"],
      ["h", 8, 82, 164, "74px"],
      ["h", 8, 131, 188, "123px"],
      ["h", 8, 48, 52, "40px"],
      ["h", 127, 159, 44, "32px"],
    ],
  },
  "11-gallery-card-character": {
    notes: ["character card 167x188 r8", "preview 167x128", "body 167x60", "body padding 8px", "media button 40x40", "favorite 32x32", "tag 80x20 r10", "tag fill #E3FAF5 ink #0B5B46"],
    arrows: [
      ["h", 0, 167, 216, "167px"],
      ["v", -22, 0, 188, "188px"],
      ["v", 179, 0, 128, "128px"],
      ["v", 191, 128, 188, "60px"],
      ["h", 0, 8, 200, "8px"],
      ["h", 8, 88, 164, "80px"],
      ["h", 8, 131, 188, "123px"],
      ["h", 8, 48, 52, "40px"],
      ["h", 127, 159, 44, "32px"],
    ],
  },
  "12-campaign-card": {
    notes: ["card 342x96 r20", "stroke 1 #E8E6F2", "padding 16px", "thumb 64x64 r16", "copy x96", "status 66x32 r16"],
    arrows: [
      ["h", 0, 342, 124, "342px"],
      ["v", -22, 0, 96, "96px"],
      ["h", 0, 16, 108, "16px"],
      ["h", 16, 80, 114, "64px"],
      ["h", 80, 96, 108, "16px gap"],
      ["h", 252, 318, 114, "66px"],
    ],
  },
  "13-field-card": {
    notes: ["field 342x82 r18", "stroke 1 #E8E6F2", "content padding x18", "label y27", "value y57"],
    arrows: [
      ["h", 0, 342, 110, "342px"],
      ["v", -22, 0, 82, "82px"],
      ["h", 0, 18, 94, "18px"],
    ],
  },
  "14-stepper": {
    notes: ["circle r16 / 32px", "connector stroke 3 #E8E6F2", "centers 18 / 91 / 164", "center gap 73px"],
    arrows: [
      ["h", 2, 34, 64, "32px"],
      ["h", 18, 91, 78, "73px"],
      ["h", 91, 164, 78, "73px"],
      ["v", 196, 2, 34, "32px"],
    ],
  },
  "15-influencer-row": {
    notes: ["row 342x84 r20", "padding 16px", "avatar r25 / 50px", "copy x82", "button 54x32 r16"],
    arrows: [
      ["h", 0, 342, 112, "342px"],
      ["v", -22, 0, 84, "84px"],
      ["h", 17, 67, 98, "50px"],
      ["h", 67, 82, 98, "15px gap"],
      ["h", 260, 314, 98, "54px"],
    ],
  },
  "16-bottom-nav": {
    notes: ["bar 390x88", "active item 82x56 r18", "left padding 22px", "nav spacing 36px approx", "bg rgba #FAFAFC 96%"],
    arrows: [
      ["h", 0, 390, 116, "390px"],
      ["v", -22, 0, 88, "88px"],
      ["h", 0, 22, 100, "22px"],
      ["h", 22, 104, 106, "82px"],
      ["v", 402, 12, 68, "56px"],
    ],
  },
  "17-bottom-sheet": {
    notes: ["sheet 390x288 r24", "stroke 1 #E8E6F2", "padding x24", "handle 60x5 r3", "row 342x64 r18", "CTA 342x48 r16"],
    arrows: [
      ["h", 0, 390, 316, "390px"],
      ["v", -22, 0, 288, "288px"],
      ["h", 0, 24, 300, "24px"],
      ["h", 24, 366, 306, "342px"],
      ["v", 402, 76, 140, "64px"],
      ["v", 414, 216, 228, "12px gap"],
    ],
  },
  "18-side-menu": {
    notes: ["panel 318x620", "main padding 24px", "cards width 270px", "menu rows 52px r16", "card gaps 8px / 12px"],
    arrows: [
      ["h", 0, 318, 648, "318px"],
      ["v", -22, 0, 620, "620px"],
      ["h", 0, 24, 632, "24px"],
      ["h", 24, 294, 638, "270px"],
      ["v", 330, 204, 256, "52px"],
    ],
  },
  "19-toast": {
    notes: ["toast 300x56 r18", "fill #1E1E24", "text #FFFFFF", "center aligned"],
    arrows: [
      ["h", 0, 300, 84, "300px"],
      ["v", -22, 0, 56, "56px"],
    ],
  },
  "20-empty-state": {
    notes: ["card 342x260 r24", "stroke 1 #E8E6F2", "orb r42", "CTA 234x48 r16", "CTA x54 y196"],
    arrows: [
      ["h", 0, 342, 288, "342px"],
      ["v", -22, 0, 260, "260px"],
      ["h", 54, 288, 274, "234px"],
      ["v", 354, 196, 244, "48px"],
      ["h", 129, 213, 128, "84px orb"],
    ],
  },
  "21-dialog": {
    notes: ["dialog 342x238 r24", "stroke 1 #E8E6F2", "padding 24px", "chips 86x36 r18", "actions 138x48 r16", "gap 18px"],
    arrows: [
      ["h", 0, 342, 266, "342px"],
      ["v", -22, 0, 238, "238px"],
      ["h", 0, 24, 250, "24px"],
      ["h", 24, 110, 136, "86px"],
      ["h", 162, 180, 226, "18px"],
      ["h", 180, 318, 226, "138px"],
    ],
  },
  "22-offline-card": {
    notes: ["card 342x250 r24", "logo tile 78x78 r22", "cube 24x24 r6", "CTA 234x48 r16", "stroke 1 #E8E6F2"],
    arrows: [
      ["h", 0, 342, 278, "342px"],
      ["v", -22, 0, 250, "250px"],
      ["h", 132, 210, 124, "78px"],
      ["h", 54, 288, 264, "234px"],
      ["v", 354, 198, 246, "48px"],
    ],
  },
  "23-source-menu": {
    notes: ["sheet 342x238 r24", "padding 24px", "options 294x48 r16", "row gap 8px", "stroke 1 #E8E6F2"],
    arrows: [
      ["h", 0, 342, 266, "342px"],
      ["v", -22, 0, 238, "238px"],
      ["h", 0, 24, 250, "24px"],
      ["h", 24, 318, 122, "294px"],
      ["v", 354, 70, 118, "48px"],
      ["v", 366, 118, 126, "8px"],
    ],
  },
  "24-project-option": {
    notes: ["option 342x68 r18", "stroke 1.5 #8F7CF6", "content padding 18px", "pill 76x32 r16", "check circle r14"],
    arrows: [
      ["h", 0, 342, 96, "342px"],
      ["v", -22, 0, 68, "68px"],
      ["h", 0, 18, 82, "18px"],
      ["h", 198, 274, 82, "76px"],
      ["h", 296, 324, 82, "28px"],
    ],
  },
};

const specDefs = `
  <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0 0 10 5 0 10Z" fill="#EF4444"/>
  </marker>
  <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
    <path d="M0 0 10 5 0 10Z" fill="#2563EB"/>
  </marker>
`;

const specText = (x, y, value, size = 12, fill = "#EF4444", anchor = "middle", weight = 800) =>
  text(x, y, value, size, weight, fill, anchor);

const measureLine = (x1, y1, x2, y2, label, color = "#EF4444") => `
  <path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" marker-start="url(#arrow-red)" marker-end="url(#arrow-red)"/>
  ${specText((x1 + x2) / 2, (y1 + y2) / 2 - 6, label, 12, color)}
`;

const extensionLine = (x1, y1, x2, y2, color = "#EF4444") =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="1" stroke-dasharray="4 4" stroke-linecap="round"/>`;

const arrow = (kind, a, b, c, label) => {
  if (kind === "h") {
    return `${extensionLine(a, c - 8, a, c + 8)}${extensionLine(b, c - 8, b, c + 8)}${measureLine(a, c, b, c, label)}`;
  }
  return `${extensionLine(a - 8, b, a + 8, b)}${extensionLine(a - 8, c, a + 8, c)}${measureLine(a, b, a, c, label)}`;
};

const callout = (x1, y1, x2, y2, label) => `
  <path d="M${x1} ${y1}L${x2} ${y2}" stroke="#2563EB" stroke-width="1.5" marker-end="url(#arrow-blue)"/>
  <rect x="${x1 - 6}" y="${y1 - 19}" width="${Math.max(82, label.length * 6.5 + 12)}" height="22" rx="11" fill="#EFF6FF" stroke="#BFDBFE"/>
  ${text(x1, y1 - 4, label, 11, 800, "#2563EB")}
`;

const noteBox = (x, y, notes) => {
  const rows = notes.map((note, index) => `${text(x + 12, y + 26 + index * 18, note, 11, 700, "#374151")}`).join("");
  return `${rect(x, y, 292, 26 + notes.length * 18, 10, "#FFFFFF", "#CBD5E1")}${text(x + 12, y + 18, "Specs", 12, 900, "#111827")}${rows}`;
};

const colorLegend = (x, y) => {
  const entries = [
    ["Surface", colors.surface],
    ["Border", colors.border],
    ["Text", colors.text],
    ["Muted", colors.muted],
    ["Lavender", colors.brand],
    ["Primary button", colors.primary],
    ["Mint", colors.character],
    ["Mint strong", colors.green],
  ];
  return `
    <g transform="translate(${x} ${y})">
      ${rect(0, 0, 418, 188, 16, "#FFFFFF", "#DEDBE8")}
      ${text(18, 30, "Color / stroke legend", 18, 800)}
      ${entries.map((entry, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const px = 18 + col * 200;
        const py = 54 + row * 30;
        return `${rect(px, py, 22, 22, 6, entry[1], "#CBD5E1")}${text(px + 32, py + 16, `${entry[0]} ${entry[1]}`, 11, 700, "#374151")}`;
      }).join("")}
      ${text(18, 172, "Red = spacing/dimensions. Blue = visual style notes.", 12, 700, colors.muted)}
    </g>
  `;
};

const annotatedParts = [
  rect(0, 0, 1480, 5000, 0, "#F8FAFC"),
  text(32, 58, "FameFlow Component Kit - Annotated Spacing Spec", 30, 800),
  text(32, 88, "Import into Figma to inspect arrows, pixel spacing, radii, borders, fills, and key layout values.", 15, 500, colors.muted),
  colorLegend(1010, 24),
];

const annotatedColumns = 2;
const annotatedColWidth = 720;
let annotatedX = 32;
let annotatedY = 236;
let annotatedRowHeight = 0;

components.forEach((component, index) => {
  if (index % annotatedColumns === 0 && index !== 0) {
    annotatedX = 32;
    annotatedY += annotatedRowHeight + 38;
    annotatedRowHeight = 0;
  }

  const cardW = 676;
  const localX = 36;
  const localY = 72;
  const componentSpec = spec[component.name] || { notes: [`component ${component.width}x${component.height}px`], arrows: [] };
  const notesH = 26 + componentSpec.notes.length * 18;
  const cardH = Math.max(component.height + 260, localY + component.height + 76 + notesH + 24, 330);

  annotatedParts.push(`<g id="${component.name}-annotated" transform="translate(${annotatedX} ${annotatedY})">`);
  annotatedParts.push(rect(0, 0, cardW, cardH, 18, "#FFFFFF", "#DEDBE8"));
  annotatedParts.push(text(20, 28, component.name, 15, 900, "#111827"));
  annotatedParts.push(text(20, 50, `Canvas ${component.width} x ${component.height}px`, 12, 700, colors.muted));
  annotatedParts.push(`<g transform="translate(${localX} ${localY})">`);
  annotatedParts.push(rect(-1, -1, component.width + 2, component.height + 2, 0, "transparent", "#EF4444", 1, 'stroke-dasharray="6 4"'));
  annotatedParts.push(component.body);
  annotatedParts.push(arrow("h", 0, component.width, component.height + 28, `${component.width}px`));
  annotatedParts.push(arrow("v", -18, 0, component.height, `${component.height}px`));
  componentSpec.arrows.forEach(([kind, a, b, c, label]) => annotatedParts.push(arrow(kind, a, b, c, label)));
  annotatedParts.push(callout(component.width + 26, 18, component.width - 2, 8, "outer radius / stroke"));
  annotatedParts.push(callout(component.width + 26, 46, Math.max(6, component.width - 18), Math.min(component.height - 6, 28), "fill / color"));
  annotatedParts.push("</g>");
  annotatedParts.push(noteBox(20, localY + component.height + 76, componentSpec.notes));
  annotatedParts.push("</g>");

  annotatedRowHeight = Math.max(annotatedRowHeight, cardH);
  annotatedX += annotatedColWidth;
});

writeFileSync(
  join(outDir, "00-fameflow-component-kit-annotated.svg"),
  svg(1480, Math.max(5000, annotatedY + annotatedRowHeight + 64), annotatedParts.join("\n"), specDefs),
);

console.log(`Exported ${components.length + 2} SVG files to ${outDir}`);
