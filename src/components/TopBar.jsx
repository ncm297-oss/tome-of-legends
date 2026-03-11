import { useState } from "react";

export default function TopBar({ setShowWizard, setModal }) {
  const [diceResult, setDiceResult] = useState(null);

  const rollDice = (sides) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setDiceResult({ sides, result });
  };

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
        <button className="btn small" onClick={() => setShowWizard(true)}>+ New</button>
        <button className="btn small success" onClick={() => setModal({ type: "levelup" })}>Level Up</button>
      </div>
    </div>
  );
}
