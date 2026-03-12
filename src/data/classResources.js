import { mod } from "../hooks/useCharacters";

// Class resource definitions — each has maxByLevel OR maxFormula, plus resetOn
export const CLASS_RESOURCES = {
  Barbarian: [
    { name: "Rage", maxByLevel: { 1: 2, 3: 3, 6: 4, 12: 5, 17: 6, 20: 999 }, resetOn: "long" },
  ],
  Bard: [
    { name: "Bardic Inspiration", maxFormula: "cha_mod", resetOn: "long", shortRestAtLevel: 5 },
  ],
  Cleric: [
    { name: "Channel Divinity", maxByLevel: { 2: 1, 6: 2, 18: 3 }, resetOn: "short" },
  ],
  Druid: [
    { name: "Wild Shape", maxByLevel: { 2: 2 }, resetOn: "short" },
  ],
  Fighter: [
    { name: "Action Surge", maxByLevel: { 2: 1, 17: 2 }, resetOn: "short" },
    { name: "Second Wind", maxByLevel: { 1: 1 }, resetOn: "short" },
  ],
  Monk: [
    { name: "Ki Points", maxFormula: "level", resetOn: "short" },
  ],
  Paladin: [
    { name: "Lay on Hands", maxFormula: "level_x5", resetOn: "long" },
    { name: "Channel Divinity", maxByLevel: { 3: 1 }, resetOn: "short" },
    { name: "Divine Sense", maxFormula: "1_plus_cha", resetOn: "long" },
  ],
  Ranger: [],
  Sorcerer: [
    { name: "Sorcery Points", maxFormula: "level", resetOn: "long" },
  ],
  Warlock: [],
  Wizard: [
    { name: "Arcane Recovery", maxByLevel: { 1: 1 }, resetOn: "long" },
  ],
};

// Resolve the max value for a resource at a given level / stats
export function getResourceMax(resource, level, stats) {
  if (resource.maxByLevel) {
    let result = 0;
    for (const [lvl, val] of Object.entries(resource.maxByLevel)) {
      if (level >= Number(lvl)) result = val;
    }
    return result;
  }
  if (resource.maxFormula) {
    switch (resource.maxFormula) {
      case "level": return level;
      case "level_x5": return level * 5;
      case "cha_mod": return Math.max(1, mod(stats?.cha || 10));
      case "1_plus_cha": return 1 + Math.max(0, mod(stats?.cha || 10));
      default: return 1;
    }
  }
  return 1;
}

// Build the classResources object for a character
export function buildClassResources(className, level, stats) {
  const defs = CLASS_RESOURCES[className] || [];
  const resources = {};
  defs.forEach(res => {
    const max = getResourceMax(res, level, stats);
    if (max > 0) {
      // Determine resetOn — some resources change at higher levels
      let resetOn = res.resetOn;
      if (res.shortRestAtLevel && level >= res.shortRestAtLevel) {
        resetOn = "short";
      }
      resources[res.name] = { current: max, max, resetOn };
    }
  });
  return resources;
}
