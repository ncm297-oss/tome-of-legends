// Class-specific combat abilities that scale with level
export const CLASS_ATTACK_ABILITIES = [
  {
    className: "Rogue",
    name: "Sneak Attack",
    minLevel: 1,
    damage: (level) => `${Math.ceil(level / 2)}d6`,
    description: "Extra damage when you have advantage or an ally is within 5ft of the target.",
    type: "bonus_damage",
  },
  {
    className: "Barbarian",
    name: "Rage Damage",
    minLevel: 1,
    damage: (level) => level >= 16 ? "+4" : level >= 9 ? "+3" : "+2",
    description: "Bonus melee damage while raging.",
    type: "bonus_damage",
  },
  {
    className: "Paladin",
    name: "Divine Smite",
    minLevel: 2,
    damage: (level) => "2d8 radiant (+1d8/slot above 1st)",
    description: "Expend a spell slot when you hit with a melee weapon to deal extra radiant damage.",
    type: "bonus_damage",
  },
  {
    className: "Monk",
    name: "Martial Arts Die",
    minLevel: 1,
    damage: (level) => level >= 17 ? "d10" : level >= 11 ? "d8" : level >= 5 ? "d6" : "d4",
    description: "Unarmed strikes and monk weapons use this die for damage.",
    type: "scaling_die",
  },
  {
    className: "Monk",
    name: "Flurry of Blows",
    minLevel: 2,
    damage: (level) => {
      const die = level >= 17 ? "d10" : level >= 11 ? "d8" : level >= 5 ? "d6" : "d4";
      return `2x ${die} + WIS`;
    },
    description: "Spend 1 ki after Attack action for two unarmed strikes as a bonus action.",
    type: "action",
  },
  {
    className: "Fighter",
    name: "Action Surge",
    minLevel: 2,
    damage: () => "Extra Action",
    description: "Take one additional action on your turn. Recharges on short/long rest.",
    type: "resource",
  },
  {
    className: "Fighter",
    name: "Second Wind",
    minLevel: 1,
    damage: (level) => `1d10 + ${level} HP`,
    description: "Bonus action to regain HP. Recharges on short/long rest.",
    type: "healing",
  },
  {
    className: "Warlock",
    name: "Eldritch Blast",
    minLevel: 1,
    damage: (level) => {
      const beams = level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1;
      return `${beams}x 1d10 force`;
    },
    description: "Ranged spell attack. Additional beams at levels 5, 11, and 17.",
    type: "cantrip_scaling",
  },
  {
    className: "Sorcerer",
    name: "Metamagic",
    minLevel: 3,
    damage: () => "Modify Spells",
    description: "Spend sorcery points to twin, quicken, subtle, or empower your spells.",
    type: "resource",
  },
  {
    className: "Ranger",
    name: "Hunter's Mark",
    minLevel: 2,
    damage: () => "+1d6 per hit",
    description: "Bonus action to mark a target. Deal extra damage on each weapon hit against it.",
    type: "bonus_damage",
  },
  {
    className: "Cleric",
    name: "Channel Divinity",
    minLevel: 2,
    damage: (level) => level >= 6 ? "2/rest" : "1/rest",
    description: "Channel divine energy for domain-specific effects. Recharges on short/long rest.",
    type: "resource",
  },
  {
    className: "Druid",
    name: "Wild Shape",
    minLevel: 2,
    damage: (level) => {
      const maxCR = level >= 8 ? "1" : level >= 4 ? "1/2" : "1/4";
      return `CR ${maxCR}`;
    },
    description: "Transform into a beast you've seen. 2 uses per short/long rest.",
    type: "resource",
  },
  {
    className: "Bard",
    name: "Bardic Inspiration",
    minLevel: 1,
    damage: (level) => {
      const die = level >= 15 ? "d12" : level >= 10 ? "d10" : level >= 5 ? "d8" : "d6";
      return die;
    },
    description: "Give an ally an inspiration die to add to an ability check, attack, or save.",
    type: "resource",
  },
  {
    className: "Wizard",
    name: "Arcane Recovery",
    minLevel: 1,
    damage: (level) => `${Math.ceil(level / 2)} slot levels`,
    description: "Recover spell slots during a short rest. Total slot levels = half wizard level (rounded up).",
    type: "resource",
  },
];
