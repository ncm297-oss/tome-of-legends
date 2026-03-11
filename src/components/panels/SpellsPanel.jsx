import { useState } from "react";
import { mod, profBonus } from "../../hooks/useCharacters";
import { SPELLS_DB } from "../../data/spells";
import { CLASSES } from "../../data/classes";

export default function SpellsPanel({ activeChar, updateChar, setModal }) {
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
    <div className="panel" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="panel-header">
        <span className="ornament">✦</span> SPELLS
        {spellAbility && (
          <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--text-muted)" }}>
            DC {spellSaveDC} · +{spellAttack} ATK
          </span>
        )}
      </div>
      <div className="panel-body" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
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
                      onClick={() => setModal({ type: "viewspell", spell: sp })}>
                      <div className="spell-card-name" style={{ fontSize: 10 }}>{sp.name}</div>
                      <span style={{ color: "var(--red-bright)", cursor: "pointer", fontSize: 12, padding: "0 4px" }}
                        onClick={e => { e.stopPropagation(); prepareSpell(sp); }} title="Unprepare">×</span>
                    </div>
                  ))}
                </div>
              ) : null)}
              {(knownByLevel[0] || []).length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4 }}>CANTRIPS</div>
                  {knownByLevel[0].map((sp, i) => (
                    <div key={i} className="spell-card" onClick={() => setModal({ type: "viewspell", spell: sp })}>
                      <div className="spell-card-name" style={{ fontSize: 10 }}>{sp.name}</div>
                      <div className="spell-card-meta">{sp.school}</div>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn small mt-2 w-full" onClick={() => updateChar({ spellSlotsUsed: Array(9).fill(0) })}>Long Rest — Restore All</button>
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
    </div>
  );
}
