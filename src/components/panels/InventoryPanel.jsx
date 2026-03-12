import { useState, useEffect, useRef } from "react";
import { WEAPONS, ARMOR, ADVENTURING_GEAR, MAGIC_ITEMS } from "../../data/items";

const ITEM_ICONS = {
  Weapon: "⚔️", Armor: "🛡️", Potion: "🧪", "Magic Item": "✨", Tool: "🔧", Shield: "🛡️", default: "📦"
};

const ALL_ITEMS = [...WEAPONS.map(w => ({ ...w, type: "Weapon", description: `${w.damage} ${w.damageType}. ${w.properties?.join(", ") || ""}` })),
  ...ARMOR.map(a => ({ ...a, type: a.category === "Shield" ? "Shield" : "Armor", description: `AC: ${a.ac}${a.stealthDisadvantage ? ". Stealth disadvantage" : ""}${a.strengthReq ? `. Requires STR ${a.strengthReq}` : ""}` })),
  ...ADVENTURING_GEAR.map(g => ({ ...g, type: "Gear" })),
  ...MAGIC_ITEMS.map(m => ({ ...m, type: m.type || "Magic Item" }))];

function ItemTooltip({ item, pos }) {
  if (!item || !pos) return null;
  return (
    <div className="item-tooltip" style={{ left: pos.x + 12, top: pos.y - 10 }}>
      <div className="item-tooltip-name">{item.name}</div>
      {item.damage && <div className="item-tooltip-stat">Damage: {item.damage} {item.damageType}</div>}
      {item.ac && <div className="item-tooltip-stat">AC: {item.ac}</div>}
      {item.properties && <div className="item-tooltip-stat">Properties: {item.properties.join(", ")}</div>}
      {item.weight && <div className="item-tooltip-stat">Weight: {item.weight} lb</div>}
      {item.cost && <div className="item-tooltip-stat">Cost: {item.cost}</div>}
      {item.rarity && <div className="item-tooltip-stat">Rarity: {item.rarity}</div>}
      {item.attunement && <div className="item-tooltip-stat">Requires Attunement</div>}
      {item.description && <div className="item-tooltip-desc">{item.description}</div>}
    </div>
  );
}

// Buffered number input — uses local state while focused, syncs on blur
function BufferedNumberInput({ value, onChange, className, style }) {
  const [localVal, setLocalVal] = useState(String(value));
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!focused) setLocalVal(String(value));
  }, [value, focused]);

  return (
    <input
      ref={ref}
      className={className}
      style={style}
      type="number"
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

export default function InventoryPanel({ activeChar, updateChar, updateCharDeep, setModal }) {
  const [showFullInv, setShowFullInv] = useState(false);
  const [invTab, setInvTab] = useState("all");
  const [tooltip, setTooltip] = useState({ item: null, pos: null });
  const [addSearch, setAddSearch] = useState("");
  const [equipSlot, setEquipSlot] = useState(null); // which slot we're equipping to

  const stats = activeChar?.stats || {};
  const inventory = activeChar?.inventory || [];
  const totalWeight = inventory.reduce((s, i) => s + (parseFloat(i.weight) || 0) * (i.qty || 1), 0);
  const carryCapacity = (stats.str || 10) * 15;
  const equipped = activeChar?.equippedSlots || {};

  // Hotkey I to open inventory
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "i" && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        setShowFullInv(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleMouseEnter = (item, e) => setTooltip({ item, pos: { x: e.clientX, y: e.clientY } });
  const handleMouseLeave = () => setTooltip({ item: null, pos: null });

  const equipItem = (item, slot) => {
    const newSlots = { ...equipped, [slot]: item.name === equipped[slot] ? null : item.name };
    updateChar({ equippedSlots: newSlots });
    // Auto-update AC if armor/shield changed
    if (slot === "armor" || slot === "offhand") {
      const armorData = ARMOR.find(a => a.name === newSlots.armor && a.category !== "Shield");
      // Look for shield in both ARMOR and MAGIC_ITEMS
      const shieldData = ARMOR.find(a => a.name === newSlots.offhand && a.category === "Shield")
        || MAGIC_ITEMS.find(m => m.name === newSlots.offhand && m.type === "Shield");
      let newAC = 10 + Math.floor(((stats.dex || 10) - 10) / 2);
      if (armorData) {
        const acStr = armorData.ac;
        if (acStr.includes("+")) {
          const base = parseInt(acStr);
          const maxDex = acStr.includes("max 2") ? 2 : 99;
          newAC = base + Math.min(Math.floor(((stats.dex || 10) - 10) / 2), maxDex);
        } else {
          newAC = parseInt(acStr) || 10;
        }
      }
      if (shieldData) newAC += parseInt(shieldData.ac) || 2;
      updateChar({ ac: newAC, equippedSlots: newSlots });
    }
  };

  const filteredInv = invTab === "all" ? inventory :
    inventory.filter(i => {
      if (invTab === "weapons") return i.type === "Weapon";
      if (invTab === "armor") return i.type === "Armor" || i.type === "Shield";
      if (invTab === "consumables") return i.type === "Potion" || i.type === "Consumable";
      return i.type !== "Weapon" && i.type !== "Armor" && i.type !== "Shield" && i.type !== "Potion";
    });

  const filteredDbItems = ALL_ITEMS.filter(i => i.name.toLowerCase().includes(addSearch.toLowerCase()));

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <span className="ornament">⊞</span> EQUIPMENT
          <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--text-muted)" }}>{totalWeight.toFixed(1)}/{carryCapacity} lb</span>
        </div>
        <div className="panel-body">
          {/* Equipped slots */}
          <div className="equipped-slots">
            {[["weapon", "Weapon"], ["offhand", "Off-Hand"], ["armor", "Armor"]].map(([slot, label]) => (
              <div key={slot} className="equipped-slot" onClick={() => {
                if (equipped[slot]) {
                  equipItem({ name: equipped[slot] }, slot);
                } else {
                  setEquipSlot(slot);
                  setShowFullInv(true);
                }
              }}>
                <div className="equipped-slot-label">{label}</div>
                <div className="equipped-slot-name">{equipped[slot] || "—"}</div>
                {equipped[slot] && <div className="equipped-slot-unequip" title="Unequip">×</div>}
              </div>
            ))}
          </div>
          {/* Currency */}
          <div className="currency-row mb-2">
            {["pp", "gp", "ep", "sp", "cp"].map(c => (
              <div key={c} className="currency-box">
                <div className="currency-label">{c.toUpperCase()}</div>
                <BufferedNumberInput
                  className="currency-input"
                  value={activeChar?.currency?.[c] || 0}
                  onChange={v => updateCharDeep(`currency.${c}`, v)}
                />
              </div>
            ))}
          </div>
          <button className="btn small w-full" onClick={() => setShowFullInv(true)}>🎒 Open Inventory (I)</button>
        </div>
      </div>

      {/* Full Inventory Modal */}
      {showFullInv && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowFullInv(false)}>
          <div className="modal inventory-modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div className="modal-title" style={{ margin: 0, fontSize: 16 }}>🎒 INVENTORY</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{totalWeight.toFixed(1)} / {carryCapacity} lb</span>
                <button className="btn small danger" onClick={() => setShowFullInv(false)}>✕ CLOSE</button>
              </div>
            </div>
            <div className="tabs">
              {[["all","ALL"],["weapons","WEAPONS"],["armor","ARMOR"],["consumables","CONSUMABLES"],["misc","MISC"]].map(([k,l]) => (
                <div key={k} className={`tab ${invTab === k ? "active" : ""}`} onClick={() => setInvTab(k)}>{l}</div>
              ))}
              <div className="tab" onClick={() => setModal({ type: "additem" })}>+ ADD</div>
            </div>
            <div className="inventory-grid">
              {filteredInv.map((item, i) => {
                const isEquipped = Object.values(equipped).includes(item.name);
                const canEquipWeapon = item.type === "Weapon";
                const isShield = item.type === "Shield" || item.name === "Shield";
                const isBodyArmor = item.type === "Armor" && !isShield;
                const canEquip = canEquipWeapon || isBodyArmor || isShield;
                return (
                  <div key={i} className={`inv-grid-item ${isEquipped ? "equipped" : ""}`}
                    onMouseEnter={e => handleMouseEnter(item, e)} onMouseLeave={handleMouseLeave}
                    onClick={() => setModal({ type: "viewitem", item, index: i, equipItem })}>
                    <div className="inv-grid-item-icon">{ITEM_ICONS[item.type] || ITEM_ICONS.default}</div>
                    <div className="inv-grid-item-name">{item.name}</div>
                    <div className="inv-grid-item-meta">
                      {item.qty > 1 && `×${item.qty} · `}{item.weight ? `${item.weight}lb` : ""}
                    </div>
                    {isEquipped && <span className="tag tag-green" style={{ marginTop: 4 }}>Equipped</span>}
                    {!isEquipped && canEquip && (
                      <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                        {canEquipWeapon && (
                          <>
                            <button className="btn small" style={{ fontSize: 7, padding: "1px 4px" }}
                              onClick={e => { e.stopPropagation(); equipItem(item, "weapon"); }}>Main Hand</button>
                            <button className="btn small" style={{ fontSize: 7, padding: "1px 4px" }}
                              onClick={e => { e.stopPropagation(); equipItem(item, "offhand"); }}>Off Hand</button>
                          </>
                        )}
                        {isShield && (
                          <button className="btn small" style={{ fontSize: 7, padding: "1px 4px" }}
                            onClick={e => { e.stopPropagation(); equipItem(item, "offhand"); }}>Equip Shield</button>
                        )}
                        {isBodyArmor && (
                          <button className="btn small" style={{ fontSize: 7, padding: "1px 4px" }}
                            onClick={e => { e.stopPropagation(); equipItem(item, "armor"); }}>Equip Armor</button>
                        )}
                      </div>
                    )}
                    {isEquipped && (
                      <button className="btn small danger" style={{ fontSize: 7, padding: "1px 4px", marginTop: 2 }}
                        onClick={e => {
                          e.stopPropagation();
                          const slot = Object.entries(equipped).find(([, v]) => v === item.name)?.[0];
                          if (slot) equipItem(item, slot);
                        }}>Unequip</button>
                    )}
                  </div>
                );
              })}
              {filteredInv.length === 0 && <div className="empty-state" style={{ gridColumn: "1/-1" }}>No items in this category.</div>}
            </div>

            {/* Quick add from database */}
            <div style={{ marginTop: 16, borderTop: "1px solid rgba(160,120,60,0.25)", paddingTop: 12 }}>
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 10, color: "var(--gold)", letterSpacing: 1, marginBottom: 6 }}>ADD FROM DATABASE</div>
              <input className="search-input" placeholder="Search weapons, armor, gear..." value={addSearch} onChange={e => setAddSearch(e.target.value)} />
              {addSearch && (
                <div style={{ maxHeight: 150, overflowY: "auto" }}>
                  {filteredDbItems.slice(0, 20).map((item, i) => (
                    <div key={i} className="inventory-item" onClick={() => {
                      updateChar({ inventory: [...inventory, { name: item.name, qty: 1, weight: item.weight || 0, description: item.description || "", type: item.type, equipped: false }] });
                    }}>
                      <span style={{ fontSize: 12 }}>{ITEM_ICONS[item.type] || ITEM_ICONS.default}</span>
                      <span className="item-name">{item.name}</span>
                      {item.cost && <span className="item-weight">{item.cost}</span>}
                      <span style={{ color: "var(--green)", fontSize: 12, marginLeft: 4 }}>+</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ItemTooltip item={tooltip.item} pos={tooltip.pos} />
    </>
  );
}
