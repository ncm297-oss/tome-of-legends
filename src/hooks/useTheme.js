import { useState, useEffect, useCallback } from "react";
import { generateThemeVars } from "../utils/themeGenerator";

export const THEMES = [
  { id: "parchment", label: "Parchment", swatches: ["#e8d5a3", "#5c3d1e", "#9a7209"] },
  { id: "highvis", label: "High Vis", swatches: ["#1a1a2e", "#ffd700", "#ffffff"] },
  { id: "cherry", label: "Cherry Blossom", swatches: ["#f5dde4", "#4a1a32", "#c4567a"] },
  { id: "steampunk", label: "Steampunk", swatches: ["#1e1610", "#3a2a18", "#cd8032"] },
  { id: "arcane", label: "Arcane Tech", swatches: ["#0d1117", "#1a2332", "#00bcd4"] },
  { id: "infernal", label: "Infernal", swatches: ["#1a0a0a", "#2a0808", "#e65100"] },
  { id: "feywild", label: "Feywild", swatches: ["#dce8d0", "#1a3028", "#7b5ea7"] },
];

const CUSTOM_THEMES_KEY = "dnd_custom_themes";
const THEME_KEY = "dnd_theme";

// Base 7 colors for each built-in theme (used as starting point for custom theme editor)
export const BUILTIN_THEME_COLORS = {
  parchment: { background: "#f5e6c8", text: "#1e1008", accent: "#9a7209", header: "#5c3d1e", red: "#8b1a1a", green: "#2d5a27", blue: "#1a3a5c" },
  highvis:   { background: "#1a1a2e", text: "#ffffff", accent: "#ffd700", header: "#0a0a1a", red: "#ff4444", green: "#44ff44", blue: "#4488ff" },
  cherry:    { background: "#fff0f5", text: "#3d1a2a", accent: "#c4567a", header: "#6b2d4a", red: "#c0392b", green: "#2d6b4f", blue: "#4a6fa5" },
  steampunk: { background: "#2a2018", text: "#e8d0a0", accent: "#cd8032", header: "#3a2a18", red: "#b8442a", green: "#5a8a40", blue: "#4a7a8a" },
  arcane:    { background: "#0d1117", text: "#c9d1d9", accent: "#00bcd4", header: "#1a2332", red: "#f44336", green: "#00e676", blue: "#2196f3" },
  infernal:  { background: "#1a0a0a", text: "#e0c8b8", accent: "#e65100", header: "#2a0808", red: "#d32f2f", green: "#558b2f", blue: "#5c6bc0" },
  feywild:   { background: "#f0f5e8", text: "#1a2e1a", accent: "#7b5ea7", header: "#2d4a3a", red: "#c0392b", green: "#2e8b57", blue: "#4682b4" },
};

function loadCustomThemes() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_THEMES_KEY)) || [];
  } catch {
    return [];
  }
}

// All CSS variable names that custom themes set (for cleanup)
const THEME_VAR_NAMES = [
  "--parchment", "--parchment-light", "--parchment-dark",
  "--ink", "--ink-light",
  "--gold", "--gold-bright",
  "--red", "--red-bright", "--green", "--green-bright", "--blue", "--blue-bright",
  "--panel-bg", "--panel-border", "--panel-shadow",
  "--text-primary", "--text-secondary", "--text-muted", "--ornament",
  "--bar-bg", "--bar-text", "--bar-accent", "--bar-btn-text",
  "--body-bg", "--app-bg", "--modal-bg", "--tooltip-bg", "--input-bg",
  "--panel-header-bg", "--panel-header-hover", "--panel-texture", "--select-option-bg",
];

function clearInlineThemeVars() {
  THEME_VAR_NAMES.forEach(name => document.documentElement.style.removeProperty(name));
}

function applyInlineThemeVars(vars) {
  Object.entries(vars).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value);
  });
}

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "parchment";
    } catch {
      return "parchment";
    }
  });

  const [customThemes, setCustomThemes] = useState(loadCustomThemes);

  // Apply theme to DOM
  useEffect(() => {
    clearInlineThemeVars();

    if (theme.startsWith("custom-")) {
      // Custom theme — apply inline CSS variables
      delete document.documentElement.dataset.theme;
      const ct = customThemes.find(t => t.id === theme);
      if (ct) applyInlineThemeVars(generateThemeVars(ct.colors));
    } else if (theme === "parchment") {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }

    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme, customThemes]);

  const saveCustomTheme = useCallback((themeData) => {
    // themeData: { id?, label, colors }
    const id = themeData.id || `custom-${Date.now()}`;
    const entry = { id, label: themeData.label, colors: themeData.colors };
    setCustomThemes(prev => {
      const existing = prev.findIndex(t => t.id === id);
      const next = existing >= 0
        ? prev.map((t, i) => i === existing ? entry : t)
        : [...prev, entry];
      try { localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    // Apply immediately so there's no race between theme and customThemes state
    clearInlineThemeVars();
    delete document.documentElement.dataset.theme;
    applyInlineThemeVars(generateThemeVars(themeData.colors));
    setTheme(id);
  }, []);

  const deleteCustomTheme = useCallback((id) => {
    setCustomThemes(prev => {
      const next = prev.filter(t => t.id !== id);
      try { localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    setTheme(prev => prev === id ? "parchment" : prev);
  }, []);

  // Live preview — apply vars without saving
  const previewThemeVars = useCallback((colors) => {
    clearInlineThemeVars();
    delete document.documentElement.dataset.theme;
    applyInlineThemeVars(generateThemeVars(colors));
  }, []);

  // Revert preview — re-apply current saved theme
  const revertPreview = useCallback(() => {
    clearInlineThemeVars();
    if (theme.startsWith("custom-")) {
      delete document.documentElement.dataset.theme;
      const ct = customThemes.find(t => t.id === theme);
      if (ct) applyInlineThemeVars(generateThemeVars(ct.colors));
    } else if (theme === "parchment") {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme, customThemes]);

  const getActiveColors = useCallback(() => {
    if (theme.startsWith("custom-")) {
      const ct = customThemes.find(t => t.id === theme);
      return ct?.colors || BUILTIN_THEME_COLORS.parchment;
    }
    return BUILTIN_THEME_COLORS[theme] || BUILTIN_THEME_COLORS.parchment;
  }, [theme, customThemes]);

  return [theme, setTheme, { customThemes, saveCustomTheme, deleteCustomTheme, previewThemeVars, revertPreview, getActiveColors }];
}
