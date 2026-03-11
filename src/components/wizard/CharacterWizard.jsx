import { useState } from "react";
import { modStr } from "../../hooks/useCharacters";
import { RACES } from "../../data/races";
import { CLASSES } from "../../data/classes";
import { BACKGROUNDS } from "../../data/backgrounds";

export default function CharacterWizard({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "", race: "Human", class: "Fighter", background: "Soldier", alignment: "Neutral Good",
    stats: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    gold: 10, equipment: [], scoreMethod: "standard",
  });

  const totalSteps = 5;
  const cls = CLASSES.find(c => c.name === data.class);
  const race = RACES.find(r => r.name === data.race);

  const statKeys = ["str", "dex", "con", "int", "wis", "cha"];

  const pointBuyCost = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  const pointsUsed = statKeys.reduce((s, k) => s + (pointBuyCost[data.stats[k]] || 0), 0);
  const pointsTotal = 27;

  const raceBonus = (stat) => race?.asi?.[stat] || 0;
  const mod = (score) => Math.floor((score - 10) / 2);

  const Step1 = () => (
    <div>
      <div className="modal-section">
        <label className="modal-label">Character Name</label>
        <input className="form-input" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Enter your name..." autoFocus />
      </div>
      <div className="modal-section">
        <label className="modal-label">Alignment</label>
        <select className="form-select" value={data.alignment} onChange={e => setData({ ...data, alignment: e.target.value })}>
          {["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"].map(a => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div className="modal-section">
        <label className="modal-label">Background</label>
        <select className="form-select" value={data.background} onChange={e => setData({ ...data, background: e.target.value })}>
          {BACKGROUNDS.map(b => <option key={b.name}>{b.name}</option>)}
        </select>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
          {BACKGROUNDS.find(b => b.name === data.background)?.skills.join(", ")}
        </div>
      </div>
      <div className="modal-section">
        <label className="modal-label">Race</label>
        <div className="race-grid">
          {RACES.map(r => (
            <div key={r.name} className={`race-option ${data.race === r.name ? "selected" : ""}`} onClick={() => setData({ ...data, race: r.name })}>
              <div className="race-option-name">{r.name}</div>
              <div className="race-option-bonus">
                {Object.entries(r.asi).map(([s, v]) => `+${v} ${s.toUpperCase()}`).join(", ") || "Custom bonuses"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div>
      <label className="modal-label">Choose Your Class</label>
      <div className="class-grid">
        {CLASSES.map(c => (
          <div key={c.name} className={`class-option ${data.class === c.name ? "selected" : ""}`} onClick={() => setData({ ...data, class: c.name })}>
            <div className="class-option-name">{c.name}</div>
            <div className="class-option-meta">d{c.hitDie} · {c.spellcaster ? "Spellcaster" : "Martial"}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>{c.primaryStat.toUpperCase()} primary</div>
          </div>
        ))}
      </div>
      {cls && (
        <div style={{ marginTop: 12, padding: 10, border: "1px solid rgba(212,160,23,0.2)", borderRadius: 3, background: "rgba(212,160,23,0.05)" }}>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 11, color: "var(--gold)", marginBottom: 4 }}>{cls.name} Details</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Hit Die: d{cls.hitDie} · Saves: {cls.savingThrows.join(", ").toUpperCase()} · {cls.spellcaster ? `Spellcasting: ${cls.spellcastingAbility?.toUpperCase()}` : "Non-spellcaster"}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Level 1 Features: {cls.features?.[1]?.join(", ")}</div>
        </div>
      )}
    </div>
  );

  const Step3 = () => (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["standard", "pointbuy", "manual"].map(m => (
          <button key={m} className={`btn ${data.scoreMethod === m ? "success" : ""}`} style={{ flex: 1 }} onClick={() => {
            if (m === "standard") setData({ ...data, scoreMethod: m, stats: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 } });
            else if (m === "pointbuy") setData({ ...data, scoreMethod: m, stats: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 } });
            else setData({ ...data, scoreMethod: m });
          }}>
            {m === "standard" ? "Standard Array" : m === "pointbuy" ? "Point Buy" : "Manual"}
          </button>
        ))}
      </div>
      {data.scoreMethod === "pointbuy" && (
        <div style={{ textAlign: "center", marginBottom: 8, fontFamily: "Cinzel, serif", fontSize: 12, color: pointsUsed > pointsTotal ? "var(--red-bright)" : "var(--gold)" }}>
          Points: {pointsUsed} / {pointsTotal}
        </div>
      )}
      <div className="stat-entry-grid">
        {statKeys.map(k => (
          <div key={k} className="stat-entry-box">
            <div className="stat-entry-label">{k.toUpperCase()}</div>
            <input className="form-input" type="number" min={3} max={20}
              value={data.stats[k]}
              onChange={e => setData({ ...data, stats: { ...data.stats, [k]: parseInt(e.target.value) || 8 } })}
              style={{ textAlign: "center", padding: "6px 2px" }}
            />
            <div style={{ fontSize: 10, color: "var(--gold)", textAlign: "center", marginTop: 2 }}>
              {raceBonus(k) > 0 && <span style={{ color: "var(--green-bright)" }}>+{raceBonus(k)} </span>}
              = {data.stats[k] + raceBonus(k)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>{modStr(data.stats[k] + raceBonus(k))}</div>
          </div>
        ))}
      </div>
      {data.scoreMethod === "standard" && (
        <div style={{ marginTop: 8, fontSize: 10, color: "var(--text-muted)", textAlign: "center" }}>Standard Array: 15, 14, 13, 12, 10, 8 — assign as desired</div>
      )}
    </div>
  );

  const Step4 = () => (
    <div>
      <label className="modal-label">Starting Gold</label>
      <input className="form-input" type="number" value={data.gold} onChange={e => setData({ ...data, gold: parseInt(e.target.value) || 0 })} />
      <div style={{ marginTop: 12 }}>
        <label className="modal-label">Starting Equipment (optional)</label>
        {(data.equipment || []).map((item, i) => (
          <div key={i} className="inventory-item">
            <span className="item-name">{item.name}</span>
            <span className="item-del" onClick={() => setData({ ...data, equipment: data.equipment.filter((_, j) => j !== i) })}>×</span>
          </div>
        ))}
        <button className="btn small mt-1" onClick={() => {
          const name = prompt("Item name:");
          if (name) setData({ ...data, equipment: [...(data.equipment || []), { name, qty: 1, weight: 0, description: "" }] });
        }}>+ Add Item</button>
      </div>
    </div>
  );

  const Step5 = () => {
    const cls2 = CLASSES.find(c => c.name === data.class);
    const race2 = RACES.find(r => r.name === data.race);
    const finalStats = {};
    statKeys.forEach(k => { finalStats[k] = data.stats[k] + (race2?.asi?.[k] || 0); });
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 22, color: "var(--gold-bright)", marginBottom: 4 }}>{data.name || "Unnamed Adventurer"}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{data.race} {data.class} · {data.background} · {data.alignment}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 6, marginBottom: 12 }}>
          {statKeys.map(k => (
            <div key={k} className="stat-tile">
              <div className="stat-name">{k.toUpperCase()}</div>
              <div className="stat-score">{finalStats[k]}</div>
              <div className="stat-mod">{modStr(finalStats[k])}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          HP: {cls2?.hitDie + mod(finalStats.con)} · AC: 10 · Hit Die: d{cls2?.hitDie} · Starting Gold: {data.gold}gp
        </div>
        {cls2?.spellcaster && <div style={{ fontSize: 12, color: "var(--blue-bright)", marginTop: 4 }}>Spell Save DC: {8 + 2 + mod(finalStats[cls2.spellcastingAbility])} · Spell Attack: +{2 + mod(finalStats[cls2.spellcastingAbility])}</div>}
      </div>
    );
  };

  const steps = [Step1, Step2, Step3, Step4, Step5];
  const StepComponent = steps[step - 1];
  const stepLabels = ["Identity", "Class", "Abilities", "Equipment", "Review"];

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 700 }}>
        <div className="modal-title">⚔ CHARACTER CREATION ⚔</div>
        <div className="wizard-steps">
          {Array(totalSteps).fill(0).map((_, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div className={`wizard-step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 8, fontFamily: "Cinzel, serif", color: step === i + 1 ? "var(--gold)" : "var(--text-muted)", letterSpacing: 0.5 }}>{stepLabels[i]}</div>
            </div>
          ))}
        </div>
        <div style={{ minHeight: 300, maxHeight: "60vh", overflowY: "auto", marginBottom: 16 }}>
          <StepComponent />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 1 && <button className="btn" onClick={() => setStep(s => s - 1)}>← Back</button>}
            <button className="btn danger" onClick={onClose}>Cancel</button>
          </div>
          {step < totalSteps
            ? <button className="btn success" onClick={() => setStep(s => s + 1)}>Next →</button>
            : <button className="btn success" style={{ fontSize: 11 }} onClick={() => { onCreate(data); onClose(); }}>✦ Begin Your Legend ✦</button>
          }
        </div>
      </div>
    </div>
  );
}
