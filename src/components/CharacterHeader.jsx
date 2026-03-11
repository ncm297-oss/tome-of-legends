import { profBonus, mod, XPByLevel } from "../hooks/useCharacters";
import { CLASSES } from "../data/classes";

export default function CharacterHeader({ activeChar, setModal, deleteCharacter }) {
  const pb = profBonus(activeChar?.level || 1);
  const stats = activeChar?.stats || {};

  const spellcastingClass = CLASSES.find(c => c.name === activeChar?.class);
  const spellcastingAbility = spellcastingClass?.spellcastingAbility;
  const spellSaveDC = spellcastingAbility ? 8 + pb + mod(stats[spellcastingAbility] || 10) : null;
  const spellAttackBonus = spellcastingAbility ? pb + mod(stats[spellcastingAbility] || 10) : null;

  const xpToNext = XPByLevel[(activeChar?.level || 1)] || 999999;
  const xpCurrent = XPByLevel[(activeChar?.level || 1) - 1] || 0;
  const xpPct = Math.min(100, (((activeChar?.xp || 0) - xpCurrent) / (xpToNext - xpCurrent)) * 100);

  if (!activeChar) return null;

  return (
    <div className="char-header">
      <div className="portrait-box" onClick={() => setModal({ type: "portrait" })} title="Click to change portrait">
        {activeChar.portrait ? <img src={activeChar.portrait} alt="portrait" /> : "🧙"}
      </div>
      <div className="char-name-block">
        <div className="char-name" onClick={() => setModal({ type: "editname" })} title="Click to edit">{activeChar.name}</div>
        <div className="char-sub">
          {activeChar.race} · {activeChar.class} {activeChar.subclass ? `(${activeChar.subclass})` : ""} · Level {activeChar.level} · {activeChar.background}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>{activeChar.alignment}</div>
      </div>
      <div className="xp-bar-container" style={{ maxWidth: 180 }}>
        <div className="xp-label">XP: {activeChar.xp?.toLocaleString()} / {xpToNext?.toLocaleString()}</div>
        <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpPct}%` }} /></div>
      </div>
      {spellSaveDC && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)", letterSpacing: 1 }}>SAVE DC</div>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 20, color: "var(--blue-bright)", fontWeight: 700 }}>{spellSaveDC}</div>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)" }}>ATK +{spellAttackBonus}</div>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)", letterSpacing: 1 }}>PROF</div>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 20, color: "var(--gold)", fontWeight: 700 }}>+{pb}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <button className="btn small" onClick={() => setModal({ type: "addxp" })}>+ XP</button>
        <button className="btn small danger" onClick={() => { if (confirm("Delete this character?")) deleteCharacter(activeChar.id); }}>Delete</button>
      </div>
    </div>
  );
}
