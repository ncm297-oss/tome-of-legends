import { useState, useEffect, useCallback } from "react";
import { RACES } from "../data/races";
import { CLASSES } from "../data/classes";
import { SPELL_SLOTS_BY_LEVEL } from "../data/skills";
import { BACKGROUNDS } from "../data/backgrounds";
import { buildClassResources } from "../data/classResources";

// ============================================================
// HELPERS
// ============================================================

export const mod = (score) => Math.floor((score - 10) / 2);
export const modStr = (score) => { const m = mod(score); return m >= 0 ? `+${m}` : `${m}`; };
export const profBonus = (level) => Math.ceil(level / 4) + 1;

export const XPByLevel = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

export const defaultCharacter = () => ({
  id: Date.now(),
  name: "New Adventurer",
  race: "Human",
  class: "Fighter",
  subclass: "",
  deferSubclass: false,
  level: 1,
  background: "Soldier",
  alignment: "Neutral Good",
  xp: 0,
  portrait: null,
  stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  hp: { current: 10, max: 10, temp: 0 },
  ac: 10,
  initiative: 0,
  speed: 30,
  deathSaves: { successes: 0, failures: 0 },
  conditions: [],
  skillProficiencies: [],
  skillExpertise: [],
  savingThrowProficiencies: [],
  inventory: [],
  equippedSlots: { weapon: null, offhand: null, armor: null, ring1: null, ring2: null, amulet: null },
  spells: [],
  spellSlots: Array(9).fill(0),
  spellSlotsUsed: Array(9).fill(0),
  feats: [],
  classFeatures: [],
  summons: [],
  notes: { personality: "", ideals: "", bonds: "", flaws: "", backstory: "", pages: [] },
  currency: { pp: 0, gp: 10, ep: 0, sp: 0, cp: 0 },
  customSpells: [],
  customFeats: [],
  // New fields
  inspiration: false,
  hitDice: { current: 1, max: 1, die: 10 },
  classResources: {},
  concentrating: null,
  proficiencies: { weapons: [], armor: [], tools: [], languages: ["Common"] },
  resistances: [],
  immunities: [],
  vulnerabilities: [],
});

// ============================================================
// HOOK
// ============================================================

export function useCharacters() {
  const [characters, setCharacters] = useState(() => {
    try {
      const saved = localStorage.getItem("dnd_characters");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [activeCharId, setActiveCharId] = useState(() => {
    try {
      const saved = localStorage.getItem("dnd_active_char");
      return saved ? Number(saved) : null;
    } catch { return null; }
  });

  const activeChar = characters.find(c => c.id === activeCharId) || characters[0] || null;
  const activeId = activeChar?.id;

  useEffect(() => {
    try { localStorage.setItem("dnd_characters", JSON.stringify(characters)); } catch {}
  }, [characters]);

  useEffect(() => {
    if (activeCharId) try { localStorage.setItem("dnd_active_char", String(activeCharId)); } catch {}
  }, [activeCharId]);

  const updateChar = useCallback((updates) => {
    setCharacters(prev => prev.map(c => c.id === activeId ? { ...c, ...updates } : c));
  }, [activeId]);

  const updateCharDeep = useCallback((path, value) => {
    setCharacters(prev => prev.map(c => {
      if (c.id !== activeId) return c;
      const parts = path.split(".");
      const newChar = { ...c };
      let obj = newChar;
      for (let i = 0; i < parts.length - 1; i++) {
        obj[parts[i]] = Array.isArray(obj[parts[i]]) ? [...obj[parts[i]]] : { ...obj[parts[i]] };
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
      return newChar;
    }));
  }, [activeId]);

  const createCharacter = (data) => {
    const race = RACES.find(r => r.name === data.race) || RACES[0];
    const cls = CLASSES.find(c => c.name === data.class) || CLASSES[0];
    const bg = BACKGROUNDS.find(b => b.name === data.background);

    const finalStats = {
      str: (data.stats?.str || 10) + (race.asi?.str || 0),
      dex: (data.stats?.dex || 10) + (race.asi?.dex || 0),
      con: (data.stats?.con || 10) + (race.asi?.con || 0),
      int: (data.stats?.int || 10) + (race.asi?.int || 0),
      wis: (data.stats?.wis || 10) + (race.asi?.wis || 0),
      cha: (data.stats?.cha || 10) + (race.asi?.cha || 0),
    };

    const newChar = {
      ...defaultCharacter(),
      id: Date.now(),
      name: data.name || "Unnamed Adventurer",
      race: data.race,
      class: data.class,
      subclass: data.subclass || "",
      deferSubclass: data.deferSubclass || false,
      background: data.background,
      alignment: data.alignment || "Neutral Good",
      level: 1,
      stats: finalStats,
      speed: race.speed || 30,
      savingThrowProficiencies: cls.savingThrows || [],
      skillProficiencies: bg?.skills || [],
      spellSlots: cls.spellcaster ? [...(SPELL_SLOTS_BY_LEVEL[1] || Array(9).fill(0))] : Array(9).fill(0),
      spellSlotsUsed: Array(9).fill(0),
      hp: {
        max: cls.hitDie + mod(finalStats.con),
        current: cls.hitDie + mod(finalStats.con),
        temp: 0,
      },
      ac: 10 + mod(finalStats.dex),
      initiative: mod(finalStats.dex),
      currency: { pp: 0, gp: data.gold || 10, ep: 0, sp: data.sp || 0, cp: data.cp || 0 },
      inventory: data.equipment || [],
      classFeatures: Object.entries(cls.features || {})
        .filter(([lvl]) => parseInt(lvl) <= 1)
        .flatMap(([, feats]) => feats.map(f => ({ name: f, description: "", level: 1, custom: false }))),
      notes: { personality: "", ideals: "", bonds: "", flaws: "", backstory: "", pages: [] },
      // Auto-populated new fields
      hitDice: { current: 1, max: 1, die: cls.hitDie },
      classResources: buildClassResources(data.class, 1, finalStats),
      proficiencies: {
        weapons: cls.weaponProficiencies ? cls.weaponProficiencies.split(", ").map(s => s.trim()) : [],
        armor: cls.armorProficiencies ? cls.armorProficiencies.split(", ").map(s => s.trim()) : [],
        tools: [],
        languages: ["Common"],
      },
      resistances: (() => {
        const raceRes = { Tiefling: ["Fire"], "Dwarf (Hill)": ["Poison"], "Dwarf (Mountain)": ["Poison"] };
        return raceRes[data.race] || [];
      })(),
    };
    setCharacters(prev => [...prev, newChar]);
    setActiveCharId(newChar.id);
  };

  const deleteCharacter = (id) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
    if (activeCharId === id) setActiveCharId(characters.find(c => c.id !== id)?.id || null);
  };

  const applyFeatEffects = (char, feat) => {
    const updated = { ...char };
    if (feat.effects) {
      if (feat.effects.str) updated.stats = { ...updated.stats, str: updated.stats.str + feat.effects.str };
      if (feat.effects.dex) updated.stats = { ...updated.stats, dex: updated.stats.dex + feat.effects.dex };
      if (feat.effects.con) updated.stats = { ...updated.stats, con: updated.stats.con + feat.effects.con };
      if (feat.effects.int) updated.stats = { ...updated.stats, int: updated.stats.int + feat.effects.int };
      if (feat.effects.wis) updated.stats = { ...updated.stats, wis: updated.stats.wis + feat.effects.wis };
      if (feat.effects.cha) updated.stats = { ...updated.stats, cha: updated.stats.cha + feat.effects.cha };
      if (feat.effects.speed) updated.speed = (updated.speed || 30) + feat.effects.speed;
      if (feat.effects.initiative) updated.initiative = (updated.initiative || 0) + feat.effects.initiative;
      // AC effects from conditional feats handled at render time in FeatsPanel
    }
    return updated;
  };

  return {
    characters,
    setCharacters,
    activeCharId,
    setActiveCharId,
    activeChar,
    updateChar,
    updateCharDeep,
    createCharacter,
    deleteCharacter,
    applyFeatEffects,
  };
}
