import { useState, useEffect } from "react";
import CollapsiblePanel from "../CollapsiblePanel";

// Buffered textarea — uses local state while focused, syncs on blur
function BufferedTextarea({ value, onChange, className, style, placeholder }) {
  const [localVal, setLocalVal] = useState(value || "");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setLocalVal(value || "");
  }, [value, focused]);

  return (
    <textarea
      className={className}
      style={style}
      placeholder={placeholder}
      value={focused ? localVal : (value || "")}
      onFocus={() => { setFocused(true); setLocalVal(value || ""); }}
      onBlur={() => { setFocused(false); onChange(localVal); }}
      onChange={e => {
        setLocalVal(e.target.value);
        onChange(e.target.value);
      }}
    />
  );
}

export default function NotesPanel({ activeChar, updateCharDeep, collapsed, onToggle }) {
  // Journal pages stored in activeChar.notes.pages: [{ name, content }]
  // Character tab is permanent (personality/ideals/bonds/flaws)
  const pages = activeChar?.notes?.pages || [];
  const [activeTab, setActiveTab] = useState("character");
  const [showNewPage, setShowNewPage] = useState(false);
  const [newPageName, setNewPageName] = useState("");

  const addPage = () => {
    if (!newPageName.trim()) return;
    const updated = [...pages, { name: newPageName.trim(), content: "" }];
    updateCharDeep("notes.pages", updated);
    setActiveTab(updated.length - 1);
    setNewPageName("");
    setShowNewPage(false);
  };

  const updatePageContent = (idx, content) => {
    const updated = [...pages];
    updated[idx] = { ...updated[idx], content };
    updateCharDeep("notes.pages", updated);
  };

  const deletePage = (idx) => {
    const updated = pages.filter((_, i) => i !== idx);
    updateCharDeep("notes.pages", updated);
    setActiveTab("character");
  };

  return (
    <CollapsiblePanel title="SESSION JOURNAL" ornament="📜" collapsed={collapsed} onToggle={onToggle}>
      <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div className="journal-sidebar">
          <div className={`journal-tab ${activeTab === "character" ? "active" : ""}`}
            onClick={() => setActiveTab("character")}>Character</div>
          {pages.map((p, i) => (
            <div key={i} className={`journal-tab ${activeTab === i ? "active" : ""}`}
              onClick={() => setActiveTab(i)}>
              {p.name}
              <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.5, cursor: "pointer" }}
                onClick={e => { e.stopPropagation(); deletePage(i); }}>×</span>
            </div>
          ))}
          {showNewPage ? (
            <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
              <input className="form-input" style={{ width: 80, padding: "2px 4px", fontSize: 10 }}
                value={newPageName} onChange={e => setNewPageName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addPage()}
                placeholder="Page name..." autoFocus />
              <button className="btn small" onClick={addPage}>✓</button>
              <button className="btn small" onClick={() => setShowNewPage(false)}>×</button>
            </div>
          ) : (
            <div className="journal-tab add-tab" onClick={() => setShowNewPage(true)}>+ New</div>
          )}
        </div>

        {activeTab === "character" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {[["personality", "Personality"], ["ideals", "Ideals"], ["bonds", "Bonds"], ["flaws", "Flaws"]].map(([key, label]) => (
              <div key={key}>
                <div style={{ fontFamily: "Cinzel, serif", fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 2 }}>{label.toUpperCase()}</div>
                <BufferedTextarea className="notes-textarea" style={{ minHeight: 28, height: 28 }}
                  value={activeChar?.notes?.[key] || ""}
                  onChange={v => updateCharDeep(`notes.${key}`, v)}
                  placeholder={`${label}...`} />
              </div>
            ))}
          </div>
        )}

        {typeof activeTab === "number" && pages[activeTab] && (
          <BufferedTextarea className="notes-textarea" style={{ flex: 1, minHeight: 100 }}
            value={pages[activeTab].content}
            onChange={v => updatePageContent(activeTab, v)}
            placeholder="Write your notes here..." />
        )}
      </div>
    </CollapsiblePanel>
  );
}
