import { useState } from "react";
import { mod, modStr, profBonus } from "../../hooks/useCharacters";
import { SKILLS_LIST } from "../../data/skills";
import CollapsiblePanel from "../CollapsiblePanel";

export default function SkillsPanel({ activeChar, updateChar, updateCharDeep, setModal, collapsed, onToggle, wide }) {
  const stats = activeChar?.stats || {};
  const pb = profBonus(activeChar?.level || 1);
  const [groupCollapsed, setGroupCollapsed] = useState({});

  const toggleCollapse = (stat) => setGroupCollapsed(prev => ({ ...prev, [stat]: !prev[stat] }));

  const getSkillBonus = (skill) => {
    const base = mod(stats[skill.stat] || 10);
    const isProf = activeChar?.skillProficiencies?.includes(skill.name);
    const isExp = activeChar?.skillExpertise?.includes(skill.name);
    return base + (isExp ? pb * 2 : isProf ? pb : 0);
  };

  const statOrder = ["str", "dex", "con", "int", "wis", "cha"];
  const statNames = { str: "Strength", dex: "Dexterity", con: "Constitution", int: "Intelligence", wis: "Wisdom", cha: "Charisma" };
  const grouped = {};
  statOrder.forEach(s => { grouped[s] = SKILLS_LIST.filter(sk => sk.stat === s); });

  return (
    <CollapsiblePanel title="SKILLS & ABILITIES" ornament="◈" collapsed={collapsed} onToggle={onToggle} style={{ flex: 1 }}>
      <div className="panel-body">
        {/* Proficiency Bonus */}
        <div className="prof-bonus-display">
          <span className="prof-label">PROFICIENCY BONUS</span>
          <span className="prof-val">+{pb}</span>
        </div>

        {/* Proficiencies & Languages */}
        <div style={{ marginBottom: 6 }}>
          <div className="ability-header-combined">
            <div className="ability-header-left" onClick={() => toggleCollapse("proficiencies")}>
              <span className="ability-header-collapse">{groupCollapsed.proficiencies ? "▸" : "▾"}</span>
              <span className="ability-header-name">PROF & LANG</span>
            </div>
            <button className="btn small" style={{ fontSize: 10, padding: "1px 5px" }}
              onClick={(e) => { e.stopPropagation(); setModal({ type: "editproficiencies" }); }}>
              Edit
            </button>
          </div>
          {!groupCollapsed.proficiencies && (
            <div style={{ paddingLeft: 16, fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              {[["Armor", "armor"], ["Weapons", "weapons"], ["Tools", "tools"], ["Languages", "languages"]].map(([label, key]) => {
                const items = activeChar?.proficiencies?.[key] || [];
                if (items.length === 0) return null;
                return (
                  <div key={key}>
                    <span style={{ fontFamily: "Cinzel, serif", fontSize: 10, color: "var(--text-muted)", letterSpacing: 1 }}>{label}: </span>
                    {items.join(", ")}
                  </div>
                );
              })}
              {(!activeChar?.proficiencies || Object.values(activeChar.proficiencies).every(v => !v || v.length === 0)) && (
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>Click Edit to add proficiencies</div>
              )}
            </div>
          )}
        </div>

        <div style={wide ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" } : undefined}>
        {statOrder.map(stat => {
          const isProf = activeChar?.savingThrowProficiencies?.includes(stat);
          const saveVal = mod(stats[stat] || 10) + (isProf ? pb : 0);

          return (
            <div key={stat}>
              {/* Ability header with score, modifier, and edit */}
              <div className="ability-header-combined">
                <div className="ability-header-left" onClick={() => toggleCollapse(stat)}>
                  <span className="ability-header-collapse">{groupCollapsed[stat] ? "▸" : "▾"}</span>
                  <span className="ability-header-name">{stat.toUpperCase()}</span>
                </div>
                <div className="ability-header-right">
                  {/* Saving throw pip + modifier (click to toggle proficiency) */}
                  <div className="ability-save-pip" title={`${statNames[stat]} Save ${isProf ? "(proficient)" : ""} — click to toggle`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const profs = activeChar.savingThrowProficiencies || [];
                      updateChar({ savingThrowProficiencies: isProf ? profs.filter(p => p !== stat) : [...profs, stat] });
                    }}>
                    <div className={`skill-pip ${isProf ? "proficient" : ""}`} style={{ width: 8, height: 8 }} />
                    <span className="ability-save-val">{saveVal >= 0 ? `+${saveVal}` : saveVal}</span>
                  </div>
                  {/* Score (click to edit) */}
                  <div className="ability-score-box" onClick={() => setModal({ type: "editstat", stat })} title="Click to edit">
                    <span className="ability-score-num">{stats[stat] || 10}</span>
                  </div>
                </div>
              </div>

              {/* Skills under this ability */}
              {!groupCollapsed[stat] && grouped[stat].map(skill => {
                const isSkillProf = activeChar?.skillProficiencies?.includes(skill.name);
                const isExp = activeChar?.skillExpertise?.includes(skill.name);
                const val = getSkillBonus(skill);
                return (
                  <div key={skill.name} className="skill-row" style={{ paddingLeft: 16 }} onClick={() => {
                    const profs = activeChar?.skillProficiencies || [];
                    const exps = activeChar?.skillExpertise || [];
                    if (isExp) {
                      updateChar({ skillProficiencies: profs.filter(p => p !== skill.name), skillExpertise: exps.filter(e => e !== skill.name) });
                    } else if (isSkillProf) {
                      updateChar({ skillExpertise: [...exps, skill.name] });
                    } else {
                      updateChar({ skillProficiencies: [...profs, skill.name] });
                    }
                  }}>
                    <div className={`skill-pip ${isExp ? "expert" : isSkillProf ? "proficient" : ""}`} />
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-val">{val >= 0 ? `+${val}` : val}</span>
                  </div>
                );
              })}
              {!groupCollapsed[stat] && grouped[stat].length === 0 && (
                <div style={{ paddingLeft: 16, fontSize: 10, color: "var(--text-muted)", fontStyle: "italic", padding: "2px 0 2px 16px" }}>No skills</div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </CollapsiblePanel>
  );
}
