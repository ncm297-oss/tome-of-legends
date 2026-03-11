import { modStr, mod, profBonus } from "../../hooks/useCharacters";
import { SKILLS_LIST } from "../../data/skills";

export default function CombatPanel({ activeChar, updateChar, updateCharDeep, setModal }) {
  const stats = activeChar?.stats || {};
  const pb = profBonus(activeChar?.level || 1);

  const getSkillBonus = (skill) => {
    const base = mod(stats[skill.stat] || 10);
    const isProf = activeChar?.skillProficiencies?.includes(skill.name);
    const isExp = activeChar?.skillExpertise?.includes(skill.name);
    return base + (isExp ? pb * 2 : isProf ? pb : 0);
  };

  const hpPct = activeChar ? Math.max(0, Math.min(100, (activeChar.hp.current / activeChar.hp.max) * 100)) : 0;
  const hpColor = hpPct > 60 ? "var(--green-bright)" : hpPct > 25 ? "var(--gold)" : "var(--red-bright)";

  return (
    <div className="panel">
      <div className="panel-header"><span className="ornament">⚡</span> COMBAT</div>
      <div className="panel-body">
        <div className="combat-grid" style={{ marginBottom: 8 }}>
          {/* HP */}
          <div className="combat-box" style={{ gridColumn: "span 2" }}>
            <div className="combat-label">Hit Points</div>
            <div className="hp-display">
              <input className="combat-input" value={activeChar?.hp.current || 0}
                onChange={e => updateCharDeep("hp.current", parseInt(e.target.value) || 0)} type="number" />
              <span className="hp-sep">/</span>
              <input className="combat-input" value={activeChar?.hp.max || 0}
                onChange={e => updateCharDeep("hp.max", parseInt(e.target.value) || 0)} type="number" />
            </div>
            <div className="hp-bar w-full"><div className="hp-fill" style={{ width: `${hpPct}%`, background: hpColor }} /></div>
          </div>
          {/* Temp HP */}
          <div className="combat-box blue">
            <div className="combat-label">Temp HP</div>
            <input className="combat-input" style={{ fontSize: 16, width: 40 }} value={activeChar?.hp.temp || 0}
              onChange={e => updateCharDeep("hp.temp", parseInt(e.target.value) || 0)} type="number" />
          </div>
          {/* AC */}
          <div className="combat-box blue">
            <div className="combat-label">AC</div>
            <input className="combat-input" style={{ width: 40 }} value={activeChar?.ac || 10}
              onChange={e => updateChar({ ac: parseInt(e.target.value) || 10 })} type="number" />
          </div>
          {/* Initiative */}
          <div className="combat-box green">
            <div className="combat-label">Initiative</div>
            <div className="combat-val">{modStr(stats.dex || 10)}</div>
          </div>
          {/* Speed */}
          <div className="combat-box green">
            <div className="combat-label">Speed</div>
            <input className="combat-input" style={{ width: 50 }} value={activeChar?.speed || 30}
              onChange={e => updateChar({ speed: parseInt(e.target.value) || 30 })} type="number" />
          </div>
          {/* Passive Perception */}
          <div className="combat-box">
            <div className="combat-label">Passive Perc.</div>
            <div className="combat-val small">{10 + getSkillBonus({ name: "Perception", stat: "wis" })}</div>
          </div>
        </div>

        {/* Death Saves */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4, textAlign: "center" }}>DEATH SAVES</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ fontSize: 9, color: "var(--green-bright)", fontFamily: "Cinzel, serif" }}>SUCCESS</div>
              <div className="death-saves">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`save-pip success ${(activeChar?.deathSaves.successes || 0) > i ? "filled" : ""}`}
                    onClick={() => updateCharDeep("deathSaves.successes", (activeChar?.deathSaves.successes || 0) > i ? i : i + 1)} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ fontSize: 9, color: "var(--red-bright)", fontFamily: "Cinzel, serif" }}>FAILURE</div>
              <div className="death-saves">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`save-pip failure ${(activeChar?.deathSaves.failures || 0) > i ? "filled" : ""}`}
                    onClick={() => updateCharDeep("deathSaves.failures", (activeChar?.deathSaves.failures || 0) > i ? i : i + 1)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4 }}>CONDITIONS</div>
          <div className="condition-chips">
            {(activeChar?.conditions || []).map(c => (
              <div key={c} className="condition-chip" onClick={() => updateChar({ conditions: activeChar.conditions.filter(x => x !== c) })} title="Click to remove">{c}</div>
            ))}
            <div className="condition-chip" style={{ cursor: "pointer", borderStyle: "dashed" }} onClick={() => setModal({ type: "addcondition" })}>+ Add</div>
          </div>
        </div>
      </div>
    </div>
  );
}
