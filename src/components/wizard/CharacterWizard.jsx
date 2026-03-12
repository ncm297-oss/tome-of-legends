import { useState } from "react";
import { modStr } from "../../hooks/useCharacters";
import { RACES } from "../../data/races";
import { CLASSES } from "../../data/classes";
import { BACKGROUNDS } from "../../data/backgrounds";
import { SKILLS_LIST } from "../../data/skills";
import { STARTING_EQUIPMENT } from "../../data/items";

const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];

const ALIGNMENT_DESCRIPTIONS = {
  "Lawful Good": "A lawful good character acts with compassion and honor, combining a commitment to oppose evil with the discipline to fight for order. They believe that a well-ordered society protects the common good.",
  "Neutral Good": "A neutral good character does the best they can to help others according to their needs. They work with authority when it helps, but feel no compulsion to follow rules for their own sake.",
  "Chaotic Good": "A chaotic good character acts as their conscience directs, with little regard for what others expect. They value freedom, kindness, and benevolence above tradition and law.",
  "Lawful Neutral": "A lawful neutral character acts in accordance with law, tradition, or personal codes. Order and organization matter more than moral considerations of good or evil.",
  "True Neutral": "A true neutral character does what seems like a good idea at the time. They prefer to maintain balance, avoiding extremes of good, evil, law, and chaos.",
  "Chaotic Neutral": "A chaotic neutral character follows their whims above all else. They are individualists who value their own liberty and freedom, avoiding authority and restriction.",
  "Lawful Evil": "A lawful evil character takes what they want within the limits of a code of tradition or loyalty. They care about order but use it to advance their own interests ruthlessly.",
  "Neutral Evil": "A neutral evil character does whatever they can get away with, without compassion or qualms. They are purely selfish, shedding no tears for those they harm.",
  "Chaotic Evil": "A chaotic evil character acts with arbitrary violence, spurred by greed, hatred, or bloodlust. They are hot-tempered, vicious, and unpredictable.",
};

const STAT_NAMES = ["str", "dex", "con", "int", "wis", "cha"];
const STAT_LABELS = { str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA" };
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const POINT_BUY_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

const mod = (score) => Math.floor((score - 10) / 2);

const formatAsi = (asi) => {
  return Object.entries(asi)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k.toUpperCase()} +${v}`)
    .join(", ");
};

export default function CharacterWizard({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "", race: "Human", class: "Fighter", subclass: "", deferSubclass: false,
    background: "Soldier", alignment: "Neutral Good",
    stats: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    gold: 10, sp: 0, cp: 0, equipment: [], scoreMethod: "standard",
  });
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const set = (key, val) => setData(d => ({ ...d, [key]: val }));
  const setStat = (key, val) => setData(d => ({ ...d, stats: { ...d.stats, [key]: val } }));

  const race = RACES.find(r => r.name === data.race) || RACES[0];
  const cls = CLASSES.find(c => c.name === data.class) || CLASSES[0];
  const bg = BACKGROUNDS.find(b => b.name === data.background) || BACKGROUNDS[0];

  const pointsUsed = STAT_NAMES.reduce((sum, k) => {
    const v = Math.max(8, Math.min(15, data.stats[k]));
    return sum + (POINT_BUY_COSTS[v] || 0);
  }, 0);

  const stepLabels = ["Identity", "Class", "Abilities", "Equipment", "Review"];

  // ================================================================
  // STEP 1 — IDENTITY
  // ================================================================
  const Step1Left = () => (
    <>
      <div className="modal-section">
        <label className="modal-label">Character Name</label>
        <input
          className="form-input"
          type="text"
          placeholder="Enter a name..."
          value={data.name}
          onChange={e => set("name", e.target.value)}
        />
      </div>

      <div className="modal-section">
        <label className="modal-label">Alignment</label>
        <select className="form-select" value={data.alignment} onChange={e => set("alignment", e.target.value)}>
          {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="modal-section">
        <label className="modal-label">Background</label>
        <select className="form-select" value={data.background} onChange={e => set("background", e.target.value)}>
          {BACKGROUNDS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
        </select>
      </div>

      <div className="modal-section">
        <label className="modal-label">Race</label>
        <div className="race-grid">
          {RACES.map(r => (
            <div
              key={r.name}
              className={`race-option${data.race === r.name ? " selected" : ""}`}
              onClick={() => set("race", r.name)}
            >
              <div className="race-option-name">{r.name}</div>
              <div className="race-option-bonus">
                {formatAsi(r.asi) || "None"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const Step1Right = () => (
    <>
      {/* Alignment section */}
      <div className="modal-section">
        <h3>{data.alignment}</h3>
        <p>{ALIGNMENT_DESCRIPTIONS[data.alignment]}</p>
      </div>

      <div className="section-divider" />

      {/* Background section */}
      <div className="modal-section">
        <h3>{bg.name}</h3>
        <p>{bg.description}</p>
        {bg.skills.length > 0 && (
          <>
            <h4>Skill Proficiencies</h4>
            <p>{bg.skills.join(", ")}</p>
          </>
        )}
        {bg.feature && (
          <>
            <h4>Feature: {bg.feature}</h4>
            <p>{bg.featureDescription}</p>
          </>
        )}
        {bg.personalityTraits && bg.personalityTraits.length > 0 && (
          <>
            <h4>Personality Traits</h4>
            <ul>
              {bg.personalityTraits.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </>
        )}
      </div>

      <div className="section-divider" />

      {/* Race section */}
      <div className="modal-section">
        <h3>{race.name}</h3>
        <p>{race.description}</p>

        <h4>Ability Score Increases</h4>
        <p>{formatAsi(race.asi) || "None"}</p>

        <h4>Speed</h4>
        <p>{race.speed} ft</p>

        {race.traits.length > 0 && (
          <>
            <h4>Racial Traits</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {race.traits.map(t => (
                <span key={t} className="wizard-trait-tag">{t}</span>
              ))}
            </div>
            {Object.entries(race.traitDescriptions || {}).map(([name, desc]) => (
              <div key={name} style={{ marginBottom: 6 }}>
                <strong>{name}:</strong> {desc}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );

  // ================================================================
  // STEP 2 — CLASS
  // ================================================================
  const Step2Left = () => (
    <>
      <div className="modal-section">
        <label className="modal-label">Class</label>
        <div className="class-grid">
          {CLASSES.map(c => (
            <div
              key={c.name}
              className={`class-option${data.class === c.name ? " selected" : ""}`}
              onClick={() => {
                set("class", c.name);
                set("subclass", "");
                set("deferSubclass", false);
              }}
            >
              <div className="class-option-name">{c.name}</div>
              <div className="class-option-meta">
                d{c.hitDie} &middot; {c.spellcaster ? "Spellcaster" : "Martial"} &middot; {STAT_LABELS[c.primaryStat]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-section">
        <label className="modal-label">{cls.subclassName}</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {cls.subclasses.map(sc => (
            <div
              key={sc.name}
              className={`subclass-chip${data.subclass === sc.name ? " selected" : ""}`}
              onClick={() => { set("subclass", sc.name); set("deferSubclass", false); }}
            >
              {sc.name}
            </div>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={data.deferSubclass}
            onChange={e => { set("deferSubclass", e.target.checked); if (e.target.checked) set("subclass", ""); }}
          />
          Defer subclass selection to level {cls.subclassLevel}
        </label>
      </div>
    </>
  );

  const Step2Right = () => {
    const selectedSc = cls.subclasses.find(sc => sc.name === data.subclass);
    return (
      <div className="modal-section">
        <h3>{cls.name}</h3>
        <p>{cls.description}</p>

        <h4>Hit Die</h4>
        <p>d{cls.hitDie}</p>

        <h4>Saving Throws</h4>
        <p>{cls.savingThrows.map(s => s.toUpperCase()).join(", ")}</p>

        <h4>Armor Proficiencies</h4>
        <p>{cls.armorProficiencies || "None"}</p>

        <h4>Weapon Proficiencies</h4>
        <p>{cls.weaponProficiencies || "None"}</p>

        {cls.spellcaster && (
          <>
            <h4>Spellcasting</h4>
            <p>{cls.spellcastingAbility.toUpperCase()}</p>
          </>
        )}

        {selectedSc ? (
          <>
            <div className="section-divider" />
            <h3>{selectedSc.name}</h3>
            <p>{selectedSc.description}</p>
            {selectedSc.features && Object.entries(selectedSc.features)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([lvl, feats]) => (
                <div key={lvl} style={{ marginTop: 8 }}>
                  <h4>Level {lvl}</h4>
                  <ul>
                    {feats.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              ))
            }
          </>
        ) : (
          <>
            <div className="section-divider" />
            <p style={{ opacity: 0.6, fontStyle: "italic" }}>Select a {cls.subclassName.toLowerCase()} to see details.</p>
          </>
        )}
      </div>
    );
  };

  // ================================================================
  // STEP 3 — ABILITIES
  // ================================================================
  const Step3Left = () => {
    const handleMethodChange = (method) => {
      set("scoreMethod", method);
      if (method === "standard") {
        setData(d => ({ ...d, scoreMethod: method, stats: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 } }));
      } else if (method === "pointbuy") {
        setData(d => ({ ...d, scoreMethod: method, stats: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 } }));
      }
    };

    const skillsByAbility = {};
    STAT_NAMES.forEach(s => { skillsByAbility[s] = SKILLS_LIST.filter(sk => sk.stat === s); });

    return (
      <>
        <div className="modal-section">
          <label className="modal-label">Score Method</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[["standard", "Standard Array"], ["pointbuy", "Point Buy"], ["manual", "Manual"]].map(([key, label]) => (
              <button
                key={key}
                className={`btn${data.scoreMethod === key ? " success" : ""}`}
                onClick={() => handleMethodChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
          {data.scoreMethod === "pointbuy" && (
            <div style={{ marginBottom: 8 }}>
              Points used: <strong>{pointsUsed}</strong> / 27
              {pointsUsed > 27 && <span style={{ color: "var(--danger)", marginLeft: 8 }}>Over budget!</span>}
            </div>
          )}
        </div>

        <div className="modal-section">
          <label className="modal-label">Ability Scores</label>
          <div className="stat-entry-grid">
            {STAT_NAMES.map(key => {
              const base = data.stats[key];
              const bonus = race.asi?.[key] || 0;
              const final_ = base + bonus;
              return (
                <div key={key} className="stat-entry-box">
                  <div className="stat-entry-label">{STAT_LABELS[key]}</div>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: "100%", textAlign: "center" }}
                    min={data.scoreMethod === "pointbuy" ? 8 : 3}
                    max={data.scoreMethod === "pointbuy" ? 15 : 20}
                    value={base}
                    onChange={e => setStat(key, parseInt(e.target.value) || 8)}
                  />
                  {bonus > 0 && <div style={{ color: "var(--success)", fontSize: 12 }}>+{bonus} racial</div>}
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{final_}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{modStr(final_)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-section">
          <label className="modal-label">Skills by Ability</label>
          {STAT_NAMES.map(key => {
            const skills = skillsByAbility[key];
            if (!skills.length) return null;
            return (
              <div key={key} style={{ marginBottom: 8 }}>
                <strong>{STAT_LABELS[key]}</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {skills.map(sk => {
                    const prof = bg.skills.includes(sk.name);
                    return (
                      <span key={sk.name} className={`tag ${prof ? "tag-gold" : ""}`}>
                        {prof ? "\u25CF" : "\u25CB"} {sk.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const Step3Right = () => (
    <div className="modal-section">
      <h3>Ability Score Summary</h3>
      {STAT_NAMES.map(key => {
        const base = data.stats[key];
        const bonus = race.asi?.[key] || 0;
        const final_ = base + bonus;
        return (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
            <span><strong>{STAT_LABELS[key]}</strong></span>
            <span>{final_} ({modStr(final_)})</span>
          </div>
        );
      })}

      <div className="section-divider" />

      {data.scoreMethod === "standard" && (
        <>
          <h4>Standard Array</h4>
          <p>{STANDARD_ARRAY.join(", ")}</p>
        </>
      )}
      {data.scoreMethod === "pointbuy" && (
        <>
          <h4>Point Buy Costs</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, fontSize: 13 }}>
            {Object.entries(POINT_BUY_COSTS).map(([score, cost]) => (
              <div key={score}>{score}: {cost} pts</div>
            ))}
          </div>
        </>
      )}

      <div className="section-divider" />

      <h4>Skill Proficiencies ({bg.name})</h4>
      <p>{bg.skills.length > 0 ? bg.skills.join(", ") : "None"}</p>
    </div>
  );

  // ================================================================
  // STEP 4 — EQUIPMENT
  // ================================================================
  const Step4Left = () => {
    const loadDefaultKit = () => {
      const kit = STARTING_EQUIPMENT.find(e => e.class === data.class);
      if (kit) {
        setData(d => ({ ...d, equipment: [...kit.items], gold: kit.gold }));
      }
    };

    const removeItem = (idx) => {
      setData(d => ({ ...d, equipment: d.equipment.filter((_, i) => i !== idx) }));
    };

    const addItem = () => {
      if (!newItemName.trim()) return;
      setData(d => ({ ...d, equipment: [...d.equipment, newItemName.trim()] }));
      setNewItemName("");
      setShowAddItem(false);
    };

    return (
      <>
        <div className="modal-section">
          <button className="btn success" onClick={loadDefaultKit}>Use Default Kit</button>
        </div>

        <div className="modal-section">
          <label className="modal-label">Starting Wealth</label>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12 }}>Gold (GP)</label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={data.gold}
                onChange={e => set("gold", parseInt(e.target.value) || 0)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12 }}>Silver (SP)</label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={data.sp}
                onChange={e => set("sp", parseInt(e.target.value) || 0)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12 }}>Copper (CP)</label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={data.cp}
                onChange={e => set("cp", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <div className="modal-section">
          <label className="modal-label">Equipment</label>
          {data.equipment.length === 0 && <p style={{ opacity: 0.6 }}>No items yet. Use the default kit or add items manually.</p>}
          {data.equipment.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
              <span>{item}</span>
              <button className="btn danger" style={{ padding: "2px 8px", fontSize: 12 }} onClick={() => removeItem(i)}>&times;</button>
            </div>
          ))}
          <button className="btn" style={{ marginTop: 8 }} onClick={() => setShowAddItem(true)}>+ Add Item</button>
        </div>

        {showAddItem && (
          <div className="quick-add-modal">
            <div className="quick-add-content">
              <label className="modal-label">Item Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Longsword"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addItem(); }}
                autoFocus
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn success" onClick={addItem}>Add</button>
                <button className="btn" onClick={() => { setShowAddItem(false); setNewItemName(""); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const Step4Right = () => {
    const kit = STARTING_EQUIPMENT.find(e => e.class === data.class);
    return (
      <div className="modal-section">
        <h3>Default {cls.name} Kit</h3>
        {kit ? (
          <ul>
            {kit.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        ) : (
          <p>No default kit found.</p>
        )}
        {kit && kit.gold > 0 && <p>Starting gold: {kit.gold} GP</p>}

        <div className="section-divider" />

        <h4>Current Wealth</h4>
        <p>{data.gold} GP, {data.sp} SP, {data.cp} CP</p>

        <div className="section-divider" />

        <h4>Current Equipment ({data.equipment.length} items)</h4>
        {data.equipment.length > 0 ? (
          <ul>
            {data.equipment.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        ) : (
          <p style={{ opacity: 0.6 }}>No equipment selected.</p>
        )}
      </div>
    );
  };

  // ================================================================
  // STEP 5 — REVIEW
  // ================================================================
  const Step5 = () => {
    const finalStats = {};
    STAT_NAMES.forEach(key => {
      finalStats[key] = data.stats[key] + (race.asi?.[key] || 0);
    });
    const hp = cls.hitDie + mod(finalStats.con);

    return (
      <div style={{ padding: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label className="modal-label">Name</label>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{data.name || "Unnamed Adventurer"}</div>
          </div>
          <div>
            <label className="modal-label">Race</label>
            <div>{data.race}</div>
          </div>
          <div>
            <label className="modal-label">Class</label>
            <div>{data.class}{data.subclass ? ` (${data.subclass})` : ""}</div>
          </div>
          <div>
            <label className="modal-label">Background</label>
            <div>{data.background}</div>
          </div>
          <div>
            <label className="modal-label">Alignment</label>
            <div>{data.alignment}</div>
          </div>
          <div>
            <label className="modal-label">Hit Points</label>
            <div>{hp}</div>
          </div>
        </div>

        <label className="modal-label">Final Ability Scores</label>
        <div className="stat-entry-grid" style={{ marginBottom: 16 }}>
          {STAT_NAMES.map(key => (
            <div key={key} className="stat-entry-box">
              <div className="stat-entry-label">{STAT_LABELS[key]}</div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{finalStats[key]}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{modStr(finalStats[key])}</div>
            </div>
          ))}
        </div>

        {cls.spellcaster && (
          <div style={{ marginBottom: 16 }}>
            <label className="modal-label">Spellcasting</label>
            <div>Spellcasting Ability: <strong>{cls.spellcastingAbility.toUpperCase()}</strong></div>
            <div>
              Spell Save DC: <strong>{8 + 2 + mod(finalStats[cls.spellcastingAbility])}</strong>
              &nbsp;&middot;&nbsp;
              Spell Attack: <strong>{modStr(2 + mod(finalStats[cls.spellcastingAbility]))}</strong>
            </div>
          </div>
        )}

        {data.equipment.length > 0 && (
          <div>
            <label className="modal-label">Equipment</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.equipment.map((item, i) => <span key={i} className="tag tag-blue">{item}</span>)}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ================================================================
  // RENDER
  // ================================================================
  const leftContent = { 1: Step1Left(), 2: Step2Left(), 3: Step3Left(), 4: Step4Left() };
  const rightContent = { 1: Step1Right(), 2: Step2Right(), 3: Step3Right(), 4: Step4Right() };

  return (
    <div className="modal-overlay">
      <div className="modal wizard-modal">
        <div className="modal-title">{"\u2694"} CHARACTER CREATION {"\u2694"}</div>

        <div className="wizard-steps">
          {stepLabels.map((label, i) => (
            <div
              key={label}
              className={`wizard-step${step === i + 1 ? " active" : ""}${step > i + 1 ? " completed" : ""}`}
              onClick={() => setStep(i + 1)}
            >
              <div className="wizard-step-circle">{i + 1}</div>
              <div className="wizard-step-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="wizard-content">
          {step === 5 ? (
            <Step5 />
          ) : (
            <div className="wizard-two-col">
              <div className="wizard-left">{leftContent[step]}</div>
              <div className="wizard-right">{rightContent[step]}</div>
            </div>
          )}
        </div>

        <div className="wizard-buttons">
          <div style={{ display: "flex", gap: 8 }}>
            {step > 1 && <button className="btn" onClick={() => setStep(s => s - 1)}>{"\u2190"} Back</button>}
            <button className="btn danger" onClick={onClose}>Cancel</button>
          </div>
          {step < 5
            ? <button className="btn success" onClick={() => setStep(s => s + 1)}>Next {"\u2192"}</button>
            : <button className="btn success" onClick={() => { onCreate(data); onClose(); }}>{"\u2726"} Begin Your Legend {"\u2726"}</button>
          }
        </div>
      </div>
    </div>
  );
}
