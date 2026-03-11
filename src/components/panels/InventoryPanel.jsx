export default function InventoryPanel({ activeChar, updateChar, updateCharDeep, setModal }) {
  const stats = activeChar?.stats || {};
  const totalWeight = (activeChar?.inventory || []).reduce((s, i) => s + (parseFloat(i.weight) || 0) * (i.qty || 1), 0);
  const carryCapacity = (stats.str || 10) * 15;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="ornament">⊞</span> INVENTORY
        <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--text-muted)" }}>{totalWeight.toFixed(1)}/{carryCapacity} lb</span>
      </div>
      <div className="panel-body">
        <div className="currency-row mb-2">
          {["pp", "gp", "ep", "sp", "cp"].map(c => (
            <div key={c} className="currency-box">
              <div className="currency-label">{c.toUpperCase()}</div>
              <input className="currency-input" type="number" value={activeChar?.currency?.[c] || 0}
                onChange={e => updateCharDeep(`currency.${c}`, parseInt(e.target.value) || 0)} />
            </div>
          ))}
        </div>
        {(activeChar?.inventory || []).map((item, i) => (
          <div key={i} className="inventory-item" onClick={() => setModal({ type: "viewitem", item, index: i })}>
            <span className="item-name">{item.name}</span>
            <span className="item-qty">×{item.qty}</span>
            <span className="item-weight">{item.weight}lb</span>
            <span className="item-del" onClick={e => { e.stopPropagation(); updateChar({ inventory: activeChar.inventory.filter((_, j) => j !== i) }); }}>×</span>
          </div>
        ))}
        <button className="btn small w-full mt-1" onClick={() => setModal({ type: "additem" })}>+ Add Item</button>
      </div>
    </div>
  );
}
