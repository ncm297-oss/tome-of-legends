// Color math utilities — no external deps

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function lighten(hex, amount) {
  const rgb = hexToRgb(hex);
  return rgbToHex(rgb.map(v => v + (255 - v) * amount));
}

function darken(hex, amount) {
  const rgb = hexToRgb(hex);
  return rgbToHex(rgb.map(v => v * (1 - amount)));
}

function mix(hex1, hex2, weight = 0.5) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  return rgbToHex(a.map((v, i) => v * weight + b[i] * (1 - weight)));
}

function rgba(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isDark(hex) {
  return luminance(hex) < 0.4;
}

export function generateThemeVars({ background, text, accent, header, red, green, blue }) {
  const dark = isDark(background);
  const panelAlpha = dark ? 0.95 : 0.92;
  const inputAlpha = dark ? 0.08 : 0.5;

  const parchmentLight = lighten(background, 0.1);
  const parchmentDark = darken(background, 0.1);
  const inkLight = mix(text, background, 0.8);
  const textMuted = mix(text, background, 0.5);
  const accentBright = lighten(accent, 0.15);
  const redBright = lighten(red, 0.15);
  const greenBright = lighten(green, 0.15);
  const blueBright = lighten(blue, 0.15);

  // Header bar uses the user-picked header color directly
  const barTop = header || (dark ? darken(background, 0.3) : darken(mix(accent, background, 0.6), 0.5));
  const barBottom = darken(barTop, 0.3);
  // Bar text needs to be readable on the dark header
  const headerDark = isDark(barTop);
  const barBtnText = headerDark ? lighten(mix(accent, barTop, 0.3), 0.5) : text;

  return {
    "--parchment": background,
    "--parchment-light": parchmentLight,
    "--parchment-dark": parchmentDark,
    "--ink": text,
    "--ink-light": inkLight,
    "--gold": accent,
    "--gold-bright": accentBright,
    "--red": red,
    "--red-bright": redBright,
    "--green": green,
    "--green-bright": greenBright,
    "--blue": blue,
    "--blue-bright": blueBright,
    "--panel-bg": rgba(dark ? parchmentLight : background, panelAlpha),
    "--panel-border": rgba(accent, 0.35),
    "--panel-shadow": `0 2px 10px ${rgba(accent, 0.1)}, inset 0 1px 0 ${rgba(dark ? accent : "#ffffff", 0.05)}`,
    "--text-primary": text,
    "--text-secondary": inkLight,
    "--text-muted": textMuted,
    "--ornament": accent,
    "--bar-bg": `linear-gradient(180deg, ${barTop} 0%, ${barBottom} 100%)`,
    "--bar-text": accentBright,
    "--bar-accent": rgba(accentBright, 0.4),
    "--bar-btn-text": barBtnText,
    "--body-bg": parchmentDark,
    "--app-bg": `radial-gradient(ellipse at 30% 30%, ${rgba(accent, 0.06)} 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, ${rgba(blue, 0.04)} 0%, transparent 50%), ${parchmentDark}`,
    "--modal-bg": `linear-gradient(180deg, ${dark ? parchmentLight : background} 0%, ${dark ? background : parchmentDark} 100%)`,
    "--tooltip-bg": `linear-gradient(180deg, ${dark ? parchmentLight : background}, ${dark ? background : parchmentDark})`,
    "--input-bg": rgba(dark ? "#ffffff" : "#000000", inputAlpha),
    "--panel-header-bg": `linear-gradient(180deg, ${rgba(accent, 0.12)} 0%, ${rgba(accent, 0.04)} 100%)`,
    "--panel-header-hover": `linear-gradient(180deg, ${rgba(accent, 0.22)} 0%, ${rgba(accent, 0.08)} 100%)`,
    "--panel-texture": "none",
    "--select-option-bg": dark ? parchmentLight : background,
  };
}
