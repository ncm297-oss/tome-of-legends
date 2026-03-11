import { useState, useRef, useEffect } from "react";

export default function TopBar({ setShowWizard, setModal, characters, activeCharId, setActiveCharId }) {
  const [diceResult, setDiceResult] = useState(null);
  const [showParty, setShowParty] = useState(false);
  const partyRef = useRef(null);

  const rollDice = (sides) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setDiceResult({ sides, result });
  };

  // Close party dropdown on click outside
  useEffect(() => {
    if (!showParty) return;
    const handler = (e) => {
      if (partyRef.current && !partyRef.current.contains(e.target)) setShowParty(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showParty]);

  return (
    <div className="top-bar">
      <div className="top-bar-title">⚔ TOME OF LEGENDS ⚔</div>
      <div className="top-bar-right">
        {/* DICE ROLLER INLINE */}
        <div className="dice-roller" style={{ gap: 3 }}>
          {[4, 6, 8, 10, 12, 20, 100].map(d => (
            <button key={d} className="dice-btn" style={{ width: 30, height: 30, fontSize: 8 }} onClick={() => rollDice(d)}>
              d{d}
            </button>
          ))}
        </div>
        {diceResult && (
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 18, fontWeight: 700, color: "var(--gold-bright)", textShadow: "0 0 10px rgba(240,192,64,0.6)", minWidth: 48, textAlign: "center" }}>
            {diceResult.result}<span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 2 }}>d{diceResult.sides}</span>
          </div>
        )}
        <div style={{ width: 1, height: 24, background: "rgba(212,160,23,0.3)" }} />
        {/* PARTY DROPDOWN */}
        <div ref={partyRef} style={{ position: "relative" }}>
          <button className="btn small" onClick={() => setShowParty(p => !p)} title="Switch Character">
            ⚔ {characters?.length || 0}
          </button>
          {showParty && (
            <div className="party-dropdown">
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 9, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 6 }}>PARTY</div>
              {(characters || []).map(c => (
                <div key={c.id}
                  className={`party-dropdown-item ${c.id === activeCharId ? "active" : ""}`}
                  onClick={() => { setActiveCharId(c.id); setShowParty(false); }}>
                  <div className="party-dropdown-portrait">{c.portrait ? <img src={c.portrait} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} /> : "🧙"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="party-dropdown-name">{c.name}</div>
                    <div className="party-dropdown-class">{c.race} {c.class} {c.level}</div>
                  </div>
                  <div className="party-dropdown-hp">{c.hp.current}/{c.hp.max}</div>
                </div>
              ))}
              <button className="btn small w-full" style={{ marginTop: 6, fontSize: 9 }}
                onClick={() => { setShowWizard(true); setShowParty(false); }}>+ Add Character</button>
            </div>
          )}
        </div>
        <button className="btn small" onClick={() => setShowWizard(true)}>+ New</button>
        <button className="btn small success" onClick={() => setModal({ type: "levelup" })}>Level Up</button>
      </div>
    </div>
  );
}
