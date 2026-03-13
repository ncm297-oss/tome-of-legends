import { useState } from "react";
import { mod, profBonus } from "../../hooks/useCharacters";
import { COMMON_SUMMONS } from "../../data/summons";
import CollapsiblePanel from "../CollapsiblePanel";

export default function SummonsPanel({ activeChar, updateChar, setModal, expanded, setExpanded, collapsed, onToggle }) {
  const [expandedCards, setExpandedCards] = useState({});
  const [subTab, setSubTab] = useState("active"); // "active" | "browse"
  const [browseFilter, setBrowseFilter] = useState("");
  const [showAll, setShowAll] = useState(false);
  const summons = activeChar?.summons || [];
  const hasSummons = summons.length > 0;

  const toggleCard = (i) => setExpandedCards(prev => ({ ...prev, [i]: !prev[i] }));

  // Character stats for dynamic summon calculations
  const pb = profBonus(activeChar?.level || 1);
  const spellcastingStat = (() => {
    const cls = activeChar?.class;
    if (["Wizard"].includes(cls)) return "int";
    if (["Cleric", "Druid", "Ranger"].includes(cls)) return "wis";
    return "cha"; // Bard, Paladin, Sorcerer, Warlock
  })();
  const spellMod = mod(activeChar?.stats?.[spellcastingStat] || 10);

  // Resolve formula tokens in action descriptions
  const resolveFormula = (text) => {
    if (!text) return text;
    return text
      .replace(/\bpb\b/gi, String(pb))
      .replace(/\bspellMod\b/gi, String(spellMod))
      .replace(/\bspellAttack\b/gi, String(spellMod + pb));
  };

  // Browse: filter summons by character's known spells or show all
  const knownSpellNames = (activeChar?.spells || []).map(s => s.name);
  const browseSummons = COMMON_SUMMONS.filter(s => {
    if (!showAll && s.linkedSpell && !knownSpellNames.includes(s.linkedSpell)) return false;
    if (browseFilter) return s.name.toLowerCase().includes(browseFilter.toLowerCase());
    return true;
  });

  const addSummonFromBrowse = (creature) => {
    const newSummon = { ...creature, hp: creature.maxHp, actions: creature.actions.map(a => ({ ...a, used: false })) };
    updateChar({ summons: [...summons, newSummon] });
    setSubTab("active");
  };

  // COLLAPSED STATE — icon-only
  if (!expanded) {
    return (
      <>
        {/* Desktop: narrow vertical strip */}
        <div className="panel panel-collapsed-h panel-collapsed-desktop summons-collapsed" onClick={() => setExpanded(true)}
          style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 0", minHeight: 80, flex: 1 }}>
          <div style={{ fontSize: 18 }}>🐾</div>
          {hasSummons && (
            <div style={{ fontSize: 10, color: "var(--gold-bright)", fontWeight: 700, fontFamily: "Cinzel, serif", marginTop: 2 }}>{summons.length}</div>
          )}
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "Cinzel, serif", letterSpacing: 0.5, marginTop: 2, writingMode: "vertical-rl", textOrientation: "mixed" }}>SUMMONS</div>
        </div>
        {/* Mobile: just the header bar */}
        <div className="panel panel-collapsed-mobile summons-collapsed" onClick={() => setExpanded(true)} style={{ cursor: "pointer" }}>
          <div className="panel-header collapsible">
            <span className="ornament">🐾</span> SUMMONS
            {hasSummons && <span className="panel-header-right">{summons.length}</span>}
            <span className="panel-collapse-icon">▼</span>
          </div>
        </div>
      </>
    );
  }

  // EXPANDED STATE
  return (
    <CollapsiblePanel title="SUMMONS" ornament="🐾"
      collapsed={false} onToggle={() => setExpanded(false)}
      headerRight={hasSummons ? <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{summons.length}</span> : null}>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 4, padding: "4px 6px 0" }}>
        <button className={`btn small ${subTab === "active" ? "" : "muted"}`} style={{ fontSize: 10, flex: 1 }}
          onClick={() => setSubTab("active")}>ACTIVE</button>
        <button className={`btn small ${subTab === "browse" ? "" : "muted"}`} style={{ fontSize: 10, flex: 1 }}
          onClick={() => setSubTab("browse")}>BROWSE</button>
      </div>

      <div className="panel-body" style={{ flex: 1, overflowY: "auto" }}>
        {/* ACTIVE TAB */}
        {subTab === "active" && (
          <>
            {!hasSummons && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", color: "var(--text-muted)", fontSize: 11 }}>
                <span style={{ fontSize: 16 }}>🐾</span>
                <span style={{ fontStyle: "italic" }}>No Active Summons</span>
              </div>
            )}
            {summons.map((s, si) => (
              <div key={si} className="summon-card">
                <div className="summon-header" onClick={() => toggleCard(si)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{expandedCards[si] ? "▾" : "▸"}</span>
                    <div className="summon-name">{s.name}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{s.hp}/{s.maxHp} HP</span>
                    <div style={{ width: 40, height: 4, background: "rgba(0,0,0,0.1)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${Math.max(0, Math.min(100, (s.hp / s.maxHp) * 100))}%`, height: "100%", background: "var(--red-bright)", borderRadius: 2 }} />
                    </div>
                    {s.linkedSpell && <span className="tag tag-blue">{s.linkedSpell}</span>}
                    <span style={{ color: "var(--red-bright)", cursor: "pointer", fontSize: 14 }}
                      onClick={e => { e.stopPropagation(); updateChar({ summons: activeChar.summons.filter((_, j) => j !== si) }); }}>×</span>
                  </div>
                </div>
                {expandedCards[si] && (
                  <div className="summon-body">
                    <div className="summon-hp-row">
                      <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "Cinzel, serif" }}>HP</span>
                      <input style={{ width: 35, background: "transparent", border: "none", borderBottom: "1px solid var(--red-bright)", color: "var(--red)", fontFamily: "Cinzel, serif", fontSize: 13, textAlign: "center", outline: "none" }}
                        type="number" value={s.hp}
                        onChange={e => {
                          const sums = [...activeChar.summons];
                          sums[si] = { ...s, hp: parseInt(e.target.value) || 0 };
                          updateChar({ summons: sums });
                        }} />
                      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>/ {s.maxHp}</span>
                      <div style={{ flex: 1 }}>
                        <div className="hp-bar"><div className="hp-fill" style={{ width: `${Math.max(0, Math.min(100, (s.hp / s.maxHp) * 100))}%`, background: "var(--red-bright)" }} /></div>
                      </div>
                    </div>
                    <div className="summon-stats">
                      <span>AC <span className="summon-stat-val">{s.ac}</span></span>
                      <span>SPD <span className="summon-stat-val">{s.speed}</span></span>
                      <span>CR <span className="summon-stat-val">{s.cr}</span></span>
                    </div>
                    {s.str && (
                      <div style={{ display: "flex", gap: 6, fontSize: 10, color: "var(--text-muted)", marginBottom: 4, flexWrap: "wrap" }}>
                        {["str","dex","con","int","wis","cha"].map(st => (
                          <span key={st}>{st.toUpperCase()} <span className="summon-stat-val">{s[st]}</span></span>
                        ))}
                      </div>
                    )}
                    <div className="summon-actions">
                      {(s.actions || []).map((a, ai) => (
                        <div key={ai} className={`summon-action ${a.used ? "action-used" : ""}`}
                          onClick={() => {
                            const sums = [...activeChar.summons];
                            const acts = [...s.actions];
                            acts[ai] = { ...a, used: !a.used };
                            sums[si] = { ...s, actions: acts };
                            updateChar({ summons: sums });
                          }}>
                          <div className={`action-pip ${a.used ? "used" : ""}`} />
                          <span style={{ color: "var(--text-secondary)", fontSize: 10 }}>{a.name}</span>
                          {a.description && <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 4 }}>— {resolveFormula(a.description).substring(0, 50)}</span>}
                        </div>
                      ))}
                    </div>
                    <button className="btn small mt-1" style={{ fontSize: 10 }} onClick={() => {
                      const sums = [...activeChar.summons];
                      sums[si] = { ...s, actions: s.actions.map(a => ({ ...a, used: false })) };
                      updateChar({ summons: sums });
                    }}>Reset Actions</button>
                  </div>
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              <button className="btn small flex-1" onClick={() => setSubTab("browse")}>+ Browse</button>
              <button className="btn small flex-1" onClick={() => setModal({ type: "addcustomsummon" })}>+ Custom</button>
            </div>
          </>
        )}

        {/* BROWSE TAB */}
        {subTab === "browse" && (
          <>
            <input type="text" className="spell-search" placeholder="Search summons..."
              value={browseFilter} onChange={e => setBrowseFilter(e.target.value)}
              style={{ width: "100%", marginBottom: 4, fontSize: 10, padding: "3px 6px" }} />
            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--text-muted)", marginBottom: 4, cursor: "pointer" }}>
              <input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} />
              Show all (not just known spells)
            </label>
            {browseSummons.length === 0 && (
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: 8 }}>
                No matching summons found
              </div>
            )}
            {browseSummons.map((creature, ci) => (
              <div key={ci} className="summon-card" style={{ marginBottom: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div className="summon-name">{creature.name}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      CR {creature.cr} | AC {creature.ac} | HP {creature.maxHp}
                      {creature.linkedSpell && <span> | {creature.linkedSpell}</span>}
                    </div>
                  </div>
                  <button className="btn small" style={{ fontSize: 10 }}
                    onClick={() => addSummonFromBrowse(creature)}>Summon</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </CollapsiblePanel>
  );
}
