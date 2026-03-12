import { useState, useEffect, useRef } from "react";
import { WEAPONS, ARMOR, ADVENTURING_GEAR, MAGIC_ITEMS, GEMSTONES } from "../../data/items";
import CollapsiblePanel from "../CollapsiblePanel";

const ITEM_ICONS = {
  Weapon: "⚔️", Armor: "🛡️", Potion: "🧪", "Magic Item": "✨", Tool: "🔧",
  Shield: "🛡️", Gear: "📦", Gemstone: "💎", Wand: "🪄", Ring: "💍",
  Wondrous: "✨", Scroll: "📜", Consumable: "🧪", default: "📦"
};

// Types that are stackable / show qty controls in the inventory list
const STACKABLE_TYPES = ["Potion", "Consumable", "Gear", "Gemstone", "Scroll"];

const ALL_ITEMS = [
  ...WEAPONS.map(w => ({ ...w, type: "Weapon", description: `${w.damage} ${w.damageType}. ${w.properties?.join(", ") || ""}` })),
  ...ARMOR.map(a => ({ ...a, type: a.category === "Shield" ? "Shield" : "Armor", description: `AC: ${a.ac}${a.stealthDisadvantage ? ". Stealth disadvantage" : ""}${a.strengthReq ? `. Requires STR ${a.strengthReq}` : ""}` })),
  ...ADVENTURING_GEAR.map(g => ({ ...g, type: "Gear" })),
  ...MAGIC_ITEMS.map(m => ({ ...m, type: m.type || "Magic Item" })),
  ...GEMSTONES.map(g => ({ ...g, type: "Gemstone", cost: g.value })),
];

function ItemTooltip({ item, pos }) {
  if (!item || !pos) return null;
  return (
    <div className="item-tooltip" style={{ left: pos.x + 12, top: pos.y - 10 }}>
      <div className="item-tooltip-name">{item.name}</div>
      {item.damage && <div className="item-tooltip-stat">Damage: {item.damage} {item.damageType}</div>}
      {item.ac && <div className="item-tooltip-stat">AC: {item.ac}</div>}
      {item.properties && <div className="item-tooltip-stat">Properties: {item.properties.join(", ")}</div>}
      {item.weight > 0 && <div className="item-tooltip-stat">Weight: {item.weight} lb</div>}
      {(item.cost || item.value) && <div className="item-tooltip-stat">Value: {item.cost || item.value}</div>}
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

export default function InventoryPanel({ activeChar, updateChar, updateCharDeep, setModal, collapsed, onToggle }) {
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

  const updateItemQty = (index, delta) => {
    const newInv = [...inventory];
    const newQty = Math.max(0, (newInv[index].qty || 1) + delta);
    if (newQty === 0) {
      newInv.splice(index, 1);
    } else {
      newInv[index] = { ...newInv[index], qty: newQty };
    }
    updateChar({ inventory: newInv });
  };

  const isStackable = (item) => STACKABLE_TYPES.includes(item.type);

  const filteredInv = invTab === "all" ? inventory :
    inventory.filter(i => {
      if (invTab === "weapons") return i.type === "Weapon";
      if (invTab === "armor") return i.type === "Armor" || i.type === "Shield";
      if (invTab === "consumables") return i.type === "Potion" || i.type === "Consumable";
      if (invTab === "valuables") return i.type === "Gemstone";
      return i.type !== "Weapon" && i.type !== "Armor" && i.type !== "Shield" && i.type !== "Potion" && i.type !== "Gemstone";
    });

  const filteredDbItems = ALL_ITEMS.filter(i => i.name.toLowerCase().includes(addSearch.toLowerCase()));

  return (
    <>
      <CollapsiblePanel title="EQUIPMENT" ornament="⊞"
        headerRight={`${totalWeight.toFixed(1)}/${carryCapacity} lb`}
        collapsed={collapsed} onToggle={onToggle}>
        <div className="panel-body">
          {/* Equipped slots */}
          <div className="equipped-slots">
            {[["weapon", "Weapon"], ["offhand", "Off-Hand"], ["armor", "Armor"]].map(([slot, label]) => (
              <div key={slot} className="equipped-slot" onClick={() => {
                if (equipped[slot]) {
                  // Find the full item data from inventory or DB
                  const invItem = inventory.find(i => i.name === equipped[slot]);
                  const dbItem = ALL_ITEMS.find(i => i.name === equipped[slot]);
                  const item = invItem || dbItem || { name: equipped[slot] };
                  setModal({ type: "viewitem", item, index: inventory.indexOf(invItem), equipItem, equippedSlot: slot });
                } else {
                  setEquipSlot(slot);
                  setShowFullInv(true);
                }
              }}>
                <div className="equipped-slot-label">{label}</div>
                <div className="equipped-slot-name">{equipped[slot] || "—"}</div>
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
      </CollapsiblePanel>

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
              {[["all","ALL"],["weapons","WEAPONS"],["armor","ARMOR"],["consumables","CONSUMABLES"],["valuables","VALUABLES"],["misc","MISC"]].map(([k,l]) => (
                <div key={k} className={`tab ${invTab === k ? "active" : ""}`} onClick={() => setInvTab(k)}>{l}</div>
              ))}
              <div className="tab" onClick={() => setModal({ type: "additem" })}>+ ADD</div>
            </div>

            {/* Inventory List */}
            <div className="inv-list" style={{ maxHeight: 340, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--gold) transparent" }}>
              {filteredInv.map((item, i) => {
                const realIndex = inventory.indexOf(item);
                const isEquipped = Object.values(equipped).includes(item.name);
                const canEquipWeapon = item.type === "Weapon";
                const isShield = item.type === "Shield" || item.name === "Shield";
                const isBodyArmor = item.type === "Armor" && !isShield;
                const stackable = isStackable(item);
                const icon = ITEM_ICONS[item.type] || ITEM_ICONS.default;

                return (
                  <div key={i} className={`inv-list-row ${isEquipped ? "equipped" : ""}`}
                    onMouseEnter={e => handleMouseEnter(item, e)} onMouseLeave={handleMouseLeave}
                    onClick={() => setModal({ type: "viewitem", item, index: realIndex, equipItem })}>
                    <div className="inv-list-icon">{icon}</div>
                    <div className="inv-list-info">
                      <div className="inv-list-name">
                        {item.name}
                        {isEquipped && <span className="tag tag-green" style={{ marginLeft: 6 }}>Equipped</span>}
                      </div>
                      <div className="inv-list-meta">
                        {item.type && <span>{item.type}</span>}
                        {item.weight > 0 && <span>{(item.weight * (item.qty || 1)).toFixed(1)} lb</span>}
                        {(item.cost || item.value) && <span>{item.cost || item.value}</span>}
                      </div>
                    </div>

                    {/* Quantity controls for stackable items */}
                    {stackable && (
                      <div className="inv-list-qty" onClick={e => e.stopPropagation()}>
                        <button className="qty-btn" onClick={() => updateItemQty(realIndex, -1)}>−</button>
                        <span className="qty-val">{item.qty || 1}</span>
                        <button className="qty-btn" onClick={() => updateItemQty(realIndex, 1)}>+</button>
                      </div>
                    )}

                    {/* Non-stackable qty display */}
                    {!stackable && (item.qty || 1) > 1 && (
                      <div className="inv-list-qty-label">×{item.qty}</div>
                    )}

                    {/* Equip buttons */}
                    <div className="inv-list-actions" onClick={e => e.stopPropagation()}>
                      {!isEquipped && canEquipWeapon && (
                        <>
                          <button className="btn small" style={{ fontSize: 7, padding: "1px 4px" }}
                            onClick={() => equipItem(item, "weapon")}>Main</button>
                          <button className="btn small" style={{ fontSize: 7, padding: "1px 4px" }}
                            onClick={() => equipItem(item, "offhand")}>Off</button>
                        </>
                      )}
                      {!isEquipped && isShield && (
                        <button className="btn small" style={{ fontSize: 7, padding: "1px 4px" }}
                          onClick={() => equipItem(item, "offhand")}>Equip</button>
                      )}
                      {!isEquipped && isBodyArmor && (
                        <button className="btn small" style={{ fontSize: 7, padding: "1px 4px" }}
                          onClick={() => equipItem(item, "armor")}>Equip</button>
                      )}
                      {isEquipped && (
                        <button className="btn small danger" style={{ fontSize: 7, padding: "1px 4px" }}
                          onClick={() => {
                            const slot = Object.entries(equipped).find(([, v]) => v === item.name)?.[0];
                            if (slot) equipItem(item, slot);
                          }}>Unequip</button>
                      )}
                    </div>

                    {/* Quick remove button */}
                    <div className="inv-list-remove" onClick={e => {
                      e.stopPropagation();
                      // Unequip first if equipped
                      if (isEquipped) {
                        const slot = Object.entries(equipped).find(([, v]) => v === item.name)?.[0];
                        if (slot) equipItem(item, slot);
                      }
                      updateChar({ inventory: inventory.filter((_, j) => j !== realIndex) });
                    }} title="Remove item">×</div>
                  </div>
                );
              })}
              {filteredInv.length === 0 && <div className="empty-state">No items in this category.</div>}
            </div>

            {/* Quick add from database */}
            <div style={{ marginTop: 16, borderTop: "1px solid rgba(160,120,60,0.25)", paddingTop: 12 }}>
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 10, color: "var(--gold)", letterSpacing: 1, marginBottom: 6 }}>ADD FROM DATABASE</div>
              <input className="search-input" placeholder="Search weapons, armor, gear, gemstones..." value={addSearch} onChange={e => setAddSearch(e.target.value)} />
              {addSearch && (
                <div style={{ maxHeight: 150, overflowY: "auto" }}>
                  {filteredDbItems.slice(0, 20).map((item, i) => (
                    <div key={i} className="inventory-item" onClick={() => {
                      // Check if stackable item already exists in inventory
                      if (STACKABLE_TYPES.includes(item.type)) {
                        const existingIdx = inventory.findIndex(inv => inv.name === item.name);
                        if (existingIdx >= 0) {
                          const newInv = [...inventory];
                          newInv[existingIdx] = { ...newInv[existingIdx], qty: (newInv[existingIdx].qty || 1) + 1 };
                          updateChar({ inventory: newInv });
                          return;
                        }
                      }
                      updateChar({ inventory: [...inventory, { name: item.name, qty: 1, weight: item.weight || 0, description: item.description || "", type: item.type, cost: item.cost || item.value || "", equipped: false }] });
                    }}>
                      <span style={{ fontSize: 12 }}>{ITEM_ICONS[item.type] || ITEM_ICONS.default}</span>
                      <span className="item-name">{item.name}</span>
                      {(item.cost || item.value) && <span className="item-weight">{item.cost || item.value}</span>}
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
