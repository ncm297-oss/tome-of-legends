import { useState } from "react";
import { modStr, mod, profBonus } from "../../hooks/useCharacters";
import { CLASSES } from "../../data/classes";
import { RACES } from "../../data/races";
import { BACKGROUNDS } from "../../data/backgrounds";
import { CONDITIONS } from "../../data/conditions";
import { FEATS_DB } from "../../data/feats";
import { COMMON_SUMMONS } from "../../data/summons";
import { SPELL_SLOTS_BY_LEVEL } from "../../data/skills";

function M({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="modal-title" style={{ margin: 0, fontSize: 16 }}>{title}</div>
          <button className="btn small danger" onClick={onClose}>✕ CLOSE</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ModalRouter({ modal, onClose, activeChar, updateChar, updateCharDeep, applyFeatEffects, setCharacters }) {
  const pb = profBonus(activeChar?.level || 1);

  if (modal.type === "editstat") {
    return <EditStatModal modal={modal} onClose={onClose} activeChar={activeChar} updateCharDeep={updateCharDeep} />;
  }
  if (modal.type === "editname") {
    return <EditNameModal onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "addxp") {
    return <AddXPModal onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "additem") {
    return <AddItemModal onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "viewitem") {
    return <ViewItemModal modal={modal} onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "viewspell") {
    return <ViewSpellModal modal={modal} onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "addcustomspell") {
    return <AddCustomSpellModal onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "addfeat") {
    return <AddFeatModal onClose={onClose} activeChar={activeChar} applyFeatEffects={applyFeatEffects} setCharacters={setCharacters} />;
  }
  if (modal.type === "addcustomfeat") {
    return <AddCustomFeatModal onClose={onClose} activeChar={activeChar} applyFeatEffects={applyFeatEffects} setCharacters={setCharacters} />;
  }
  if (modal.type === "viewfeat") {
    return <ViewFeatModal modal={modal} onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "addclassfeature") {
    return <AddClassFeatureModal onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "addsummon") {
    return <AddSummonModal onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "addcustomsummon") {
    return <AddCustomSummonModal onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "addcondition") {
    return <AddConditionModal onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "levelup") {
    return <LevelUpModal onClose={onClose} activeChar={activeChar} setCharacters={setCharacters} />;
  }
  if (modal.type === "portrait") {
    return <PortraitModal onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  if (modal.type === "inforace") {
    return <InfoRaceModal onClose={onClose} activeChar={activeChar} />;
  }
  if (modal.type === "infoclass") {
    return <InfoClassModal onClose={onClose} activeChar={activeChar} />;
  }
  if (modal.type === "infosubclass") {
    return <InfoSubclassModal onClose={onClose} activeChar={activeChar} />;
  }
  if (modal.type === "infobackground") {
    return <InfoBackgroundModal onClose={onClose} activeChar={activeChar} />;
  }
  if (modal.type === "viewclassfeature") {
    return <ViewClassFeatureModal modal={modal} onClose={onClose} activeChar={activeChar} updateChar={updateChar} />;
  }
  return null;
}

function EditStatModal({ modal, onClose, activeChar, updateCharDeep }) {
  const [val, setVal] = useState(activeChar?.stats[modal.stat] || 10);
  return (
    <M title={`Edit ${modal.stat.toUpperCase()}`} onClose={onClose}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 48, color: "var(--gold-bright)" }}>{val}</div>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 20, color: "var(--text-muted)" }}>{modStr(val)}</div>
        <input type="range" min={1} max={30} value={val} onChange={e => setVal(parseInt(e.target.value))} style={{ width: "80%", margin: "12px 0" }} />
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button className="btn" onClick={() => { updateCharDeep(`stats.${modal.stat}`, val); onClose(); }}>Apply</button>
        </div>
      </div>
    </M>
  );
}

function EditNameModal({ onClose, activeChar, updateChar }) {
  const [name, setName] = useState(activeChar?.name || "");
  const [alignment, setAlignment] = useState(activeChar?.alignment || "Neutral Good");
  return (
    <M title="Edit Character" onClose={onClose}>
      <div className="form-row">
        <div><label className="modal-label">Name</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
      </div>
      <div className="form-row">
        <div><label className="modal-label">Alignment</label>
          <select className="form-select" value={alignment} onChange={e => setAlignment(e.target.value)}>
            {["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <button className="btn" onClick={() => { updateChar({ name, alignment }); onClose(); }}>Save</button>
    </M>
  );
}

function AddXPModal({ onClose, activeChar, updateChar }) {
  const [xp, setXp] = useState(0);
  return (
    <M title="Add Experience" onClose={onClose}>
      <label className="modal-label">XP to Add</label>
      <input className="form-input" type="number" value={xp} onChange={e => setXp(parseInt(e.target.value) || 0)} />
      <button className="btn mt-2" onClick={() => { updateChar({ xp: (activeChar?.xp || 0) + xp }); onClose(); }}>Add XP</button>
    </M>
  );
}

function AddItemModal({ onClose, activeChar, updateChar }) {
  const [item, setItem] = useState({ name: "", qty: 1, weight: 0, description: "", equipped: false });
  return (
    <M title="Add Item" onClose={onClose}>
      <div className="form-row form-row-2">
        <div><label className="modal-label">Item Name</label><input className="form-input" value={item.name} onChange={e => setItem({ ...item, name: e.target.value })} /></div>
        <div><label className="modal-label">Quantity</label><input className="form-input" type="number" value={item.qty} onChange={e => setItem({ ...item, qty: parseInt(e.target.value) || 1 })} /></div>
      </div>
      <div className="form-row form-row-2">
        <div><label className="modal-label">Weight (lbs)</label><input className="form-input" type="number" value={item.weight} onChange={e => setItem({ ...item, weight: parseFloat(e.target.value) || 0 })} /></div>
        <div><label className="modal-label">Type</label>
          <select className="form-select" value={item.type || ""} onChange={e => setItem({ ...item, type: e.target.value })}>
            <option value="">General</option>
            <option>Weapon</option><option>Armor</option><option>Shield</option><option>Potion</option>
            <option>Magic Item</option><option>Tool</option><option>Currency</option>
          </select>
        </div>
      </div>
      <div><label className="modal-label">Description / Effects</label><textarea className="form-textarea" value={item.description} onChange={e => setItem({ ...item, description: e.target.value })} /></div>
      <button className="btn mt-2" onClick={() => {
        if (!item.name) return;
        updateChar({ inventory: [...(activeChar?.inventory || []), item] });
        onClose();
      }}>Add to Inventory</button>
    </M>
  );
}

function ViewItemModal({ modal, onClose, activeChar, updateChar }) {
  const [editing, setEditing] = useState(false);
  const [item, setItem] = useState({ ...modal.item });
  const equipped = activeChar?.equippedSlots || {};
  const isEquipped = Object.values(equipped).includes(item.name);
  const equippedSlot = Object.entries(equipped).find(([, v]) => v === item.name)?.[0];
  const canEquipWeapon = item.type === "Weapon";
  const isShield = item.type === "Shield" || item.name === "Shield";
  const isBodyArmor = item.type === "Armor" && !isShield;
  const doEquip = modal.equipItem || (() => {});
  return (
    <M title={editing ? "Edit Item" : item.name} onClose={onClose}>
      {editing ? (
        <>
          <div className="form-row form-row-2">
            <div><label className="modal-label">Name</label><input className="form-input" value={item.name} onChange={e => setItem({ ...item, name: e.target.value })} /></div>
            <div><label className="modal-label">Qty</label><input className="form-input" type="number" value={item.qty} onChange={e => setItem({ ...item, qty: parseInt(e.target.value) || 1 })} /></div>
          </div>
          <div><label className="modal-label">Description</label><textarea className="form-textarea" value={item.description} onChange={e => setItem({ ...item, description: e.target.value })} /></div>
          <button className="btn mt-2" onClick={() => {
            const inv = [...activeChar.inventory];
            inv[modal.index] = item;
            updateChar({ inventory: inv });
            onClose();
          }}>Save</button>
        </>
      ) : (
        <>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.description || "No description."}</div>
          {/* Equip/Unequip buttons */}
          {isEquipped && (
            <div style={{ marginTop: 8 }}>
              <span className="tag tag-green" style={{ marginRight: 6 }}>Equipped: {equippedSlot === "weapon" ? "Main Hand" : equippedSlot === "offhand" ? "Off Hand" : "Armor"}</span>
              <button className="btn small" onClick={() => { doEquip(item, equippedSlot); onClose(); }}>Unequip</button>
            </div>
          )}
          {!isEquipped && (canEquipWeapon || isBodyArmor || isShield) && (
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {canEquipWeapon && (
                <>
                  <button className="btn small" onClick={() => { doEquip(item, "weapon"); onClose(); }}>Equip Main Hand</button>
                  <button className="btn small" onClick={() => { doEquip(item, "offhand"); onClose(); }}>Equip Off Hand</button>
                </>
              )}
              {isShield && (
                <button className="btn small" onClick={() => { doEquip(item, "offhand"); onClose(); }}>Equip Shield (Off Hand)</button>
              )}
              {isBodyArmor && (
                <button className="btn small" onClick={() => { doEquip(item, "armor"); onClose(); }}>Equip Armor</button>
              )}
            </div>
          )}
          <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
            <button className="btn small" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn small danger" onClick={() => { updateChar({ inventory: activeChar.inventory.filter((_, j) => j !== modal.index) }); onClose(); }}>Remove</button>
          </div>
        </>
      )}
    </M>
  );
}

function ViewSpellModal({ modal, onClose, activeChar, updateChar }) {
  const sp = modal.spell;
  return (
    <M title={sp.name} onClose={onClose}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <span className="tag tag-blue">Level {sp.level === 0 ? "Cantrip" : sp.level}</span>
        <span className="tag tag-gold">{sp.school}</span>
        {(sp.classes || []).map(c => <span key={c} className="tag tag-green">{c}</span>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        {[["Casting Time", sp.castingTime], ["Range", sp.range], ["Components", sp.components], ["Duration", sp.duration]].map(([l, v]) => (
          <div key={l}><div style={{ fontSize: 8, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1 }}>{l}</div><div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v}</div></div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, borderTop: "1px solid rgba(212,160,23,0.15)", paddingTop: 10 }}>{sp.description}</div>
      {modal.canAdd && (
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          <button className="btn" onClick={() => {
            updateChar({ spells: [...(activeChar?.spells || []), { ...sp, prepared: false }] });
            onClose();
          }}>Add to Character</button>
          <button className="btn success" onClick={() => {
            updateChar({ spells: [...(activeChar?.spells || []), { ...sp, prepared: true }] });
            onClose();
          }}>Add & Prepare</button>
        </div>
      )}
      {!modal.canAdd && (
        <button className="btn mt-2" onClick={() => {
          const spells = activeChar.spells.map(s => s.name === sp.name ? { ...s, prepared: !s.prepared } : s);
          updateChar({ spells });
          onClose();
        }}>{sp.prepared ? "Unprepare" : "Mark Prepared"}</button>
      )}
    </M>
  );
}

function AddCustomSpellModal({ onClose, activeChar, updateChar }) {
  const [sp, setSp] = useState({ name: "", level: 1, school: "Evocation", castingTime: "1 action", range: "60 ft", components: "V, S", duration: "Instantaneous", classes: [], description: "", custom: true });
  return (
    <M title="Create Custom Spell" onClose={onClose}>
      <div className="form-row form-row-2">
        <div><label className="modal-label">Name</label><input className="form-input" value={sp.name} onChange={e => setSp({ ...sp, name: e.target.value })} /></div>
        <div><label className="modal-label">Level (0=Cantrip)</label><input className="form-input" type="number" min={0} max={9} value={sp.level} onChange={e => setSp({ ...sp, level: parseInt(e.target.value) || 0 })} /></div>
      </div>
      <div className="form-row form-row-2">
        <div><label className="modal-label">School</label>
          <select className="form-select" value={sp.school} onChange={e => setSp({ ...sp, school: e.target.value })}>
            {["Abjuration","Conjuration","Divination","Enchantment","Evocation","Illusion","Necromancy","Transmutation"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div><label className="modal-label">Casting Time</label><input className="form-input" value={sp.castingTime} onChange={e => setSp({ ...sp, castingTime: e.target.value })} /></div>
      </div>
      <div className="form-row form-row-2">
        <div><label className="modal-label">Range</label><input className="form-input" value={sp.range} onChange={e => setSp({ ...sp, range: e.target.value })} /></div>
        <div><label className="modal-label">Duration</label><input className="form-input" value={sp.duration} onChange={e => setSp({ ...sp, duration: e.target.value })} /></div>
      </div>
      <div><label className="modal-label">Components</label><input className="form-input" value={sp.components} onChange={e => setSp({ ...sp, components: e.target.value })} /></div>
      <div><label className="modal-label">Description</label><textarea className="form-textarea" value={sp.description} onChange={e => setSp({ ...sp, description: e.target.value })} /></div>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <button className="btn" onClick={() => {
          if (!sp.name) return;
          updateChar({ customSpells: [...(activeChar?.customSpells || []), sp], spells: [...(activeChar?.spells || []), sp] });
          onClose();
        }}>Create & Add to Character</button>
        <button className="btn success" onClick={() => {
          if (!sp.name) return;
          updateChar({ customSpells: [...(activeChar?.customSpells || []), sp] });
          onClose();
        }}>Save to Library Only</button>
      </div>
    </M>
  );
}

function AddFeatModal({ onClose, activeChar, applyFeatEffects, setCharacters }) {
  const [search, setSearch] = useState("");
  const feats = FEATS_DB.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <M title="Add Feat" onClose={onClose}>
      <input className="search-input" placeholder="Search feats..." value={search} onChange={e => setSearch(e.target.value)} />
      <div style={{ maxHeight: 350, overflowY: "auto" }}>
        {feats.map((feat, i) => (
          <div key={i} className="feat-card" style={{ cursor: "pointer" }} onClick={() => {
            const already = (activeChar?.feats || []).some(f => f.name === feat.name);
            if (already) return;
            const updatedChar = applyFeatEffects(activeChar, feat);
            setCharacters(prev => prev.map(c => c.id === activeChar.id ? { ...updatedChar, feats: [...(updatedChar.feats || []), feat] } : c));
            onClose();
          }}>
            <div className="feat-card-name">{feat.name}</div>
            <div className="feat-card-desc">{feat.description}</div>
            {Object.keys(feat.effects || {}).length > 0 && (
              <div style={{ marginTop: 4 }}>
                {Object.entries(feat.effects).map(([k, v]) => <span key={k} className="tag tag-green">+{v} {k.toUpperCase()}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </M>
  );
}

function AddCustomFeatModal({ onClose, activeChar, applyFeatEffects, setCharacters }) {
  const [feat, setFeat] = useState({ name: "", description: "", effects: {}, custom: true });
  const [effectKey, setEffectKey] = useState("str");
  const [effectVal, setEffectVal] = useState(1);
  return (
    <M title="Create Custom Feat" onClose={onClose}>
      <div><label className="modal-label">Feat Name</label><input className="form-input" value={feat.name} onChange={e => setFeat({ ...feat, name: e.target.value })} /></div>
      <div className="mt-2"><label className="modal-label">Description</label><textarea className="form-textarea" value={feat.description} onChange={e => setFeat({ ...feat, description: e.target.value })} /></div>
      <div className="mt-2">
        <label className="modal-label">Mechanical Effects</label>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
          <select className="form-select" style={{ flex: 1 }} value={effectKey} onChange={e => setEffectKey(e.target.value)}>
            {["str","dex","con","int","wis","cha","ac","speed","initiative"].map(k => <option key={k}>{k}</option>)}
          </select>
          <input className="form-input" type="number" style={{ width: 60 }} value={effectVal} onChange={e => setEffectVal(parseInt(e.target.value) || 0)} />
          <button className="btn small" onClick={() => setFeat({ ...feat, effects: { ...feat.effects, [effectKey]: effectVal } })}>+ Add</button>
        </div>
        {Object.entries(feat.effects).map(([k, v]) => (
          <span key={k} className="tag tag-green" style={{ cursor: "pointer" }} onClick={() => {
            const e2 = { ...feat.effects }; delete e2[k]; setFeat({ ...feat, effects: e2 });
          }}>+{v} {k.toUpperCase()} ✕</span>
        ))}
      </div>
      <button className="btn mt-2" onClick={() => {
        if (!feat.name) return;
        const updatedChar = applyFeatEffects(activeChar, feat);
        setCharacters(prev => prev.map(c => c.id === activeChar.id ? { ...updatedChar, feats: [...(updatedChar.feats || []), feat], customFeats: [...(updatedChar.customFeats || []), feat] } : c));
        onClose();
      }}>Create & Apply Feat</button>
    </M>
  );
}

function ViewFeatModal({ modal, onClose, activeChar, updateChar }) {
  const feat = modal.feat;
  return (
    <M title={feat.name} onClose={onClose}>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{feat.description}</div>
      {Object.keys(feat.effects || {}).length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4 }}>APPLIED EFFECTS</div>
          {Object.entries(feat.effects).map(([k, v]) => <span key={k} className="tag tag-green">+{v} {k.toUpperCase()}</span>)}
        </div>
      )}
      <button className="btn danger small mt-2" onClick={() => {
        updateChar({ feats: activeChar.feats.filter((_, j) => j !== modal.index) });
        onClose();
      }}>Remove Feat</button>
    </M>
  );
}

function AddClassFeatureModal({ onClose, activeChar, updateChar }) {
  const [feat, setFeat] = useState({ name: "", description: "", level: activeChar?.level || 1, custom: true });
  return (
    <M title="Add Class Feature" onClose={onClose}>
      <div className="form-row form-row-2">
        <div><label className="modal-label">Feature Name</label><input className="form-input" value={feat.name} onChange={e => setFeat({ ...feat, name: e.target.value })} /></div>
        <div><label className="modal-label">Level Gained</label><input className="form-input" type="number" min={1} max={20} value={feat.level} onChange={e => setFeat({ ...feat, level: parseInt(e.target.value) || 1 })} /></div>
      </div>
      <div><label className="modal-label">Description</label><textarea className="form-textarea" value={feat.description} onChange={e => setFeat({ ...feat, description: e.target.value })} /></div>
      <button className="btn mt-2" onClick={() => {
        if (!feat.name) return;
        updateChar({ classFeatures: [...(activeChar?.classFeatures || []), feat] });
        onClose();
      }}>Add Feature</button>
    </M>
  );
}

function AddSummonModal({ onClose, activeChar, updateChar }) {
  return (
    <M title="Add Common Summon" onClose={onClose}>
      {COMMON_SUMMONS.map((s, i) => (
        <div key={i} className="summon-card" style={{ cursor: "pointer" }} onClick={() => {
          updateChar({ summons: [...(activeChar?.summons || []), { ...s, hp: s.maxHp, actions: s.actions.map(a => ({ ...a, used: false })) }] });
          onClose();
        }}>
          <div className="summon-header">
            <div className="summon-name">{s.name}</div>
            <span className="tag tag-blue">{s.linkedSpell}</span>
          </div>
          <div className="summon-body">
            <div className="summon-stats">
              <span>HP <span className="summon-stat-val">{s.maxHp}</span></span>
              <span>AC <span className="summon-stat-val">{s.ac}</span></span>
              <span>CR <span className="summon-stat-val">{s.cr}</span></span>
              <span>SPD <span className="summon-stat-val">{s.speed}</span></span>
            </div>
          </div>
        </div>
      ))}
    </M>
  );
}

function AddCustomSummonModal({ onClose, activeChar, updateChar }) {
  const [s, setS] = useState({ name: "", cr: "1", hp: 10, maxHp: 10, ac: 10, speed: "30 ft", str: 10, dex: 10, con: 10, int: 6, wis: 10, cha: 6, actions: [], linkedSpell: "" });
  const [actionName, setActionName] = useState("");
  const [actionDesc, setActionDesc] = useState("");
  return (
    <M title="Custom Summon" onClose={onClose}>
      <div className="form-row form-row-2">
        <div><label className="modal-label">Name</label><input className="form-input" value={s.name} onChange={e => setS({ ...s, name: e.target.value })} /></div>
        <div><label className="modal-label">Linked Spell</label><input className="form-input" value={s.linkedSpell} onChange={e => setS({ ...s, linkedSpell: e.target.value })} placeholder="e.g. Conjure Animals" /></div>
      </div>
      <div className="form-row form-row-3">
        <div><label className="modal-label">HP</label><input className="form-input" type="number" value={s.maxHp} onChange={e => setS({ ...s, maxHp: parseInt(e.target.value) || 1, hp: parseInt(e.target.value) || 1 })} /></div>
        <div><label className="modal-label">AC</label><input className="form-input" type="number" value={s.ac} onChange={e => setS({ ...s, ac: parseInt(e.target.value) || 10 })} /></div>
        <div><label className="modal-label">CR</label><input className="form-input" value={s.cr} onChange={e => setS({ ...s, cr: e.target.value })} /></div>
      </div>
      <div><label className="modal-label">Speed</label><input className="form-input" value={s.speed} onChange={e => setS({ ...s, speed: e.target.value })} /></div>
      <div className="form-row" style={{ gridTemplateColumns: "repeat(6,1fr)", gap: 6 }}>
        {["str","dex","con","int","wis","cha"].map(stat => (
          <div key={stat}><label className="modal-label">{stat.toUpperCase()}</label><input className="form-input" type="number" value={s[stat]} onChange={e => setS({ ...s, [stat]: parseInt(e.target.value) || 10 })} /></div>
        ))}
      </div>
      <div className="mt-2">
        <label className="modal-label">Add Action</label>
        <div style={{ display: "flex", gap: 6 }}>
          <input className="form-input" placeholder="Action name" value={actionName} onChange={e => setActionName(e.target.value)} style={{ flex: 1 }} />
          <button className="btn small" onClick={() => {
            if (!actionName) return;
            setS({ ...s, actions: [...s.actions, { name: actionName, description: actionDesc, used: false }] });
            setActionName(""); setActionDesc("");
          }}>+</button>
        </div>
        <input className="form-input mt-1" placeholder="Action description" value={actionDesc} onChange={e => setActionDesc(e.target.value)} />
        {s.actions.map((a, i) => <div key={i} className="feat-card-name" style={{ marginTop: 3 }}>• {a.name}</div>)}
      </div>
      <button className="btn mt-2" onClick={() => {
        if (!s.name) return;
        updateChar({ summons: [...(activeChar?.summons || []), s] });
        onClose();
      }}>Summon Creature</button>
    </M>
  );
}

function AddConditionModal({ onClose, activeChar, updateChar }) {
  return (
    <M title="Add Condition" onClose={onClose}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {CONDITIONS.filter(c => !(activeChar?.conditions || []).includes(c)).map(c => (
          <button key={c} className="btn" onClick={() => {
            updateChar({ conditions: [...(activeChar?.conditions || []), c] });
            onClose();
          }}>{c}</button>
        ))}
      </div>
    </M>
  );
}

function LevelUpModal({ onClose, activeChar, setCharacters }) {
  const cls = CLASSES.find(c => c.name === activeChar?.class);
  const newLevel = (activeChar?.level || 1) + 1;
  const newFeatures = cls?.features?.[newLevel] || [];
  const [hpRoll, setHpRoll] = useState(cls ? Math.floor(cls.hitDie / 2) + 1 : 5);
  return (
    <M title={`Level Up to ${newLevel}!`} onClose={onClose}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 40, color: "var(--gold-bright)", textShadow: "0 0 20px rgba(240,192,64,0.5)" }}>✦ {newLevel} ✦</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{activeChar?.class} Level {newLevel}</div>
      </div>
      {newFeatures.length > 0 && (
        <div className="mb-2">
          <div className="modal-label">New Features Gained</div>
          {newFeatures.map(f => <div key={f} className="feat-card"><div className="feat-card-name">{f}</div></div>)}
        </div>
      )}
      <div className="mb-2">
        <label className="modal-label">HP Increase (roll d{cls?.hitDie} + CON modifier)</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input className="form-input" type="number" value={hpRoll} onChange={e => setHpRoll(parseInt(e.target.value) || 1)} style={{ flex: 1 }} />
          <button className="btn small" onClick={() => setHpRoll(Math.floor(Math.random() * (cls?.hitDie || 8)) + 1 + mod(activeChar?.stats.con || 10))}>Roll</button>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>CON modifier: {modStr(activeChar?.stats.con || 10)}</div>
      </div>
      <button className="btn" onClick={() => {
        const newSpellSlots = cls?.spellcaster ? [...(SPELL_SLOTS_BY_LEVEL[Math.min(20, newLevel)] || Array(9).fill(0))] : (activeChar?.spellSlots || Array(9).fill(0));
        const newClassFeatures = [...(activeChar?.classFeatures || []), ...newFeatures.map(f => ({ name: f, description: "", level: newLevel, custom: false }))];
        setCharacters(prev => prev.map(c => c.id === activeChar.id ? {
          ...c, level: newLevel,
          hp: { ...c.hp, max: c.hp.max + Math.max(1, hpRoll), current: c.hp.current + Math.max(1, hpRoll) },
          spellSlots: newSpellSlots,
          classFeatures: newClassFeatures,
        } : c));
        onClose();
      }}>Confirm Level Up</button>
    </M>
  );
}

function PortraitModal({ onClose, activeChar, updateChar }) {
  const [url, setUrl] = useState(activeChar?.portrait || "");
  return (
    <M title="Character Portrait" onClose={onClose}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        {url && <img src={url} style={{ width: 100, height: 100, borderRadius: "50%", border: "2px solid var(--gold)", objectFit: "cover" }} />}
      </div>
      <label className="modal-label">Portrait URL</label>
      <input className="form-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
      <button className="btn mt-2" onClick={() => { updateChar({ portrait: url }); onClose(); }}>Set Portrait</button>
    </M>
  );
}

function InfoRaceModal({ onClose, activeChar }) {
  const race = RACES.find(r => r.name === activeChar?.race);
  if (!race) return <M title="Race" onClose={onClose}><p>Race not found.</p></M>;
  return (
    <M title={race.name} onClose={onClose}>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{race.description}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <span className="tag tag-gold">Speed: {race.speed} ft</span>
        {Object.entries(race.asi).filter(([, v]) => v).map(([k, v]) => (
          <span key={k} className="tag tag-green">{k.toUpperCase()} +{v}</span>
        ))}
      </div>
      {race.traits.length > 0 && (
        <>
          <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 6 }}>RACIAL TRAITS</div>
          {race.traits.map(t => (
            <div key={t} style={{ marginBottom: 8 }}>
              <strong style={{ fontSize: 12 }}>{t}</strong>
              {race.traitDescriptions?.[t] && <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0 0 0", lineHeight: 1.5 }}>{race.traitDescriptions[t]}</p>}
            </div>
          ))}
        </>
      )}
    </M>
  );
}

function InfoClassModal({ onClose, activeChar }) {
  const cls = CLASSES.find(c => c.name === activeChar?.class);
  if (!cls) return <M title="Class" onClose={onClose}><p>Class not found.</p></M>;
  return (
    <M title={cls.name} onClose={onClose}>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{cls.description}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[["Hit Die", `d${cls.hitDie}`], ["Primary Stat", cls.primaryStat.toUpperCase()], ["Saving Throws", cls.savingThrows.map(s => s.toUpperCase()).join(", ")], ["Armor", cls.armorProficiencies || "None"], ["Weapons", cls.weaponProficiencies || "None"]].map(([l, v]) => (
          <div key={l}>
            <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1 }}>{l.toUpperCase()}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v}</div>
          </div>
        ))}
        {cls.spellcaster && (
          <div>
            <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1 }}>SPELLCASTING</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{cls.spellcastingAbility.toUpperCase()}</div>
          </div>
        )}
      </div>
      <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 6 }}>CLASS FEATURES BY LEVEL</div>
      {Object.entries(cls.features).filter(([, feats]) => feats.length > 0).sort(([a], [b]) => Number(a) - Number(b)).map(([lvl, feats]) => (
        <div key={lvl} style={{ marginBottom: 6 }}>
          <strong style={{ fontSize: 11, color: "var(--gold)" }}>Level {lvl}:</strong>{" "}
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{feats.join(", ")}</span>
        </div>
      ))}
    </M>
  );
}

function InfoSubclassModal({ onClose, activeChar }) {
  const cls = CLASSES.find(c => c.name === activeChar?.class);
  const sc = cls?.subclasses.find(s => s.name === activeChar?.subclass);
  if (!sc) return <M title={activeChar?.subclass || "Subclass"} onClose={onClose}><p>No subclass selected.</p></M>;
  return (
    <M title={sc.name} onClose={onClose}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <span className="tag tag-blue">{cls.name}</span>
        <span className="tag tag-gold">{cls.subclassName}</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{sc.description}</p>
      {sc.features && (
        <>
          <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 6 }}>SUBCLASS FEATURES</div>
          {Object.entries(sc.features).sort(([a], [b]) => Number(a) - Number(b)).map(([lvl, feats]) => (
            <div key={lvl} style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 11, color: "var(--gold)", fontWeight: 600, marginBottom: 4 }}>Level {lvl}</div>
              {feats.map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 4, paddingLeft: 8, borderLeft: "2px solid rgba(184,134,11,0.3)" }}>{f}</div>
              ))}
            </div>
          ))}
        </>
      )}
    </M>
  );
}

function InfoBackgroundModal({ onClose, activeChar }) {
  const bg = BACKGROUNDS.find(b => b.name === activeChar?.background);
  if (!bg) return <M title="Background" onClose={onClose}><p>Background not found.</p></M>;
  return (
    <M title={bg.name} onClose={onClose}>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{bg.description}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {bg.skills.map(s => <span key={s} className="tag tag-green">{s}</span>)}
      </div>
      {bg.feature && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4 }}>FEATURE: {bg.feature.toUpperCase()}</div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{bg.featureDescription}</p>
        </div>
      )}
      {bg.personalityTraits && bg.personalityTraits.length > 0 && (
        <div>
          <div style={{ fontSize: 9, fontFamily: "Cinzel, serif", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4 }}>PERSONALITY TRAITS</div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {bg.personalityTraits.map((t, i) => <li key={i} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 4 }}>{t}</li>)}
          </ul>
        </div>
      )}
    </M>
  );
}

const CLASS_FEATURE_DESCS = {
  "Rage": "You can enter a rage as a bonus action, gaining advantage on STR checks and saving throws, a bonus to melee damage, and resistance to bludgeoning, piercing, and slashing damage.",
  "Unarmored Defense": "While not wearing armor, your AC equals 10 + your Dexterity modifier + your Constitution modifier (Barbarian) or Wisdom modifier (Monk). You can use a shield and still gain this benefit.",
  "Reckless Attack": "Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. You gain advantage on melee attack rolls using STR, but attack rolls against you have advantage until your next turn.",
  "Danger Sense": "You have advantage on DEX saving throws against effects that you can see, such as traps and spells, as long as you are not blinded, deafened, or incapacitated.",
  "Extra Attack": "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
  "Fast Movement": "Your speed increases by 10 feet while you aren't wearing heavy armor.",
  "Spellcasting": "You have learned to cast spells through study, devotion, or innate talent. You can cast prepared or known spells using spell slots of the appropriate level.",
  "Bardic Inspiration": "You can use a bonus action to give one creature within 60 feet an inspiration die (d6, scaling with level) that it can add to one ability check, attack roll, or saving throw within 10 minutes.",
  "Jack of All Trades": "You can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.",
  "Song of Rest": "During a short rest, you can use soothing music or oration to help revitalize wounded allies. Each friendly creature that regains HP at the end of the short rest regains an extra 1d6 HP.",
  "Expertise": "Choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.",
  "Font of Inspiration": "You regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.",
  "Channel Divinity": "You gain the ability to channel divine energy directly from your deity, using it to fuel magical effects specific to your domain.",
  "Divine Sense": "You can detect the presence of any celestial, fiend, or undead within 60 feet that is not behind total cover, and you know the type of any being whose presence you sense.",
  "Lay on Hands": "You have a pool of healing power equal to 5 times your paladin level. As an action, you can touch a creature and draw from the pool to restore hit points or cure diseases and poisons.",
  "Divine Smite": "When you hit a creature with a melee weapon attack, you can expend a spell slot to deal extra radiant damage — 2d8 for a 1st-level slot, plus 1d8 for each slot level above 1st.",
  "Divine Health": "You are immune to disease.",
  "Fighting Style": "You adopt a particular style of fighting as your specialty, gaining a specific combat benefit such as bonus AC, damage, or accuracy depending on the style chosen.",
  "Second Wind": "You have a limited well of stamina. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once used, you must finish a short or long rest to use it again.",
  "Action Surge": "You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once used, you must finish a short or long rest to use it again.",
  "Martial Arts": "While unarmed or wielding monk weapons, you can use DEX instead of STR for attacks and damage, use a d4 for damage (scaling with level), and make an unarmed strike as a bonus action after attacking.",
  "Ki": "You have a pool of ki points equal to your monk level. Ki fuels various monk features like Flurry of Blows, Patient Defense, and Step of the Wind.",
  "Unarmored Movement": "Your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases as you gain monk levels.",
  "Deflect Missiles": "You can use your reaction to deflect or catch a missile when hit by a ranged weapon attack, reducing the damage by 1d10 + DEX modifier + monk level.",
  "Slow Fall": "You can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.",
  "Stunning Strike": "When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a CON saving throw or be stunned until the end of your next turn.",
  "Sneak Attack": "Once per turn, you can deal extra damage to one creature you hit with an attack if you have advantage on the attack roll or if another enemy of the target is within 5 feet of it.",
  "Thieves Cant": "You know thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation and understand slow, hidden signs and symbols.",
  "Cunning Action": "You can take a bonus action on each of your turns in combat to take the Dash, Disengage, or Hide action.",
  "Uncanny Dodge": "When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.",
  "Font of Magic": "You have sorcery points equal to your sorcerer level that you can use to create additional spell slots or fuel Metamagic options.",
  "Metamagic": "You gain the ability to twist your spells to suit your needs. You choose Metamagic options like Twinned Spell, Quickened Spell, or Subtle Spell to modify how your spells work.",
  "Pact Magic": "You can cast warlock spells using Pact Magic spell slots, which are always cast at their highest available level and recharge on a short or long rest.",
  "Eldritch Invocations": "You gain eldritch invocations — fragments of forbidden knowledge that imbue you with an abiding magical ability. You can choose invocations like Agonizing Blast, Devil's Sight, or Mask of Many Faces.",
  "Pact Boon": "Your otherworldly patron bestows a gift upon you for your loyal service — a Pact of the Chain (familiar), Pact of the Blade (weapon), or Pact of the Tome (cantrips).",
  "Arcane Recovery": "Once per day during a short rest, you can recover expended spell slots with a combined level equal to or less than half your wizard level (rounded up).",
  "Wild Shape": "You can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice per short or long rest.",
  "Druidic": "You know Druidic, the secret language of druids. You can use it to leave hidden messages and automatically spot such messages left by other druids.",
  "Favored Enemy": "You have significant experience studying, tracking, hunting, and even talking to a certain type of enemy. You gain advantage on Survival checks to track and Intelligence checks to recall information about them.",
  "Natural Explorer": "You are a master of navigating the natural world. You gain benefits when traveling through your favored terrain, including improved tracking, foraging, and awareness of threats.",
  "Primeval Awareness": "You can use an action and expend one spell slot to sense whether certain creature types are present within 1 mile (or 6 miles in favored terrain).",
  "ASI": "Ability Score Improvement: You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. Alternatively, you can take a feat.",
};

function ViewClassFeatureModal({ modal, onClose, activeChar, updateChar }) {
  const feature = modal.feature;
  const cls = CLASSES.find(c => c.name === activeChar?.class);
  // Try to find a description from multiple sources
  let featureDesc = feature.description;
  if (!featureDesc) {
    // Check built-in descriptions
    featureDesc = CLASS_FEATURE_DESCS[feature.name];
  }
  if (!featureDesc && cls) {
    // Check subclass features
    const sc = cls.subclasses.find(s => s.name === activeChar?.subclass);
    if (sc?.features) {
      for (const feats of Object.values(sc.features)) {
        for (const f of feats) {
          const colonIdx = f.indexOf(":");
          if (colonIdx > -1 && f.substring(0, colonIdx).trim() === feature.name) {
            featureDesc = f.substring(colonIdx + 1).trim();
          }
        }
      }
    }
  }
  return (
    <M title={feature.name} onClose={onClose}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <span className="tag tag-blue">{activeChar?.class}</span>
        {feature.level && <span className="tag tag-gold">Level {feature.level}</span>}
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{featureDesc || "No description available for this feature."}</p>
      <button className="btn danger small mt-2" onClick={() => {
        updateChar({ classFeatures: activeChar.classFeatures.filter((_, j) => j !== modal.index) });
        onClose();
      }}>Remove Feature</button>
    </M>
  );
}
