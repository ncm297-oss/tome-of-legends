import { useState, useEffect } from "react";
import { useCharacters, profBonus, mod } from "./hooks/useCharacters";
import useTheme from "./hooks/useTheme";
import { CLASSES } from "./data/classes";
import TopBar from "./components/TopBar";
import CharacterHeader from "./components/CharacterHeader";
import CombatPanel from "./components/panels/CombatPanel";
import SkillsPanel from "./components/panels/SkillsPanel";
import SpellsPanel from "./components/panels/SpellsPanel";
import InventoryPanel from "./components/panels/InventoryPanel";
import FeatsPanel from "./components/panels/FeatsPanel";
import SummonsPanel from "./components/panels/SummonsPanel";
import NotesPanel from "./components/panels/NotesPanel";
import ModalRouter from "./components/modals/ModalRouter";
import CharacterWizard from "./components/wizard/CharacterWizard";

const COLLAPSED_WIDTH = "44px";

export default function App() {
  const {
    characters, setCharacters,
    activeCharId, setActiveCharId,
    activeChar,
    updateChar, updateCharDeep,
    createCharacter, deleteCharacter,
    applyFeatEffects,
  } = useCharacters();

  const [theme, setTheme, themeExtras] = useTheme();
  const [showWizard, setShowWizard] = useState(false);
  const [modal, setModal] = useState(null);
  const [summonsExpanded, setSummonsExpanded] = useState(false);

  // Collapse state for panels
  const [collapsed, setCollapsed] = useState({
    spells: false,
    combat: false,
    skills: false,
    equipment: false,
    feats: false,
    summons: false,
    journal: false,
  });

  const topKeys = ["spells", "combat", "skills"];
  const bottomKeys = ["equipment", "feats", "summons", "journal"];

  const toggle = (key) => setCollapsed(prev => {
    const next = { ...prev, [key]: !prev[key] };
    // Prevent all panels in a row from collapsing
    if (topKeys.includes(key) && topKeys.every(k => next[k])) return prev;
    if (bottomKeys.includes(key) && bottomKeys.every(k => {
      if (k === "summons") return !summonsExpanded;
      return next[k];
    })) return prev;
    return next;
  });

  useEffect(() => {
    if (!activeChar && characters.length === 0) setShowWizard(true);
  }, [characters, activeChar]);

  // Build top row grid columns — open panels share space with 1fr
  const topOpen = [!collapsed.spells, !collapsed.combat, !collapsed.skills];
  const topCols = [
    collapsed.spells ? COLLAPSED_WIDTH : (topOpen.filter(Boolean).length === 1 ? "1fr" : "minmax(200px, 1fr)"),
    collapsed.combat ? COLLAPSED_WIDTH : "1fr",
    collapsed.skills ? COLLAPSED_WIDTH : (topOpen.filter(Boolean).length === 1 ? "1fr" : "minmax(180px, 1fr)"),
  ].join(" ");

  // Build bottom row grid columns
  const bottomCols = [
    collapsed.equipment ? COLLAPSED_WIDTH : "1fr",
    collapsed.feats ? COLLAPSED_WIDTH : "1fr",
    (!summonsExpanded || collapsed.summons) ? COLLAPSED_WIDTH : "1fr",
    collapsed.journal ? COLLAPSED_WIDTH : "1fr",
  ].join(" ");

  // Empty state — no characters
  if (!activeChar && !showWizard) {
    return (
      <div className="app-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 36, color: "var(--gold-bright)", marginBottom: 8, textShadow: "0 0 30px rgba(240,192,64,0.5)" }}>⚔️</div>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: 22, color: "var(--gold)", marginBottom: 20, letterSpacing: 4 }}>FORGE YOUR LEGEND</div>
          <button className="btn" onClick={() => setShowWizard(true)} style={{ fontSize: 12, padding: "10px 28px" }}>Begin Your Journey</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* TOP BAR */}
      <TopBar
        setShowWizard={setShowWizard}
        setModal={setModal}
        characters={characters}
        activeCharId={activeCharId}
        setActiveCharId={setActiveCharId}
        setCharacters={setCharacters}
        theme={theme}
        setTheme={setTheme}
        themeExtras={themeExtras}
      />

      {/* CHARACTER HEADER — outside grid so it's always full width */}
      {activeChar && (
        <div style={{ padding: "4px 6px 0" }}>
          <CharacterHeader
            activeChar={activeChar}
            updateChar={updateChar}
            setModal={setModal}
            deleteCharacter={deleteCharacter}
          />
        </div>
      )}

      <div className="hud-layout" style={{ gridTemplateColumns: topCols }}>
        {/* LEFT COLUMN — Spells */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
          <SpellsPanel
            activeChar={activeChar}
            updateChar={updateChar}
            updateCharDeep={updateCharDeep}
            setModal={setModal}
            collapsed={collapsed.spells}
            onToggle={() => toggle("spells")}
          />
        </div>

        {/* CENTER COLUMN — Combat */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
          <CombatPanel
            activeChar={activeChar}
            updateChar={updateChar}
            updateCharDeep={updateCharDeep}
            setModal={setModal}
            collapsed={collapsed.combat}
            onToggle={() => toggle("combat")}
          />
        </div>

        {/* RIGHT COLUMN — Skills & Abilities */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
          <SkillsPanel
            activeChar={activeChar}
            updateChar={updateChar}
            updateCharDeep={updateCharDeep}
            setModal={setModal}
            collapsed={collapsed.skills}
            onToggle={() => toggle("skills")}
            wide={collapsed.spells || collapsed.combat}
          />
        </div>
      </div>

      {/* BOTTOM PANELS ROW */}
      <div style={{
        display: "grid",
        gridTemplateColumns: bottomCols,
        gap: 6, padding: "0 6px 6px", height: 270, flexShrink: 0
      }}>
        <InventoryPanel
          activeChar={activeChar}
          updateChar={updateChar}
          updateCharDeep={updateCharDeep}
          setModal={setModal}
          collapsed={collapsed.equipment}
          onToggle={() => toggle("equipment")}
        />
        <FeatsPanel
          activeChar={activeChar}
          updateChar={updateChar}
          setModal={setModal}
          collapsed={collapsed.feats}
          onToggle={() => toggle("feats")}
        />
        <SummonsPanel
          activeChar={activeChar}
          updateChar={updateChar}
          setModal={setModal}
          expanded={summonsExpanded}
          setExpanded={(val) => {
            // If collapsing, check at least one bottom panel stays open
            if (!val) {
              const othersAllCollapsed = bottomKeys.every(k => {
                if (k === "summons") return true; // this one is collapsing
                return collapsed[k];
              });
              if (othersAllCollapsed) return;
            }
            setSummonsExpanded(val);
          }}
          collapsed={collapsed.summons}
          onToggle={() => toggle("summons")}
        />
        <NotesPanel
          activeChar={activeChar}
          updateCharDeep={updateCharDeep}
          collapsed={collapsed.journal}
          onToggle={() => toggle("journal")}
        />
      </div>

      {/* MODALS */}
      {showWizard && <CharacterWizard onClose={() => setShowWizard(false)} onCreate={createCharacter} />}
      {modal && (
        <ModalRouter
          modal={modal}
          onClose={() => setModal(null)}
          setModal={setModal}
          activeChar={activeChar}
          updateChar={updateChar}
          updateCharDeep={updateCharDeep}
          applyFeatEffects={applyFeatEffects}
          setCharacters={setCharacters}
          themeExtras={themeExtras}
        />
      )}
    </div>
  );
}
