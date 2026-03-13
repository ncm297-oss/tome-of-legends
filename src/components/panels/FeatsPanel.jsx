import { ARMOR } from "../../data/items";
import CollapsiblePanel from "../CollapsiblePanel";

export default function FeatsPanel({ activeChar, updateChar, setModal, collapsed, onToggle }) {
  // Determine conditional feat states
  const equipped = activeChar?.equippedSlots || {};
  const isDualWielding = equipped.weapon && equipped.offhand && equipped.offhand !== "Shield"
    && !ARMOR.find(a => a.name === equipped.offhand);
  const armorData = ARMOR.find(a => a.name === equipped.armor);
  const isHeavyArmor = armorData?.category === "Heavy";

  const getFeatStatus = (feat) => {
    const name = feat.name;
    if (name === "Dual Wielder") return isDualWielding ? "active" : "inactive";
    if (name === "Heavy Armor Master") return isHeavyArmor ? "active" : "inactive";
    if (name === "Shield Master") return equipped.offhand === "Shield" ? "active" : "inactive";
    if (name === "Defensive Duelist") return equipped.weapon ? "active" : "inactive";
    // Always-on feats
    if (["Alert", "Mobile", "Tough", "Lucky", "War Caster", "Sentinel", "Great Weapon Master",
         "Sharpshooter", "Crossbow Expert", "Polearm Master", "Mage Slayer", "Savage Attacker",
         "Inspiring Leader", "Keen Mind", "Observant", "Resilient", "Skilled", "Actor",
         "Athlete", "Durable", "Heavily Armored", "Elemental Adept", "Ritual Caster",
         "Spell Sniper", "Magic Initiate", "Martial Adept", "Medium Armor Master",
         "Healer", "Charger", "Dungeon Delver", "Grappler", "Skulker", "Tavern Brawler",
         "Weapon Master", "Lightly Armored", "Moderately Armored", "Mounted Combatant"
        ].includes(name)) return "active";
    return "active";
  };

  return (
    <CollapsiblePanel title="FEATS & FEATURES" ornament="★" collapsed={collapsed} onToggle={onToggle}>
      <div className="panel-body">
        <div className="tabs" style={{ marginBottom: 4 }}>
          <div className="tab active" style={{ fontSize: 10 }}>FEATS</div>
          <div className="tab" style={{ fontSize: 10 }} onClick={() => setModal({ type: "addfeat" })}>+ ADD FEAT</div>
          <div className="tab" style={{ fontSize: 10 }} onClick={() => setModal({ type: "addcustomfeat" })}>+ CUSTOM</div>
        </div>
        {(activeChar?.feats || []).length === 0 && <div className="empty-state">No feats yet.</div>}
        {(activeChar?.feats || []).map((feat, i) => {
          const status = getFeatStatus(feat);
          return (
            <div key={i} className="feat-card" onClick={() => setModal({ type: "viewfeat", feat, index: i })}
              style={{ opacity: status === "inactive" ? 0.5 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="feat-card-name">{feat.name}</div>
                {status === "inactive" && <span className="tag tag-red" style={{ fontSize: 10 }}>Inactive</span>}
                {status === "active" && Object.keys(feat.effects || {}).length > 0 && (
                  <span className="tag tag-green" style={{ fontSize: 10 }}>Active</span>
                )}
              </div>
              <div className="feat-card-desc">{feat.description?.substring(0, 80)}{feat.description?.length > 80 ? "..." : ""}</div>
              {status === "inactive" && feat.name === "Dual Wielder" && (
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, fontStyle: "italic" }}>Requires two weapons equipped</div>
              )}
              {status === "inactive" && feat.name === "Heavy Armor Master" && (
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, fontStyle: "italic" }}>Requires heavy armor equipped</div>
              )}
              {status === "inactive" && feat.name === "Shield Master" && (
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, fontStyle: "italic" }}>Requires shield equipped</div>
              )}
            </div>
          );
        })}
        <hr className="section-divider" />
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4 }}>CLASS FEATURES</div>
        {(activeChar?.classFeatures || []).map((f, i) => (
          <div key={i} className="feat-card" style={{ borderColor: "rgba(40,116,166,0.25)", cursor: "pointer" }}
            onClick={() => setModal({ type: "viewclassfeature", feature: f, index: i })}>
            <div className="feat-card-name" style={{ color: "var(--blue-bright)" }}>{f.name}</div>
            {f.description && <div className="feat-card-desc">{f.description}</div>}
          </div>
        ))}
        <button className="btn small w-full mt-1" onClick={() => setModal({ type: "addclassfeature" })}>+ Add Feature</button>
      </div>
    </CollapsiblePanel>
  );
}
