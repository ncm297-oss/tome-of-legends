import { profBonus, mod, XPByLevel } from "../hooks/useCharacters";
import { CLASSES } from "../data/classes";

export default function CharacterHeader({ activeChar, updateChar, setModal, deleteCharacter }) {
  const pb = profBonus(activeChar?.level || 1);
  const stats = activeChar?.stats || {};

  const spellcastingClass = CLASSES.find(c => c.name === activeChar?.class);
  const spellcastingAbility = spellcastingClass?.spellcastingAbility;
  const spellSaveDC = spellcastingAbility ? 8 + pb + mod(stats[spellcastingAbility] || 10) : null;
  const spellAttackBonus = spellcastingAbility ? pb + mod(stats[spellcastingAbility] || 10) : null;

  const lvl = activeChar?.level || 1;
  const xpNeeded = (XPByLevel[lvl] || 0) - (XPByLevel[lvl - 1] || 0);
  const xpPct = xpNeeded > 0 ? Math.min(100, ((activeChar?.xp || 0) / xpNeeded) * 100) : 0;

  if (!activeChar) return null;

  return (
    <div className="char-header">
      <div className="portrait-box" onClick={() => setModal({ type: "portrait" })} title="Click to change portrait">
        {activeChar.portrait ? <img src={activeChar.portrait} alt="portrait" /> : "🧙"}
      </div>
      <div className="char-name-block">
        <div className="char-name" onClick={() => setModal({ type: "editname" })} title="Click to edit">{activeChar.name}</div>
        <div className="char-sub">
          <span className="char-info-link" onClick={() => setModal({ type: "inforace" })}>{activeChar.race}</span>
          {" · "}
          <span className="char-info-link" onClick={() => setModal({ type: "infoclass" })}>{activeChar.class}</span>
          {activeChar.subclass ? <>{" ("}<span className="char-info-link" onClick={() => setModal({ type: "infosubclass" })}>{activeChar.subclass}</span>{")"}</> : ""}
          {" · Level " + activeChar.level + " · "}
          <span className="char-info-link" onClick={() => setModal({ type: "infobackground" })}>{activeChar.background}</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>{activeChar.alignment}</div>
      </div>
      <div className="char-header-actions">
        <button className="btn small" onClick={() => setModal({ type: "addxp" })}>+ XP</button>
        <button className="btn small danger" onClick={() => { if (confirm("Delete this character?")) deleteCharacter(activeChar.id); }}>Delete</button>
      </div>
      <div className="char-header-row2">
        <div className="xp-bar-container" style={{ maxWidth: 180 }}>
          <div className="xp-label">XP: {(activeChar.xp || 0).toLocaleString()} / {xpNeeded.toLocaleString()}</div>
          <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpPct}%` }} /></div>
        </div>
        <div className="char-header-stats">
          {spellSaveDC && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "rgba(232,213,163,0.6)", letterSpacing: 1 }}>SAVE DC</div>
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 20, color: "var(--blue-bright)", fontWeight: 700 }}>{spellSaveDC}</div>
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "rgba(232,213,163,0.6)" }}>ATK +{spellAttackBonus}</div>
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "rgba(232,213,163,0.6)", letterSpacing: 1 }}>PROF</div>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: 20, color: "var(--gold-bright)", fontWeight: 700 }}>+{pb}</div>
            {spellSaveDC && <div style={{ fontSize: 8, visibility: "hidden" }}>&nbsp;</div>}
          </div>
          <div style={{ textAlign: "center", cursor: "pointer", userSelect: "none" }}
            onClick={() => updateChar({ inspiration: !activeChar.inspiration })}
            title={activeChar.inspiration ? "Click to remove Inspiration" : "Click to grant Inspiration"}>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "rgba(232,213,163,0.6)", letterSpacing: 1 }}>INSPIRATION</div>
            <div style={{ fontSize: 22, filter: activeChar.inspiration ? "none" : "opacity(0.45)", color: activeChar.inspiration ? undefined : "#e8d5a3", transition: "all 0.2s" }}>
              {activeChar.inspiration ? "⭐" : "☆"}
            </div>
            {spellSaveDC && <div style={{ fontSize: 8, visibility: "hidden" }}>&nbsp;</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
