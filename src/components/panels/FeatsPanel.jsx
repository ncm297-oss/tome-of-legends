export default function FeatsPanel({ activeChar, updateChar, setModal }) {
  return (
    <div className="panel">
      <div className="panel-header"><span className="ornament">★</span> FEATS & FEATURES</div>
      <div className="panel-body">
        <div className="tabs" style={{ marginBottom: 4 }}>
          <div className="tab active" style={{ fontSize: 7 }}>FEATS</div>
          <div className="tab" style={{ fontSize: 7 }} onClick={() => setModal({ type: "addfeat" })}>+ ADD FEAT</div>
          <div className="tab" style={{ fontSize: 7 }} onClick={() => setModal({ type: "addcustomfeat" })}>+ CUSTOM</div>
        </div>
        {(activeChar?.feats || []).length === 0 && <div className="empty-state">No feats yet.</div>}
        {(activeChar?.feats || []).map((feat, i) => (
          <div key={i} className="feat-card" onClick={() => setModal({ type: "viewfeat", feat, index: i })}>
            <div className="feat-card-name">{feat.name}</div>
            <div className="feat-card-desc">{feat.description?.substring(0, 80)}{feat.description?.length > 80 ? "..." : ""}</div>
          </div>
        ))}
        <hr className="section-divider" />
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 4 }}>CLASS FEATURES</div>
        {(activeChar?.classFeatures || []).map((f, i) => (
          <div key={i} className="feat-card" style={{ borderColor: "rgba(41,128,185,0.2)" }}>
            <div className="feat-card-name" style={{ color: "var(--blue-bright)" }}>{f.name}</div>
            {f.description && <div className="feat-card-desc">{f.description}</div>}
          </div>
        ))}
        <button className="btn small w-full mt-1" onClick={() => setModal({ type: "addclassfeature" })}>+ Add Feature</button>
      </div>
    </div>
  );
}
