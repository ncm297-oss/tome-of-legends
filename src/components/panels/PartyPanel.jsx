export default function PartyPanel({ characters, activeCharId, setActiveCharId, setShowWizard }) {
  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-header"><span className="ornament">⚔</span> PARTY</div>
      <div className="panel-body">
        {characters.map(c => (
          <div key={c.id} className={`party-char ${c.id === activeCharId ? "active" : ""}`} onClick={() => setActiveCharId(c.id)}>
            <div className="party-portrait">🧙</div>
            <div className="party-info">
              <div className="party-name">{c.name}</div>
              <div className="party-class">{c.race} {c.class} {c.level}</div>
            </div>
            <div className="party-hp">{c.hp.current}/{c.hp.max}</div>
          </div>
        ))}
        <button className="btn small w-full mt-2" onClick={() => setShowWizard(true)}>+ Add Character</button>
      </div>
    </div>
  );
}
