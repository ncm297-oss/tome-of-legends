import { useState } from "react";
import { SPELLS_DB } from "../../data/spells";

export default function SpellsPanel({ activeChar, updateChar, setModal }) {
  const [spellSearch, setSpellSearch] = useState("");
  const [spellTab, setSpellTab] = useState("slots");

  const filteredSpells = SPELLS_DB.concat(activeChar?.customSpells || []).filter(s =>
    s.name.toLowerCase().includes(spellSearch.toLowerCase()) ||
    s.school?.toLowerCase().includes(spellSearch.toLowerCase())
  );

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-header"><span className="ornament">✦</span> SPELLS</div>
      <div className="panel-body">
        <div className="tabs">
          {["slots", "known", "lookup"].map(t => (
            <div key={t} className={`tab ${spellTab === t ? "active" : ""}`} onClick={() => setSpellTab(t)}>
              {t === "slots" ? "SLOTS" : t === "known" ? "KNOWN" : "LOOKUP"}
            </div>
          ))}
          <div className="tab" onClick={() => setModal({ type: "addcustomspell" })}>+ CUSTOM</div>
        </div>

        {spellTab === "slots" && (
          <div>
            {(activeChar?.spellSlots || []).map((slots, i) => slots > 0 ? (
              <div key={i} className="spell-slot-row">
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
            ) : null)}
            <button className="btn small mt-2" onClick={() => updateChar({ spellSlotsUsed: Array(9).fill(0) })}>Long Rest — Restore All</button>
          </div>
        )}

        {spellTab === "known" && (
          <div>
            {(activeChar?.spells || []).length === 0 && <div className="empty-state">No spells added yet.<br />Use the Lookup tab to find spells.</div>}
            {(activeChar?.spells || []).map((sp, i) => (
              <div key={i} className="spell-card" onClick={() => setModal({ type: "viewspell", spell: sp })}>
                <div className="flex items-center justify-between">
                  <div className="spell-card-name">{sp.name}</div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <span className="tag tag-blue">Lvl {sp.level}</span>
                    <span style={{ color: "var(--red-bright)", cursor: "pointer", fontSize: 14 }}
                      onClick={e => { e.stopPropagation(); updateChar({ spells: activeChar.spells.filter((_, j) => j !== i) }); }}>×</span>
                  </div>
                </div>
                <div className="spell-card-meta">{sp.school} · {sp.castingTime} · {sp.range}</div>
                {sp.prepared && <span className="tag tag-green" style={{ marginTop: 2 }}>Prepared</span>}
              </div>
            ))}
          </div>
        )}

        {spellTab === "lookup" && (
          <div>
            <input className="search-input" placeholder="Search spells..." value={spellSearch}
              onChange={e => setSpellSearch(e.target.value)} />
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {filteredSpells.slice(0, 30).map((sp, i) => (
                <div key={i} className="spell-result" onClick={() => setModal({ type: "viewspell", spell: sp, canAdd: true })}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{sp.name}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <span className="tag tag-blue">Lvl {sp.level}</span>
                      <span className="tag tag-gold">{sp.school}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 1 }}>{sp.castingTime} · {sp.range}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
