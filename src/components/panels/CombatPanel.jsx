import { useState, useEffect, useRef } from "react";
import { modStr, mod, profBonus } from "../../hooks/useCharacters";
import { SKILLS_LIST } from "../../data/skills";
import { WEAPONS, ARMOR, MAGIC_ITEMS } from "../../data/items";
import { CLASS_ATTACK_ABILITIES } from "../../data/classAbilities";

// Buffered number input — uses local state while focused, syncs on blur
function BufferedNumberInput({ value, onChange, className, style, type = "number" }) {
  const [localVal, setLocalVal] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setLocalVal(String(value));
  }, [value, focused]);

  return (
    <input
      className={className}
      style={style}
      type={type}
      value={focused ? localVal : value}
      onFocus={() => { setFocused(true); setLocalVal(String(value)); }}
      onBlur={() => { setFocused(false); onChange(parseInt(localVal) || 0); }}
      onChange={e => {
        setLocalVal(e.target.value);
        onChange(parseInt(e.target.value) || 0);
      }}
    />
  );
}

export default function CombatPanel({ activeChar, updateChar, updateCharDeep, setModal }) {
  const stats = activeChar?.stats || {};
  const pb = profBonus(activeChar?.level || 1);
  const [actionsOpen, setActionsOpen] = useState(true);
  const [hpMode, setHpMode] = useState("damage"); // "damage" | "heal" | "temp"
  const [hpAmount, setHpAmount] = useState("");
  const [hpUndo, setHpUndo] = useState(null); // { current, temp } snapshot before last change
  const hpInputRef = useRef(null);

  const applyHpChange = () => {
    const amt = parseInt(hpAmount) || 0;
    if (amt <= 0) return;
    const hp = activeChar?.hp || { current: 0, max: 0, temp: 0 };
    // Save undo snapshot
    setHpUndo({ current: hp.current, max: hp.max, temp: hp.temp || 0 });
    if (hpMode === "damage") {
      let remaining = amt;
      let newTemp = hp.temp || 0;
      let newCurrent = hp.current;
      // Temp HP absorbs first
      if (newTemp > 0) {
        const absorbed = Math.min(newTemp, remaining);
        newTemp -= absorbed;
        remaining -= absorbed;
      }
      newCurrent = Math.max(0, newCurrent - remaining);
      updateChar({ hp: { ...hp, current: newCurrent, temp: newTemp } });
    } else if (hpMode === "heal") {
      const newCurrent = Math.min(hp.max, hp.current + amt);
      updateChar({ hp: { ...hp, current: newCurrent } });
    } else if (hpMode === "temp") {
      // Temp HP doesn't stack — use whichever is higher
      const newTemp = Math.max(hp.temp || 0, amt);
      updateChar({ hp: { ...hp, temp: newTemp } });
    }
    setHpAmount("");
  };

  const undoHpChange = () => {
    if (!hpUndo) return;
    const hp = activeChar?.hp || { current: 0, max: 0, temp: 0 };
    updateChar({ hp: { ...hp, current: hpUndo.current, max: hpUndo.max, temp: hpUndo.temp } });
    setHpUndo(null);
  };

  const getSkillBonus = (skill) => {
    const base = mod(stats[skill.stat] || 10);
    const isProf = activeChar?.skillProficiencies?.includes(skill.name);
    const isExp = activeChar?.skillExpertise?.includes(skill.name);
    return base + (isExp ? pb * 2 : isProf ? pb : 0);
  };

  const hpMax = activeChar?.hp?.max || 1;
  const hpTemp = activeChar?.hp?.temp || 0;
  const hpPct = activeChar ? Math.max(0, Math.min(100, (activeChar.hp.current / hpMax) * 100)) : 0;
  const hpColor = hpPct > 60 ? "var(--green-bright)" : hpPct > 25 ? "var(--gold)" : "var(--red-bright)";
  const tempPct = Math.min(100, (hpTemp / hpMax) * 100);

  return (
    <div className="panel">
      <div className="panel-header"><span className="ornament">⚡</span> COMBAT</div>
      <div className="panel-body">
        <div className="combat-grid" style={{ marginBottom: 8 }}>
          {/* HP */}
          <div className="combat-box" style={{ gridColumn: "span 2" }}>
            <div className="combat-label">Hit Points</div>
            <div className="hp-display">
              <BufferedNumberInput className="combat-input" value={activeChar?.hp.current || 0}
                onChange={v => updateCharDeep("hp.current", v)} />
              <span className="hp-sep">/</span>
              <BufferedNumberInput className="combat-input" value={activeChar?.hp.max || 0}
                onChange={v => updateCharDeep("hp.max", v)} />
            </div>
            <div className="hp-bar w-full">
              <div className="hp-fill" style={{ width: `${hpPct}%`, background: hpColor }} />
              {hpTemp > 0 && <div className="hp-fill-temp" style={{ width: `${tempPct}%` }} />}
            </div>
          </div>
          {/* Temp HP */}
          <div className="combat-box blue">
            <div className="combat-label">Temp HP</div>
            <BufferedNumberInput className="combat-input" style={{ fontSize: 16, width: 40 }} value={activeChar?.hp.temp || 0}
              onChange={v => updateCharDeep("hp.temp", v)} />
          </div>
          {/* AC */}
          <div className="combat-box blue">
            <div className="combat-label">AC</div>
            <BufferedNumberInput className="combat-input" style={{ width: 40 }} value={activeChar?.ac || 10}
              onChange={v => updateChar({ ac: v })} />
            {(() => {
              const offhand = activeChar?.equippedSlots?.offhand;
              const shieldData = offhand && (
                ARMOR.find(a => a.name === offhand && a.category === "Shield")
                || MAGIC_ITEMS.find(m => m.name === offhand && m.type === "Shield")
              );
              if (!shieldData) return null;
              const bonus = parseInt(shieldData.ac) || 2;
              return (
                <div style={{ fontSize: 8, color: "var(--blue-bright)", marginTop: 2, whiteSpace: "nowrap" }}>
                  🛡️ +{bonus} shield
                </div>
              );
            })()}
          </div>
          {/* Initiative */}
          <div className="combat-box green">
            <div className="combat-label">Initiative</div>
            <div className="combat-val">{modStr(stats.dex || 10)}</div>
          </div>
          {/* Speed */}
          <div className="combat-box green">
            <div className="combat-label">Speed</div>
            <BufferedNumberInput className="combat-input" style={{ width: 50 }} value={activeChar?.speed || 30}
              onChange={v => updateChar({ speed: v })} />
          </div>
          {/* Passive Perception */}
          <div className="combat-box">
            <div className="combat-label">Passive Perc.</div>
            <div className="combat-val small">{10 + getSkillBonus({ name: "Perception", stat: "wis" })}</div>
          </div>
        </div>

        {/* HP Quick Adjust */}
        <div className="hp-adjust-widget">
          <div className="hp-adjust-tabs">
            {[["damage", "Damage", "red"], ["heal", "Heal", "green"], ["temp", "Temp HP", "blue"]].map(([mode, label, color]) => (
              <div key={mode} className={`hp-adjust-tab ${color} ${hpMode === mode ? "active" : ""}`}
                onClick={() => { setHpMode(mode); setTimeout(() => hpInputRef.current?.focus(), 0); }}>{label}</div>
            ))}
          </div>
          <div className="hp-adjust-row">
            <input ref={hpInputRef} className="hp-adjust-input" type="number" min="0" placeholder="0"
              value={hpAmount}
              onChange={e => setHpAmount(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") applyHpChange(); }}
            />
            <button className={`btn small hp-adjust-apply ${hpMode}`} onClick={applyHpChange}>
              {hpMode === "damage" ? "⚔ Hit" : hpMode === "heal" ? "✚ Heal" : "🛡 Set"}
            </button>
            {hpUndo && (
              <button className="btn small hp-adjust-undo" onClick={undoHpChange} title="Undo last HP change">
                ↩ Undo
              </button>
            )}
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

        {/* Actions */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4, cursor: "pointer", userSelect: "none" }}
            onClick={() => setActionsOpen(o => !o)}>
            {actionsOpen ? "▾" : "▸"} ACTIONS
          </div>
          {actionsOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Weapon Attacks */}
              {(() => {
                const slots = activeChar?.equippedSlots || {};
                const weaponSlots = [
                  { key: "weapon", label: "Main Hand" },
                  { key: "offhand", label: "Off Hand" },
                ];
                const weaponRows = weaponSlots.map(({ key, label }) => {
                  const equipped = slots[key];
                  if (!equipped) return null;
                  const itemName = typeof equipped === "string" ? equipped : equipped?.name;
                  if (!itemName) return null;
                  const weapon = WEAPONS.find(w => w.name === itemName);
                  if (!weapon) return null;
                  const isFinesse = weapon.properties.some(p => p === "Finesse");
                  const isRanged = weapon.category.includes("Ranged");
                  const abilityMod = isFinesse
                    ? Math.max(mod(stats.str || 10), mod(stats.dex || 10))
                    : isRanged ? mod(stats.dex || 10) : mod(stats.str || 10);
                  const attackBonus = abilityMod + pb;
                  const dmgMod = abilityMod >= 0 ? ` + ${abilityMod}` : ` - ${Math.abs(abilityMod)}`;
                  return (
                    <div key={key} className="action-row">
                      <div className="action-name">{weapon.name}</div>
                      <div className="action-detail">
                        <span className="action-hit">{attackBonus >= 0 ? "+" : ""}{attackBonus} to hit</span>
                        <span className="action-dmg">{weapon.damage}{dmgMod} {weapon.damageType.toLowerCase()}</span>
                      </div>
                    </div>
                  );
                }).filter(Boolean);
                return weaponRows.length > 0 ? weaponRows : null;
              })()}

              {/* Class Abilities */}
              {CLASS_ATTACK_ABILITIES
                .filter(a => a.className === activeChar?.class && a.minLevel <= (activeChar?.level || 1))
                .map(a => (
                  <div key={a.name} className="action-row">
                    <div className="action-name">{a.name}</div>
                    <div className="action-detail">
                      <span className="action-dmg">{a.damage(activeChar?.level || 1)}</span>
                    </div>
                    <div className="action-desc">{a.description}</div>
                  </div>
                ))
              }

              {/* Empty state */}
              {(() => {
                const hasWeapons = ["weapon", "offhand"].some(k => {
                  const e = activeChar?.equippedSlots?.[k];
                  const name = typeof e === "string" ? e : e?.name;
                  return name && WEAPONS.find(w => w.name === name);
                });
                const hasAbilities = CLASS_ATTACK_ABILITIES.some(a => a.className === activeChar?.class && a.minLevel <= (activeChar?.level || 1));
                if (!hasWeapons && !hasAbilities) return (
                  <div style={{ fontSize: 9, color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: 4 }}>
                    Equip weapons or level up to see actions
                  </div>
                );
                return null;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
