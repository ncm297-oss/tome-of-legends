import { useState, useEffect } from "react";
import { useCharacters, profBonus, mod } from "./hooks/useCharacters";
import { CLASSES } from "./data/classes";
import TopBar from "./components/TopBar";
import CharacterHeader from "./components/CharacterHeader";
import StatsPanel from "./components/panels/StatsPanel";
import CombatPanel from "./components/panels/CombatPanel";
import SkillsPanel from "./components/panels/SkillsPanel";
import SpellsPanel from "./components/panels/SpellsPanel";
import InventoryPanel from "./components/panels/InventoryPanel";
import FeatsPanel from "./components/panels/FeatsPanel";
import SummonsPanel from "./components/panels/SummonsPanel";
import NotesPanel from "./components/panels/NotesPanel";
import PartyPanel from "./components/panels/PartyPanel";
import ModalRouter from "./components/modals/ModalRouter";
import CharacterWizard from "./components/wizard/CharacterWizard";

export default function App() {
  const {
    characters, setCharacters,
    activeCharId, setActiveCharId,
    activeChar,
    updateChar, updateCharDeep,
    createCharacter, deleteCharacter,
    applyFeatEffects,
  } = useCharacters();

  const [showWizard, setShowWizard] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!activeChar && characters.length === 0) setShowWizard(true);
  }, [characters, activeChar]);

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
      <TopBar setShowWizard={setShowWizard} setModal={setModal} />

      <div className="hud-layout">
        {/* CHARACTER HEADER */}
        {activeChar && (
          <CharacterHeader
            activeChar={activeChar}
            setModal={setModal}
            deleteCharacter={deleteCharacter}
          />
        )}

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
          <StatsPanel
            activeChar={activeChar}
            updateChar={updateChar}
            updateCharDeep={updateCharDeep}
            setModal={setModal}
          />
          <PartyPanel
            characters={characters}
            activeCharId={activeCharId}
            setActiveCharId={setActiveCharId}
            setShowWizard={setShowWizard}
          />
        </div>

        {/* CENTER COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
          <CombatPanel
            activeChar={activeChar}
            updateChar={updateChar}
            updateCharDeep={updateCharDeep}
            setModal={setModal}
          />
          <SpellsPanel
            activeChar={activeChar}
            updateChar={updateChar}
            setModal={setModal}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
          <SkillsPanel
            activeChar={activeChar}
            updateChar={updateChar}
          />
        </div>
      </div>

      {/* BOTTOM PANELS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, padding: "0 6px 6px", height: 200, flexShrink: 0 }}>
        <InventoryPanel
          activeChar={activeChar}
          updateChar={updateChar}
          updateCharDeep={updateCharDeep}
          setModal={setModal}
        />
        <FeatsPanel
          activeChar={activeChar}
          updateChar={updateChar}
          setModal={setModal}
        />
        <SummonsPanel
          activeChar={activeChar}
          updateChar={updateChar}
          setModal={setModal}
        />
        <NotesPanel
          activeChar={activeChar}
          updateCharDeep={updateCharDeep}
        />
      </div>

      {/* MODALS */}
      {showWizard && <CharacterWizard onClose={() => setShowWizard(false)} onCreate={createCharacter} />}
      {modal && (
        <ModalRouter
          modal={modal}
          onClose={() => setModal(null)}
          activeChar={activeChar}
          updateChar={updateChar}
          updateCharDeep={updateCharDeep}
          applyFeatEffects={applyFeatEffects}
          setCharacters={setCharacters}
        />
      )}
    </div>
  );
}
