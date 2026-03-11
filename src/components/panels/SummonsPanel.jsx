export default function SummonsPanel({ activeChar, updateChar, setModal }) {
  return (
    <div className="panel">
      <div className="panel-header"><span className="ornament">🐾</span> SUMMONS</div>
      <div className="panel-body">
        {(activeChar?.summons || []).length === 0 && <div className="empty-state">No active summons.<br />Add from common summons or create custom.</div>}
        {(activeChar?.summons || []).map((s, si) => (
          <div key={si} className="summon-card">
            <div className="summon-header">
              <div className="summon-name">{s.name}</div>
              <div style={{ display: "flex", gap: 4 }}>
                {s.linkedSpell && <span className="tag tag-blue">{s.linkedSpell}</span>}
                <span style={{ color: "var(--red-bright)", cursor: "pointer", fontSize: 14 }}
                  onClick={() => updateChar({ summons: activeChar.summons.filter((_, j) => j !== si) })}>×</span>
              </div>
            </div>
            <div className="summon-body">
              <div className="summon-hp-row">
                <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "Cinzel, serif" }}>HP</span>
                <input style={{ width: 35, background: "transparent", border: "none", borderBottom: "1px solid var(--red-bright)", color: "#e88", fontFamily: "Cinzel, serif", fontSize: 13, textAlign: "center", outline: "none" }}
                  type="number" value={s.hp}
                  onChange={e => {
                    const summons = [...activeChar.summons];
                    summons[si] = { ...s, hp: parseInt(e.target.value) || 0 };
                    updateChar({ summons });
                  }} />
                <span style={{ fontSize: 9, color: "var(--text-muted)" }}>/ {s.maxHp}</span>
                <div style={{ flex: 1 }}>
                  <div className="hp-bar"><div className="hp-fill" style={{ width: `${Math.max(0, Math.min(100, (s.hp / s.maxHp) * 100))}%`, background: "var(--red-bright)" }} /></div>
                </div>
              </div>
              <div className="summon-stats">
                <span>AC <span className="summon-stat-val">{s.ac}</span></span>
                <span>SPD <span className="summon-stat-val">{s.speed}</span></span>
                <span>CR <span className="summon-stat-val">{s.cr}</span></span>
              </div>
              <div className="summon-actions">
                {(s.actions || []).map((a, ai) => (
                  <div key={ai} className={`summon-action ${a.used ? "action-used" : ""}`}
                    onClick={() => {
                      const summons = [...activeChar.summons];
                      const acts = [...s.actions];
                      acts[ai] = { ...a, used: !a.used };
                      summons[si] = { ...s, actions: acts };
                      updateChar({ summons });
                    }}>
                    <div className={`action-pip ${a.used ? "used" : ""}`} />
                    <span style={{ color: "var(--text-secondary)", fontSize: 10 }}>{a.name}</span>
                  </div>
                ))}
              </div>
              <button className="btn small mt-1" style={{ fontSize: 7 }} onClick={() => {
                const summons = [...activeChar.summons];
                summons[si] = { ...s, actions: s.actions.map(a => ({ ...a, used: false })) };
                updateChar({ summons });
              }}>Reset Actions</button>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          <button className="btn small flex-1" onClick={() => setModal({ type: "addsummon" })}>+ Common</button>
          <button className="btn small flex-1" onClick={() => setModal({ type: "addcustomsummon" })}>+ Custom</button>
        </div>
      </div>
    </div>
  );
}
