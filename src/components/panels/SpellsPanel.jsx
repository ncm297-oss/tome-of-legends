import { useState } from "react";
import { mod, modStr, profBonus } from "../../hooks/useCharacters";
import { SPELLS_DB } from "../../data/spells";
import { CLASSES } from "../../data/classes";
import { WEAPONS, ARMOR, MAGIC_ITEMS } from "../../data/items";
import { CLASS_ATTACK_ABILITIES } from "../../data/classAbilities";
import { getResourceMax } from "../../data/classResources";
import CollapsiblePanel from "../CollapsiblePanel";

export default function SpellsPanel({ activeChar, updateChar, updateCharDeep, setModal, collapsed, onToggle }) {
  const [spellTab, setSpellTab] = useState("slots");
  const [spellSearch, setSpellSearch] = useState("");
  const [collapsedLevels, setCollapsedLevels] = useState({});

  const cls = CLASSES.find(c => c.name === activeChar?.class);
  const pb = profBonus(activeChar?.level || 1);
  const stats = activeChar?.stats || {};
  const spellAbility = cls?.spellcastingAbility;
  const spellMod = spellAbility ? mod(stats[spellAbility] || 10) : 0;
  const spellSaveDC = spellAbility ? 8 + pb + spellMod : null;
  const spellAttack = spellAbility ? pb + spellMod : null;
  const level = activeChar?.level || 1;
  const maxSpellLevel = Math.ceil(level / 2);

  // Prepared count (cantrips excluded per D&D 5e rules)
  const maxPrepared = spellAbility ? Math.max(1, spellMod + level) : 0;
  const preparedCount = (activeChar?.spells || []).filter(s => s.prepared && s.level > 0).length;

  // Known spells grouped by level
  const knownByLevel = {};
  (activeChar?.spells || []).forEach(sp => {
    const lvl = sp.level || 0;
    if (!knownByLevel[lvl]) knownByLevel[lvl] = [];
    knownByLevel[lvl].push(sp);
  });

  // Class spells from DB
  const classSpells = cls ? SPELLS_DB.filter(s => s.classes?.includes(cls.name)) : [];
  const classSpellsByLevel = {};
  classSpells.filter(s => s.level <= maxSpellLevel).forEach(sp => {
    const lvl = sp.level || 0;
    if (!classSpellsByLevel[lvl]) classSpellsByLevel[lvl] = [];
    classSpellsByLevel[lvl].push(sp);
  });

  const toggleLevel = (lvl) => setCollapsedLevels(prev => ({ ...prev, [lvl]: !prev[lvl] }));

  const isKnown = (name) => (activeChar?.spells || []).some(s => s.name === name);
  const isPrepared = (name) => (activeChar?.spells || []).some(s => s.name === name && s.prepared);

  const prepareSpell = (spell) => {
    const spells = activeChar?.spells || [];
    const existing = spells.find(s => s.name === spell.name);
    if (existing) {
      updateChar({ spells: spells.map(s => s.name === spell.name ? { ...s, prepared: !s.prepared } : s) });
    } else {
      updateChar({ spells: [...spells, { ...spell, prepared: true }] });
    }
  };

  const addSpellKnown = (spell, prepared = false) => {
    if (isKnown(spell.name)) return;
    updateChar({ spells: [...(activeChar?.spells || []), { ...spell, prepared }] });
  };

  const allSpells = SPELLS_DB.concat(activeChar?.customSpells || []);
  const filteredLookup = allSpells.filter(s =>
    s.name.toLowerCase().includes(spellSearch.toLowerCase()) ||
    s.school?.toLowerCase().includes(spellSearch.toLowerCase())
  );

  return (
    <CollapsiblePanel title="SPELLS & ACTIONS" ornament="✦"
      headerRight={spellAbility ? `DC ${spellSaveDC} · +${spellAttack} ATK` : null}
      collapsed={collapsed} onToggle={onToggle}
      style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="panel-body" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Concentration Banner */}
        {activeChar?.concentrating && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "3px 8px", background: "rgba(184,134,11,0.15)",
            border: "1px solid rgba(184,134,11,0.4)", borderRadius: 3,
            marginBottom: 4, flexShrink: 0
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "var(--gold-bright)", fontSize: 11 }}>✦</span>
              <span style={{ fontFamily: "Cinzel, serif", fontSize: 9, color: "var(--gold)", letterSpacing: 0.5 }}>
                CONCENTRATING: {activeChar.concentrating}
              </span>
            </div>
            <button className="btn small danger" style={{ fontSize: 7, padding: "1px 5px" }}
              onClick={() => updateChar({ concentrating: null })}>
              Drop
            </button>
          </div>
        )}

        <div className="tabs" style={{ flexShrink: 0 }}>
          {["slots", "known", "lookup"].map(t => (
            <div key={t} className={`tab ${spellTab === t ? "active" : ""}`} onClick={() => setSpellTab(t)}>
              {t === "slots" ? "SLOTS" : t === "known" ? "KNOWN" : "LOOKUP"}
            </div>
          ))}
          <div className="tab" onClick={() => setModal({ type: "addcustomspell" })}>+ CUSTOM</div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--gold) transparent" }}>
          {/* SLOTS TAB */}
          {spellTab === "slots" && (
            <div>
              {maxPrepared > 0 && (
                <div style={{ textAlign: "center", marginBottom: 8, fontFamily: "Cinzel, serif", fontSize: 10, color: preparedCount > maxPrepared ? "var(--red-bright)" : "var(--gold)", letterSpacing: 1 }}>
                  PREPARED {preparedCount} / {maxPrepared}
                </div>
              )}
              {(knownByLevel[0] || []).length > 0 && (
                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4 }}>CANTRIPS</div>
                  {knownByLevel[0].map((sp, i) => (
                    <div key={i} className="spell-card" onClick={() => setModal({ type: "viewspell", spell: sp })}>
                      <div className="spell-card-name" style={{ fontSize: 10 }}>{sp.name}</div>
                      <div className="spell-card-meta">{sp.school}</div>
                    </div>
                  ))}
                </div>
              )}

              {(activeChar?.spellSlots || []).map((slots, i) => slots > 0 ? (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div className="spell-slot-row">
                    <div className="slot-level">Lvl {i + 1}</div>
                    <div className="slot-pips">
                      {Array(slots).fill(0).map((_, j) => {
                        const used = (activeChar?.spellSlotsUsed?.[i] || 0) > j;
                        return (
                          <div key={j} className={`slot-pip ${used ? "used" : "available"}`}
                            onClick={() => {
                              const usedArr = [...(activeChar?.spellSlotsUsed || Array(9).fill(0))];
                              usedArr[i] = used ? j : j + 1;
                              updateChar({ spellSlotsUsed: usedArr });
                            }} />
                        );
                      })}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)" }}>
                      {slots - (activeChar?.spellSlotsUsed?.[i] || 0)}/{slots}
                    </div>
                  </div>
                  {(knownByLevel[i + 1] || []).filter(sp => sp.prepared).map((sp, si) => (
                    <div key={si} className="spell-card" style={{ marginLeft: 28, marginBottom: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      onClick={() => setModal({ type: "castspell", spell: sp })}>
                      <div className="spell-card-name" style={{ fontSize: 10 }}>
                        {sp.name}
                        {(sp.duration || "").toLowerCase().startsWith("concentration") && (
                          <span style={{ fontSize: 7, color: "var(--gold)", marginLeft: 4 }}>C</span>
                        )}
                      </div>
                      <span style={{ color: "var(--red-bright)", cursor: "pointer", fontSize: 12, padding: "0 4px" }}
                        onClick={e => { e.stopPropagation(); prepareSpell(sp); }} title="Unprepare">×</span>
                    </div>
                  ))}
                </div>
              ) : null)}

              {/* ACTIONS SECTION */}
              <div style={{ marginTop: 8, borderTop: "1px solid rgba(160,120,60,0.2)", paddingTop: 6 }}>
                <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4 }}>ACTIONS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {/* Weapon Attacks */}
                  {(() => {
                    const slots = activeChar?.equippedSlots || {};
                    const stats = activeChar?.stats || {};
                    const weaponSlots = [
                      { key: "weapon", label: "Main Hand" },
                      { key: "offhand", label: "Off Hand" },
                    ];
                    return weaponSlots.map(({ key }) => {
                      const equipped = slots[key];
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
                  })()}

                  {/* Class Abilities & Resources */}
                  {(() => {
                    const abilities = CLASS_ATTACK_ABILITIES
                      .filter(a => a.className === activeChar?.class && a.minLevel <= (activeChar?.level || 1));
                    const resources = activeChar?.classResources || {};
                    const abilityToResource = {
                      "Rage Damage": "Rage", "Bardic Inspiration": "Bardic Inspiration",
                      "Channel Divinity": "Channel Divinity", "Wild Shape": "Wild Shape",
                      "Action Surge": "Action Surge", "Second Wind": "Second Wind",
                      "Flurry of Blows": "Ki Points", "Metamagic": "Sorcery Points",
                      "Arcane Recovery": "Arcane Recovery",
                    };
                    const usedResources = new Set();
                    const renderPips = (resName, res) => {
                      if (res.max > 10) {
                        return (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                            <button className="btn small" style={{ fontSize: 8, padding: "1px 4px", lineHeight: 1 }}
                              onClick={() => { if (res.current <= 0) return; updateChar({ classResources: { ...activeChar.classResources, [resName]: { ...res, current: res.current - 1 } } }); }}>−</button>
                            <span style={{ fontFamily: "Cinzel, serif", fontSize: 11, color: "var(--gold)", minWidth: 32, textAlign: "center" }}>{res.current}/{res.max}</span>
                            <button className="btn small" style={{ fontSize: 8, padding: "1px 4px", lineHeight: 1 }}
                              onClick={() => { if (res.current >= res.max) return; updateChar({ classResources: { ...activeChar.classResources, [resName]: { ...res, current: res.current + 1 } } }); }}>+</button>
                            <span style={{ fontSize: 7, color: res.resetOn === "short" ? "var(--blue-bright)" : "var(--gold)" }}>{res.resetOn === "short" ? "SR" : "LR"}</span>
                          </div>
                        );
                      }
                      return (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                          <div style={{ display: "flex", gap: 2 }}>
                            {Array(res.max).fill(0).map((_, j) => (
                              <div key={j} className={`slot-pip ${j < res.current ? "available" : "used"}`}
                                style={{ width: 10, height: 10, cursor: "pointer" }}
                                onClick={() => {
                                  const newCurrent = j < res.current ? j : j + 1;
                                  updateChar({ classResources: { ...activeChar.classResources, [resName]: { ...res, current: newCurrent } } });
                                }} />
                            ))}
                          </div>
                          <span style={{ fontSize: 9, color: "var(--text-muted)" }}>
                            {res.current}/{res.max}
                            <span style={{ fontSize: 7, marginLeft: 3, color: res.resetOn === "short" ? "var(--blue-bright)" : "var(--gold)" }}>{res.resetOn === "short" ? "SR" : "LR"}</span>
                          </span>
                        </div>
                      );
                    };
                    return (
                      <>
                        {abilities.map(a => {
                          const resName = abilityToResource[a.name];
                          const res = resName && resources[resName];
                          if (res) usedResources.add(resName);
                          return (
                            <div key={a.name} className="action-row">
                              <div className="action-name">{a.name}</div>
                              <div className="action-detail"><span className="action-dmg">{a.damage(activeChar?.level || 1)}</span></div>
                              <div className="action-desc">{a.description}</div>
                              {res && (
                                <div style={{ borderTop: "1px solid rgba(139,109,71,0.12)", paddingTop: 3, marginTop: 3 }}>
                                  {resName !== a.name && <div style={{ fontSize: 8, color: "var(--text-muted)", fontFamily: "Cinzel, serif", letterSpacing: 0.5 }}>{resName}</div>}
                                  {renderPips(resName, res)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {Object.entries(resources).filter(([name]) => !usedResources.has(name)).map(([name, res]) => (
                          <div key={name} className="action-row">
                            <div className="action-name">{name}</div>
                            {renderPips(name, res)}
                          </div>
                        ))}
                      </>
                    );
                  })()}

                  {/* Empty state */}
                  {(() => {
                    const hasWeapons = ["weapon", "offhand"].some(k => {
                      const e = activeChar?.equippedSlots?.[k];
                      const name = typeof e === "string" ? e : e?.name;
                      return name && WEAPONS.find(w => w.name === name);
                    });
                    const hasAbilities = CLASS_ATTACK_ABILITIES.some(a => a.className === activeChar?.class && a.minLevel <= (activeChar?.level || 1));
                    const hasResources = Object.keys(activeChar?.classResources || {}).length > 0;
                    if (!hasWeapons && !hasAbilities && !hasResources) return (
                      <div style={{ fontSize: 9, color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: 4 }}>
                        Equip weapons or level up to see actions
                      </div>
                    );
                    return null;
                  })()}
                </div>
              </div>

              {/* Rest buttons are in CombatPanel */}
            </div>
          )}

          {/* KNOWN TAB */}
          {spellTab === "known" && (
            <div>
              {maxPrepared > 0 && (
                <div style={{ textAlign: "center", marginBottom: 6, fontFamily: "Cinzel, serif", fontSize: 10, color: preparedCount > maxPrepared ? "var(--red-bright)" : "var(--gold)", letterSpacing: 1 }}>
                  PREPARED {preparedCount} / {maxPrepared}
                </div>
              )}
              <input className="search-input" placeholder="Filter spells..." value={spellSearch}
                onChange={e => setSpellSearch(e.target.value)} style={{ marginBottom: 6 }} />
              {!cls?.spellcaster && (
                <div className="empty-state">This class does not have spellcasting.</div>
              )}
              {cls?.spellcaster && Object.entries(classSpellsByLevel)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([lvl, spells]) => {
                  const lvlNum = Number(lvl);
                  const filtered = spellSearch
                    ? spells.filter(s => s.name.toLowerCase().includes(spellSearch.toLowerCase()))
                    : spells;
                  if (filtered.length === 0) return null;
                  const isCantrip = lvlNum === 0;
                  return (
                    <div key={lvl} style={{ marginBottom: 4 }}>
                      <div className="spell-level-header" onClick={() => toggleLevel(lvl)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 9, color: "var(--text-muted)", width: 10 }}>{collapsedLevels[lvl] ? "▸" : "▾"}</span>
                          <span style={{ fontFamily: "Cinzel, serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "var(--text-primary)" }}>
                            {isCantrip ? "CANTRIPS" : `LEVEL ${lvl}`}
                          </span>
                        </div>
                        <span style={{ fontSize: 9, color: "var(--text-muted)" }}>{filtered.length}</span>
                      </div>
                      {!collapsedLevels[lvl] && filtered.map((sp, i) => {
                        const known = isKnown(sp.name);
                        const prepared = isPrepared(sp.name);
                        return (
                          <div key={i} className="spell-known-row">
                            <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                              onClick={() => setModal({ type: "viewspell", spell: sp, canAdd: !known })}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sp.name}</div>
                              <div style={{ fontSize: 8, color: "var(--text-muted)" }}>{sp.school} · {sp.castingTime}</div>
                            </div>
                            {isCantrip ? (
                              known
                                ? <span className="tag tag-green" style={{ fontSize: 7 }}>Known</span>
                                : <button className="btn small" style={{ fontSize: 7, padding: "1px 6px" }}
                                    onClick={() => addSpellKnown(sp)}>+ Add</button>
                            ) : (
                              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                                {known && !prepared && <span className="tag tag-blue" style={{ fontSize: 7 }}>Known</span>}
                                <button className={`btn small ${prepared ? "success" : ""}`}
                                  style={{ fontSize: 7, padding: "1px 6px" }}
                                  onClick={() => prepareSpell(sp)}>
                                  {prepared ? "✓ Prep" : "Prepare"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          )}

          {/* LOOKUP TAB */}
          {spellTab === "lookup" && (
            <div>
              <input className="search-input" placeholder="Search all spells..." value={spellSearch}
                onChange={e => setSpellSearch(e.target.value)} style={{ marginBottom: 6 }} />
              {!spellSearch && (
                <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 6, fontStyle: "italic" }}>
                  Type to search all spells across all classes and levels
                </div>
              )}
              {spellSearch && filteredLookup.slice(0, 50).map((sp, i) => {
                const known = isKnown(sp.name);
                const prepared = isPrepared(sp.name);
                return (
                  <div key={i} className="spell-result" style={{ opacity: known ? 0.7 : 1 }}>
                    <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                      onClick={() => setModal({ type: "viewspell", spell: sp, canAdd: !known })}>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>{sp.name}</span>
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          <span className="tag tag-blue">Lvl {sp.level}</span>
                          <span className="tag tag-gold">{sp.school}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 8, color: "var(--text-muted)", marginTop: 1 }}>
                        {sp.castingTime} · {sp.range} · {(sp.classes || []).join(", ")}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 3, alignItems: "center", flexShrink: 0, marginLeft: 6 }}>
                      {known ? (
                        <>
                          <span className="tag tag-green" style={{ fontSize: 7 }}>Known</span>
                          {sp.level > 0 && (
                            <button className={`btn small ${prepared ? "success" : ""}`}
                              style={{ fontSize: 7, padding: "1px 6px" }}
                              onClick={() => prepareSpell(sp)}>
                              {prepared ? "✓" : "Prep"}
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button className="btn small" style={{ fontSize: 7, padding: "1px 6px" }}
                            onClick={() => addSpellKnown(sp)}>+ Known</button>
                          {sp.level > 0 && (
                            <button className="btn small success" style={{ fontSize: 7, padding: "1px 6px" }}
                              onClick={() => addSpellKnown(sp, true)}>+ Prep</button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CollapsiblePanel>
  );
}
