import { useState, useEffect } from "react";

export const THEMES = [
  { id: "parchment", label: "Parchment", swatches: ["#e8d5a3", "#5c3d1e", "#9a7209"] },
  { id: "highvis", label: "High Vis", swatches: ["#1a1a2e", "#ffd700", "#ffffff"] },
  { id: "cherry", label: "Cherry Blossom", swatches: ["#f5dde4", "#4a1a32", "#c4567a"] },
  { id: "steampunk", label: "Steampunk", swatches: ["#1e1610", "#3a2a18", "#cd8032"] },
  { id: "arcane", label: "Arcane Tech", swatches: ["#0d1117", "#1a2332", "#00bcd4"] },
  { id: "infernal", label: "Infernal", swatches: ["#1a0a0a", "#2a0808", "#e65100"] },
  { id: "feywild", label: "Feywild", swatches: ["#dce8d0", "#1a3028", "#7b5ea7"] },
];

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("dnd_theme") || "parchment";
    } catch {
      return "parchment";
    }
  });

  useEffect(() => {
    if (theme === "parchment") {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }
    try {
      localStorage.setItem("dnd_theme", theme);
    } catch {}
  }, [theme]);

  return [theme, setTheme];
}
