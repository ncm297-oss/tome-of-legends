import { modStr, profBonus, mod } from "../../hooks/useCharacters";

export default function StatsPanel({ activeChar, updateChar, updateCharDeep, setModal }) {
  const stats = activeChar?.stats || {};
  const pb = profBonus(activeChar?.level || 1);

  return (
    <div className="panel">
      <div className="panel-header"><span className="ornament">⬡</span> ABILITY SCORES</div>
      <div className="panel-body">
        <div className="stat-grid">
          {["str", "dex", "con", "int", "wis", "cha"].map(s => (
            <div key={s} className="stat-tile" onClick={() => setModal({ type: "editstat", stat: s })}>
              <div className="stat-name">{s.toUpperCase()}</div>
              <div className="stat-score">{stats[s] || 10}</div>
              <div className="stat-mod">{modStr(stats[s] || 10)}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <div className="prof-bonus-display">
            <span className="prof-label">PROFICIENCY BONUS</span>
            <span className="prof-val">+{pb}</span>
          </div>
          <div className="saving-throws">
            <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 3 }}>SAVING THROWS</div>
            {["str", "dex", "con", "int", "wis", "cha"].map(s => {
              const isProf = activeChar?.savingThrowProficiencies?.includes(s);
              const val = mod(stats[s] || 10) + (isProf ? pb : 0);
              return (
                <div key={s} className="st-row" onClick={() => {
                  const profs = activeChar.savingThrowProficiencies || [];
                  updateChar({ savingThrowProficiencies: isProf ? profs.filter(p => p !== s) : [...profs, s] });
                }}>
                  <div className={`skill-pip ${isProf ? "proficient" : ""}`} />
                  <span style={{ flex: 1, fontSize: 10 }}>{s.toUpperCase()}</span>
                  <span style={{ fontFamily: "Cinzel, serif", fontSize: 10, color: "var(--gold)" }}>{val >= 0 ? `+${val}` : val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
