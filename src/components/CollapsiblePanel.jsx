import { useState } from "react";

export default function CollapsiblePanel({ title, ornament, headerRight, children, collapsed, onToggle, className = "", style = {} }) {
  // If no external control, use internal state
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed;
  const toggle = onToggle || (() => setInternalCollapsed(c => !c));

  if (isCollapsed) {
    return (
      <div className={`panel panel-collapsed-h ${className}`} onClick={toggle}
        style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 0", flex: 1, ...style }}>
        <div style={{ fontSize: 16 }}>{ornament}</div>
        <div style={{
          fontSize: 8, color: "var(--text-secondary)", fontFamily: "Cinzel, serif",
          letterSpacing: 0.5, marginTop: 4, writingMode: "vertical-rl", textOrientation: "mixed"
        }}>{title}</div>
      </div>
    );
  }

  return (
    <div className={`panel ${className}`} style={style}>
      <div className="panel-header collapsible" onClick={toggle}>
        <span className="ornament">{ornament}</span> {title}
        {headerRight && <span className="panel-header-right">{headerRight}</span>}
        <span className="panel-collapse-icon">◀</span>
      </div>
      {children}
    </div>
  );
}
