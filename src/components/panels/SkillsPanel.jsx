import { mod, profBonus } from "../../hooks/useCharacters";
import { SKILLS_LIST } from "../../data/skills";

export default function SkillsPanel({ activeChar, updateChar }) {
  const stats = activeChar?.stats || {};
  const pb = profBonus(activeChar?.level || 1);

  const getSkillBonus = (skill) => {
    const base = mod(stats[skill.stat] || 10);
    const isProf = activeChar?.skillProficiencies?.includes(skill.name);
    const isExp = activeChar?.skillExpertise?.includes(skill.name);
    return base + (isExp ? pb * 2 : isProf ? pb : 0);
  };

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-header"><span className="ornament">◈</span> SKILLS</div>
      <div className="panel-body">
        {SKILLS_LIST.map(skill => {
          const isProf = activeChar?.skillProficiencies?.includes(skill.name);
          const isExp = activeChar?.skillExpertise?.includes(skill.name);
          const val = getSkillBonus(skill);
          return (
            <div key={skill.name} className="skill-row" onClick={() => {
              const profs = activeChar?.skillProficiencies || [];
              const exps = activeChar?.skillExpertise || [];
              if (isExp) {
                updateChar({ skillProficiencies: profs.filter(p => p !== skill.name), skillExpertise: exps.filter(e => e !== skill.name) });
              } else if (isProf) {
                updateChar({ skillExpertise: [...exps, skill.name] });
              } else {
                updateChar({ skillProficiencies: [...profs, skill.name] });
              }
            }}>
              <div className={`skill-pip ${isExp ? "expert" : isProf ? "proficient" : ""}`} />
              <span className="skill-name">{skill.name}</span>
              <span className="skill-stat">{skill.stat}</span>
              <span className="skill-val">{val >= 0 ? `+${val}` : val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
