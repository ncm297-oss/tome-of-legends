export const RACES = [
  // ===================== PHB Races =====================
  {
    name: "Human",
    asi: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    speed: 30,
    traits: ["Extra Language", "Extra Skill"],
    description:
      "Humans are the most adaptable and ambitious of the common races. They are diverse in their tastes, morals, and customs, thriving in every corner of the world.",
    traitDescriptions: {
      "Extra Language":
        "You can speak, read, and write one extra language of your choice.",
      "Extra Skill":
        "You gain proficiency in one skill of your choice.",
    },
  },
  {
    name: "Elf (High)",
    asi: { dex: 2, int: 1 },
    speed: 30,
    traits: ["Darkvision", "Fey Ancestry", "Trance", "Keen Senses", "Cantrip"],
    description:
      "High Elves are the most magically inclined of the elven subraces, valuing study and mastery of both sword and spell. They dwell in ancient cities of breathtaking beauty.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Fey Ancestry":
        "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
      Trance:
        "You don't need to sleep. Instead, you meditate deeply for 4 hours a day.",
      "Keen Senses": "You have proficiency in the Perception skill.",
      Cantrip:
        "You know one cantrip of your choice from the wizard spell list.",
    },
  },
  {
    name: "Elf (Wood)",
    asi: { dex: 2, wis: 1 },
    speed: 35,
    traits: [
      "Darkvision",
      "Fey Ancestry",
      "Trance",
      "Keen Senses",
      "Fleet of Foot",
      "Mask of the Wild",
    ],
    description:
      "Wood Elves are reclusive and distrustful of non-elves, dwelling deep within ancient forests. They possess keen senses and an uncanny ability to move swiftly and stealthily through their native terrain.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Fey Ancestry":
        "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
      Trance:
        "You don't need to sleep. Instead, you meditate deeply for 4 hours a day.",
      "Keen Senses": "You have proficiency in the Perception skill.",
      "Fleet of Foot": "Your base walking speed is 35 feet.",
      "Mask of the Wild":
        "You can attempt to hide even when only lightly obscured by natural phenomena.",
    },
  },
  {
    name: "Elf (Drow)",
    asi: { dex: 2, cha: 1 },
    speed: 30,
    traits: [
      "Superior Darkvision",
      "Fey Ancestry",
      "Trance",
      "Keen Senses",
      "Sunlight Sensitivity",
      "Drow Magic",
    ],
    description:
      "Drow are dark elves who dwell in the Underdark, a vast subterranean realm. Banished from the surface long ago, their society is defined by intrigue, cruelty, and devotion to the goddess Lolth.",
    traitDescriptions: {
      "Superior Darkvision":
        "You can see in dim light within 120 feet as if it were bright light.",
      "Fey Ancestry":
        "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
      Trance:
        "You don't need to sleep. Instead, you meditate deeply for 4 hours a day.",
      "Keen Senses": "You have proficiency in the Perception skill.",
      "Sunlight Sensitivity":
        "You have disadvantage on attack rolls and Perception checks in direct sunlight.",
      "Drow Magic":
        "You know the dancing lights cantrip, and gain faerie fire and darkness as you level up.",
    },
  },
  {
    name: "Dwarf (Hill)",
    asi: { con: 2, wis: 1 },
    speed: 25,
    traits: [
      "Darkvision",
      "Dwarven Resilience",
      "Stonecunning",
      "Dwarven Toughness",
    ],
    description:
      "Hill Dwarves are stout and hardy, possessing keen intuition and remarkable resilience. They tend to form close-knit clans in rolling hills and shallow mines.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Dwarven Resilience":
        "You have advantage on saving throws against poison and resistance to poison damage.",
      Stonecunning:
        "You gain double proficiency bonus on History checks related to stonework.",
      "Dwarven Toughness":
        "Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.",
    },
  },
  {
    name: "Dwarf (Mountain)",
    asi: { con: 2, str: 2 },
    speed: 25,
    traits: [
      "Darkvision",
      "Dwarven Resilience",
      "Stonecunning",
      "Dwarven Armor Training",
    ],
    description:
      "Mountain Dwarves are strong and hardy, accustomed to life in rugged terrain. They are renowned warriors and master smiths who carve mighty strongholds deep within the mountains.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Dwarven Resilience":
        "You have advantage on saving throws against poison and resistance to poison damage.",
      Stonecunning:
        "You gain double proficiency bonus on History checks related to stonework.",
      "Dwarven Armor Training":
        "You have proficiency with light and medium armor.",
    },
  },
  {
    name: "Halfling (Lightfoot)",
    asi: { dex: 2, cha: 1 },
    speed: 25,
    traits: ["Lucky", "Brave", "Halfling Nimbleness", "Naturally Stealthy"],
    description:
      "Lightfoot Halflings are friendly and gregarious, inclined to get along with others and prone to wanderlust. They are adept at blending into crowds and slipping out of sight.",
    traitDescriptions: {
      Lucky: "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll and must use the new roll.",
      Brave:
        "You have advantage on saving throws against being frightened.",
      "Halfling Nimbleness":
        "You can move through the space of any creature that is of a size larger than yours.",
      "Naturally Stealthy":
        "You can attempt to hide even when obscured only by a creature at least one size larger than you.",
    },
  },
  {
    name: "Halfling (Stout)",
    asi: { dex: 2, con: 1 },
    speed: 25,
    traits: ["Lucky", "Brave", "Halfling Nimbleness", "Stout Resilience"],
    description:
      "Stout Halflings are hardier than their lightfoot kin, rumored to have dwarven blood in their veins. They are tough and resistant to poisons of all kinds.",
    traitDescriptions: {
      Lucky: "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll and must use the new roll.",
      Brave:
        "You have advantage on saving throws against being frightened.",
      "Halfling Nimbleness":
        "You can move through the space of any creature that is of a size larger than yours.",
      "Stout Resilience":
        "You have advantage on saving throws against poison and resistance to poison damage.",
    },
  },
  {
    name: "Gnome (Forest)",
    asi: { int: 2, dex: 1 },
    speed: 25,
    traits: [
      "Darkvision",
      "Gnome Cunning",
      "Natural Illusionist",
      "Speak with Small Beasts",
    ],
    description:
      "Forest Gnomes are reclusive and secretive, dwelling in hidden communities deep in the woodlands. They have a natural talent for illusion magic and can communicate with small animals.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Gnome Cunning":
        "You have advantage on Intelligence, Wisdom, and Charisma saving throws against magic.",
      "Natural Illusionist":
        "You know the minor illusion cantrip, using Intelligence as your spellcasting ability.",
      "Speak with Small Beasts":
        "You can communicate simple ideas with Small or smaller beasts.",
    },
  },
  {
    name: "Gnome (Rock)",
    asi: { int: 2, con: 1 },
    speed: 25,
    traits: [
      "Darkvision",
      "Gnome Cunning",
      "Artificer's Lore",
      "Tinker",
    ],
    description:
      "Rock Gnomes are inventive and hardy, known for their love of tinkering and their boundless curiosity. They are natural engineers who delight in constructing clever devices and gadgets.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Gnome Cunning":
        "You have advantage on Intelligence, Wisdom, and Charisma saving throws against magic.",
      "Artificer's Lore":
        "You gain double proficiency bonus on History checks related to magic items, alchemical objects, or technological devices.",
      Tinker:
        "You can spend 1 hour and 10 gp to construct a Tiny clockwork device (AC 5, 1 hp).",
    },
  },
  {
    name: "Half-Elf",
    asi: { cha: 2 },
    customAsi: 2,
    speed: 30,
    traits: ["Darkvision", "Fey Ancestry", "Skill Versatility"],
    description:
      "Half-Elves combine the best qualities of humans and elves, walking in two worlds but truly belonging to neither. They are charismatic and versatile, often serving as diplomats and wanderers.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Fey Ancestry":
        "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
      "Skill Versatility":
        "You gain proficiency in two skills of your choice.",
    },
  },
  {
    name: "Half-Orc",
    asi: { str: 2, con: 1 },
    speed: 30,
    traits: [
      "Darkvision",
      "Menacing",
      "Relentless Endurance",
      "Savage Attacks",
    ],
    description:
      "Half-Orcs bear the physical strength and endurance of their orc heritage tempered by their human blood. They are fierce warriors who must constantly prove themselves in both human and orc societies.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      Menacing: "You have proficiency in the Intimidation skill.",
      "Relentless Endurance":
        "When you are reduced to 0 hit points but not killed, you drop to 1 hit point instead (once per long rest).",
      "Savage Attacks":
        "When you score a critical hit with a melee weapon, you roll one additional damage die.",
    },
  },
  {
    name: "Tiefling",
    asi: { cha: 2, int: 1 },
    speed: 30,
    traits: ["Darkvision", "Hellish Resistance", "Infernal Legacy"],
    description:
      "Tieflings bear the mark of an infernal heritage, with horns, tails, and otherworldly eyes that betray their fiendish bloodline. Despite the suspicion they face, many tieflings prove to be steadfast allies and cunning adventurers.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Hellish Resistance": "You have resistance to fire damage.",
      "Infernal Legacy":
        "You know the thaumaturgy cantrip, and gain hellish rebuke and darkness as you level up.",
    },
  },
  {
    name: "Dragonborn",
    asi: { str: 2, cha: 1 },
    speed: 30,
    traits: ["Draconic Ancestry", "Breath Weapon", "Damage Resistance"],
    description:
      "Dragonborn are proud, honorable beings who trace their lineage to the mighty dragons. They are born with scales, a breath weapon, and an unwavering sense of clan loyalty.",
    traitDescriptions: {
      "Draconic Ancestry":
        "You choose one type of dragon, which determines your breath weapon and damage resistance.",
      "Breath Weapon":
        "You can use your action to exhale destructive energy in an area, dealing damage based on your draconic ancestry.",
      "Damage Resistance":
        "You have resistance to the damage type associated with your draconic ancestry.",
    },
  },

  // ===================== Sourcebook Races =====================
  {
    name: "Aasimar",
    asi: { cha: 2 },
    speed: 30,
    traits: [
      "Darkvision",
      "Celestial Resistance",
      "Healing Hands",
      "Light Bearer",
    ],
    description:
      "Aasimar are touched by celestial power, bearing the light of the heavens within their souls. They are often driven by an inner guide to champion justice and fight against darkness.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Celestial Resistance":
        "You have resistance to necrotic and radiant damage.",
      "Healing Hands":
        "As an action, you can touch a creature and restore hit points equal to your level (once per long rest).",
      "Light Bearer": "You know the light cantrip.",
    },
  },
  {
    name: "Firbolg",
    asi: { wis: 2, str: 1 },
    speed: 30,
    traits: [
      "Firbolg Magic",
      "Hidden Step",
      "Powerful Build",
      "Speech of Beast and Leaf",
    ],
    description:
      "Firbolgs are gentle giants who prefer to live in secluded forest communities far from civilization. They are deeply connected to nature and use their innate magic to protect their woodland homes.",
    traitDescriptions: {
      "Firbolg Magic":
        "You can cast detect magic and disguise self once each per short or long rest.",
      "Hidden Step":
        "As a bonus action, you can turn invisible until the start of your next turn (once per short or long rest).",
      "Powerful Build":
        "You count as one size larger when determining carrying capacity and weight you can push, drag, or lift.",
      "Speech of Beast and Leaf":
        "You can communicate simple ideas to beasts and plants, and have advantage on Charisma checks to influence them.",
    },
  },
  {
    name: "Goliath",
    asi: { str: 2, con: 1 },
    speed: 30,
    traits: [
      "Natural Athlete",
      "Stone's Endurance",
      "Powerful Build",
      "Mountain Born",
    ],
    description:
      "Goliaths are massive, competitive beings who dwell in the highest mountain peaks. They live by a code of fair play and self-sufficiency, constantly pushing themselves to overcome any challenge.",
    traitDescriptions: {
      "Natural Athlete":
        "You have proficiency in the Athletics skill.",
      "Stone's Endurance":
        "When you take damage, you can use your reaction to roll a d12 + Con modifier and reduce the damage by that amount (once per short or long rest).",
      "Powerful Build":
        "You count as one size larger when determining carrying capacity and weight you can push, drag, or lift.",
      "Mountain Born":
        "You are acclimated to high altitude and naturally adapted to cold climates.",
    },
  },
  {
    name: "Kenku",
    asi: { dex: 2, wis: 1 },
    speed: 30,
    traits: ["Expert Forgery", "Kenku Training", "Mimicry"],
    description:
      "Kenku are flightless, raven-like humanoids cursed to lack true creativity and the ability to speak with their own voices. They survive through mimicry, copying the sounds they hear and the works of others with uncanny precision.",
    traitDescriptions: {
      "Expert Forgery":
        "You can duplicate other creatures' handwriting and craftwork with advantage on checks to produce forgeries.",
      "Kenku Training":
        "You gain proficiency in two of the following skills: Acrobatics, Deception, Stealth, or Sleight of Hand.",
      Mimicry:
        "You can mimic sounds and voices you have heard; a creature that hears you can tell it's an imitation with a Wisdom (Insight) check.",
    },
  },
  {
    name: "Lizardfolk",
    asi: { con: 2, wis: 1 },
    speed: 30,
    traits: [
      "Bite",
      "Cunning Artisan",
      "Hold Breath",
      "Hunter's Lore",
      "Natural Armor",
      "Hungry Jaws",
    ],
    description:
      "Lizardfolk are cold-blooded reptilian humanoids who view the world through a pragmatic, alien lens. They dwell in swamps and marshes, surviving through a combination of primal instinct and surprising cunning.",
    traitDescriptions: {
      Bite: "Your fanged maw is a natural weapon dealing 1d6 + Str modifier piercing damage.",
      "Cunning Artisan":
        "During a short rest, you can harvest bone and hide from a slain creature to craft a shield, club, javelin, or darts.",
      "Hold Breath": "You can hold your breath for up to 15 minutes at a time.",
      "Hunter's Lore":
        "You gain proficiency in two of the following skills: Animal Handling, Nature, Perception, Stealth, or Survival.",
      "Natural Armor":
        "Your AC is 13 + Dexterity modifier when not wearing armor.",
      "Hungry Jaws":
        "As a bonus action, you can make a bite attack and gain temporary hit points equal to your Con modifier (once per short or long rest).",
    },
  },
  {
    name: "Tabaxi",
    asi: { dex: 2, cha: 1 },
    speed: 30,
    traits: [
      "Darkvision",
      "Feline Agility",
      "Cat's Claws",
      "Cat's Talent",
    ],
    description:
      "Tabaxi are feline humanoids driven by an insatiable curiosity that compels them to collect stories, artifacts, and lore. They are graceful and quick, hailing from distant and exotic lands.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Feline Agility":
        "When you move on your turn, you can double your speed until the end of the turn (recharges when you spend a turn not moving).",
      "Cat's Claws":
        "Your claws are natural weapons dealing 1d4 + Str modifier slashing damage, and grant a climbing speed of 20 feet.",
      "Cat's Talent":
        "You have proficiency in the Perception and Stealth skills.",
    },
  },
  {
    name: "Triton",
    asi: { str: 1, con: 1, cha: 1 },
    speed: 30,
    traits: [
      "Amphibious",
      "Control Air and Water",
      "Darkvision",
      "Emissary of the Sea",
      "Guardians of the Depths",
    ],
    description:
      "Tritons are aquatic humanoids who serve as noble guardians of the ocean depths. They left their home in the Elemental Plane of Water long ago to protect the mortal world from undersea threats.",
    traitDescriptions: {
      Amphibious: "You can breathe air and water.",
      "Control Air and Water":
        "You can cast fog cloud, gust of wind, and wall of water as you level up (once each per long rest).",
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Emissary of the Sea":
        "You can communicate simple ideas with beasts that can breathe water.",
      "Guardians of the Depths":
        "You are adapted to the extreme cold and pressure of the deep ocean.",
    },
  },
  {
    name: "Yuan-Ti Pureblood",
    asi: { cha: 2, int: 1 },
    speed: 30,
    traits: [
      "Darkvision",
      "Innate Spellcasting",
      "Magic Resistance",
      "Poison Immunity",
    ],
    description:
      "Yuan-Ti Purebloods are the most human-looking of the serpent folk, able to pass as human with minor disguise. They are cunning, emotionless schemers who view other races as tools or prey.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Innate Spellcasting":
        "You know the poison spray cantrip and can cast animal friendship on snakes at will, plus suggestion once per long rest.",
      "Magic Resistance":
        "You have advantage on saving throws against spells and other magical effects.",
      "Poison Immunity":
        "You are immune to poison damage and the poisoned condition.",
    },
  },
  {
    name: "Bugbear",
    asi: { str: 2, dex: 1 },
    speed: 30,
    traits: [
      "Darkvision",
      "Long-Limbed",
      "Powerful Build",
      "Sneaky",
      "Surprise Attack",
    ],
    description:
      "Bugbears are massive, hairy goblinoids who rely on stealth and ambush despite their imposing size. They are lazy but lethal predators who strike from the shadows with devastating force.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Long-Limbed":
        "Your reach for melee attacks on your turn is 5 feet greater than normal.",
      "Powerful Build":
        "You count as one size larger when determining carrying capacity and weight you can push, drag, or lift.",
      Sneaky: "You have proficiency in the Stealth skill.",
      "Surprise Attack":
        "If you hit a surprised creature on the first round of combat, it takes an extra 2d6 damage.",
    },
  },
  {
    name: "Goblin",
    asi: { dex: 2, con: 1 },
    speed: 30,
    traits: ["Darkvision", "Fury of the Small", "Nimble Escape"],
    description:
      "Goblins are small, cunning creatures who survive through sheer tenacity and quick wits. Though often underestimated, they are resourceful survivors who can be surprisingly dangerous in groups.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Fury of the Small":
        "When you damage a creature larger than you, you deal extra damage equal to your level (once per short or long rest).",
      "Nimble Escape":
        "You can take the Disengage or Hide action as a bonus action on each of your turns.",
    },
  },
  {
    name: "Hobgoblin",
    asi: { con: 2, int: 1 },
    speed: 30,
    traits: ["Darkvision", "Martial Training", "Saving Face"],
    description:
      "Hobgoblins are disciplined and militaristic goblinoids who prize order, strategy, and martial prowess above all. They build vast, regimented armies and wage war with tactical precision.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Martial Training":
        "You have proficiency with two martial weapons of your choice and light armor.",
      "Saving Face":
        "When you miss an attack or fail a check or save, you gain a bonus equal to the number of allies you can see (max +5).",
    },
  },
  {
    name: "Kobold",
    asi: { dex: 2 },
    speed: 30,
    traits: [
      "Darkvision",
      "Grovel, Cower, and Beg",
      "Pack Tactics",
      "Sunlight Sensitivity",
    ],
    description:
      "Kobolds are small, reptilian creatures who claim kinship with dragons and worship them as near-deities. They are crafty trap-makers who use cunning and numbers to overcome their physical frailty.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Grovel, Cower, and Beg":
        "As an action, allies gain advantage on attack rolls against enemies within 10 feet of you until your next turn.",
      "Pack Tactics":
        "You have advantage on attack rolls against a creature if at least one of your allies is within 5 feet of it.",
      "Sunlight Sensitivity":
        "You have disadvantage on attack rolls and Perception checks in direct sunlight.",
    },
  },
  {
    name: "Orc",
    asi: { str: 2, con: 1 },
    speed: 30,
    traits: ["Darkvision", "Aggressive", "Menacing", "Powerful Build"],
    description:
      "Orcs are fierce, aggressive humanoids driven by a relentless need to conquer and dominate. They worship the god Gruumsh and organize into warlike tribes that raid and pillage across the land.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      Aggressive:
        "As a bonus action, you can move up to your speed toward a hostile creature you can see.",
      Menacing: "You have proficiency in the Intimidation skill.",
      "Powerful Build":
        "You count as one size larger when determining carrying capacity and weight you can push, drag, or lift.",
    },
  },
  {
    name: "Githyanki",
    asi: { str: 2, int: 1 },
    speed: 30,
    traits: [
      "Darkvision",
      "Githyanki Psionics",
      "Martial Prodigy",
      "Decadent Mastery",
    ],
    description:
      "Githyanki are fierce astral warriors who escaped the enslavement of the mind flayers through brutal rebellion. They now wage endless war from fortresses in the Astral Plane, riding red dragons into battle.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Githyanki Psionics":
        "You know the mage hand cantrip and gain jump and misty step as you level up.",
      "Martial Prodigy":
        "You have proficiency with light and medium armor and with shortswords, longswords, and greatswords.",
      "Decadent Mastery":
        "You gain proficiency in one skill or tool of your choice.",
    },
  },
  {
    name: "Githzerai",
    asi: { wis: 2, int: 1 },
    speed: 30,
    traits: [
      "Darkvision",
      "Githzerai Psionics",
      "Mental Discipline",
    ],
    description:
      "Githzerai are contemplative monks who dwell in the ever-shifting chaos of Limbo, shaping reality through sheer force of will. They seek inner peace and mental perfection to counter the chaos that surrounds them.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Githzerai Psionics":
        "You know the mage hand cantrip and gain shield and detect thoughts as you level up.",
      "Mental Discipline":
        "You have advantage on saving throws against the charmed and frightened conditions.",
    },
  },
  {
    name: "Changeling",
    asi: { cha: 2 },
    speed: 30,
    traits: ["Changeling Instincts", "Shapechanger"],
    description:
      "Changelings are subtle shapeshifters who can alter their appearance at will, making them consummate spies and social chameleons. Many struggle with questions of identity, never certain which face is truly their own.",
    traitDescriptions: {
      "Changeling Instincts":
        "You gain proficiency in two of the following skills: Deception, Insight, Intimidation, or Persuasion.",
      Shapechanger:
        "As an action, you can change your appearance and voice to match another humanoid you have seen.",
    },
  },
  {
    name: "Kalashtar",
    asi: { wis: 2, cha: 1 },
    speed: 30,
    traits: [
      "Dual Mind",
      "Mental Discipline",
      "Mind Link",
      "Severed from Dreams",
    ],
    description:
      "Kalashtar are a compound race created from the union of humanity and renegade spirits from the plane of dreams. They are thoughtful, compassionate beings who wage a secret war against the forces of nightmare.",
    traitDescriptions: {
      "Dual Mind":
        "You have advantage on all Wisdom saving throws.",
      "Mental Discipline":
        "You have resistance to psychic damage.",
      "Mind Link":
        "You can speak telepathically to any creature within 10 times your level in feet.",
      "Severed from Dreams":
        "You are immune to spells and effects that require you to dream.",
    },
  },
  {
    name: "Shifter",
    asi: { dex: 1 },
    speed: 30,
    traits: ["Darkvision", "Shifting"],
    description:
      "Shifters are descendants of humans and lycanthropes, retaining a bestial aspect that they can unleash in moments of stress. They are often distrusted but make fiercely loyal allies who walk the line between civilization and the wild.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      Shifting:
        "As a bonus action, you can assume a more bestial form for 1 minute, gaining temporary hit points and a subrace-specific benefit (once per short or long rest).",
    },
  },
  {
    name: "Warforged",
    asi: { con: 2 },
    speed: 30,
    traits: [
      "Constructed Resilience",
      "Sentry's Rest",
      "Integrated Protection",
      "Specialized Design",
    ],
    description:
      "Warforged are living constructs originally built as soldiers for a devastating war. Now free, they struggle to find purpose and identity in a world that sees them as weapons rather than people.",
    traitDescriptions: {
      "Constructed Resilience":
        "You have resistance to poison damage, advantage on saves against poison, immunity to disease, and don't need to eat, drink, or breathe.",
      "Sentry's Rest":
        "You don't need to sleep; instead you enter an inactive state for 6 hours during which you remain conscious.",
      "Integrated Protection":
        "Your body provides a base AC of 11 + your proficiency bonus (no armor needed), and you can incorporate armor into your body.",
      "Specialized Design":
        "You gain one skill proficiency and one tool proficiency of your choice.",
    },
  },
  {
    name: "Centaur",
    asi: { str: 2, wis: 1 },
    speed: 40,
    traits: ["Fey", "Charge", "Hooves", "Equine Build"],
    description:
      "Centaurs are noble fey creatures with the upper body of a humanoid and the lower body of a horse. They roam open plains and ancient forests, valuing freedom, community, and the thrill of the charge.",
    traitDescriptions: {
      Fey: "Your creature type is fey rather than humanoid.",
      Charge:
        "If you move at least 30 feet straight toward a target and then hit it with a melee weapon attack, you deal an extra 1d6 damage.",
      Hooves:
        "Your hooves are natural weapons dealing 1d4 + Str modifier bludgeoning damage.",
      "Equine Build":
        "You count as one size larger for carrying capacity, and climbing costs you 4 extra feet of movement per foot climbed.",
    },
  },
  {
    name: "Loxodon",
    asi: { con: 2, wis: 1 },
    speed: 30,
    traits: [
      "Natural Armor",
      "Loxodon Serenity",
      "Keen Smell",
      "Trunk",
    ],
    description:
      "Loxodons are massive, elephant-like humanoids known for their calm wisdom and deep sense of loyalty. They are natural mediators and steadfast protectors who never forget a friend or a foe.",
    traitDescriptions: {
      "Natural Armor":
        "Your thick skin provides an AC of 12 + Constitution modifier when not wearing armor.",
      "Loxodon Serenity":
        "You have advantage on saving throws against being charmed or frightened.",
      "Keen Smell":
        "You have advantage on Wisdom (Perception), Wisdom (Survival), and Intelligence (Investigation) checks that involve smell.",
      Trunk:
        "Your trunk can grasp things, lift up to 5 times your Strength score in pounds, and act as a snorkel.",
    },
  },
  {
    name: "Minotaur",
    asi: { str: 2, con: 1 },
    speed: 30,
    traits: ["Horns", "Goring Rush", "Hammering Horns", "Labyrinthine Recall"],
    description:
      "Minotaurs are powerful, bull-headed humanoids who combine brute strength with a surprisingly keen sense of direction. They are fierce warriors who charge headlong into battle with their formidable horns.",
    traitDescriptions: {
      Horns:
        "Your horns are natural melee weapons dealing 1d6 + Str modifier piercing damage.",
      "Goring Rush":
        "When you use the Dash action and move at least 20 feet, you can make a horn attack as a bonus action.",
      "Hammering Horns":
        "After hitting with a melee attack on your turn, you can use a bonus action to push the target 10 feet away.",
      "Labyrinthine Recall":
        "You can perfectly recall any path you have traveled.",
    },
  },
  {
    name: "Simic Hybrid",
    asi: { con: 2 },
    speed: 30,
    traits: ["Darkvision", "Animal Enhancement"],
    description:
      "Simic Hybrids are beings who have been magically enhanced with animal adaptations by the Simic Combine. Each hybrid is a unique fusion of humanoid and beast, equipped with biological tools for survival.",
    traitDescriptions: {
      Darkvision:
        "You can see in dim light within 60 feet as if it were bright light.",
      "Animal Enhancement":
        "At 1st level you gain one animal enhancement (Manta Glide, Nimble Climber, or Underwater Adaptation), and a second at 5th level.",
    },
  },
  {
    name: "Vedalken",
    asi: { int: 2, wis: 1 },
    speed: 30,
    traits: [
      "Vedalken Dispassion",
      "Tireless Precision",
      "Partially Amphibious",
    ],
    description:
      "Vedalken are tall, blue-skinned humanoids driven by an insatiable desire for knowledge and self-improvement. They approach every problem with cold logic and meticulous attention to detail, always striving for perfection.",
    traitDescriptions: {
      "Vedalken Dispassion":
        "You have advantage on Intelligence, Wisdom, and Charisma saving throws.",
      "Tireless Precision":
        "You gain proficiency in one skill and one tool of your choice, and can add 1d4 to a check with that skill or tool.",
      "Partially Amphibious":
        "You can breathe underwater for up to 1 hour, after which you need to spend at least 1 minute in air.",
    },
  },

  // ===================== Homebrew =====================
  {
    name: "Homebrew",
    asi: {},
    traits: [],
    speed: 30,
    description: "A custom race of your own design.",
    traitDescriptions: {},
    homebrew: true,
  },
];
