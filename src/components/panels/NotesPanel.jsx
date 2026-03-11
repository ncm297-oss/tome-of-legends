export default function NotesPanel({ activeChar, updateCharDeep }) {
  return (
    <div className="panel">
      <div className="panel-header"><span className="ornament">📜</span> NOTES & BACKSTORY</div>
      <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[["personality", "Personality"], ["ideals", "Ideals"], ["bonds", "Bonds"], ["flaws", "Flaws"]].map(([key, label]) => (
          <div key={key}>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 2 }}>{label.toUpperCase()}</div>
            <textarea className="notes-textarea" style={{ minHeight: 28, height: 28 }}
              value={activeChar?.notes?.[key] || ""}
              onChange={e => updateCharDeep(`notes.${key}`, e.target.value)}
              placeholder={`${label}...`} />
          </div>
        ))}
        <div>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 2 }}>BACKSTORY</div>
          <textarea className="notes-textarea" style={{ flex: 1, height: 36 }}
            value={activeChar?.notes?.backstory || ""}
            onChange={e => updateCharDeep("notes.backstory", e.target.value)}
            placeholder="Your character's history..." />
        </div>
      </div>
    </div>
  );
}
