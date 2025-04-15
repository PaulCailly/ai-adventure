interface Effect {
  name: string;
  potency: number; // Represents the strength or impact of the effect
  duration: number; // Duration in turns or time units
  chance: number; // Probability of the effect occurring
}

interface Danger {
  name: string;
  stats: {
    health: number;
    attack: number;
    defense: number;
  };
  effects: Effect[];
}

interface Treasure {
  name: string;
  stats: {
    magicPower?: number;
    durability?: number;
    healingPower?: number;
    rarity?: number;
    manaRestoration?: number;
    purity?: number;
  };
  effects: Effect[];
  value: number;
}

interface Zone {
  description: string;
  level: string;
  dangers: Danger[];
  treasures: Treasure[];
  lore: string;
}

export const zones: Record<string, Zone> = {
  forest: {
    description: `A mysterious forest where ancient trees whisper forgotten secrets.
        Shadows dance between the branches and strange glows lure travelers into the wooded depths.`,
    level: "11-15",
    dangers: [
      {
        name: "Sylvan Spirits",
        stats: {
          health: 50,
          attack: 15,
          defense: 10,
        },
        effects: [
          { name: "Possession", potency: 5, duration: 3, chance: 0.3 },
          { name: "Illusions", potency: 4, duration: 2, chance: 0.5 },
        ],
      },
      {
        name: "Corrupted Beasts",
        stats: {
          health: 80,
          attack: 20,
          defense: 15,
        },
        effects: [
          { name: "Poison", potency: 6, duration: 4, chance: 0.4 },
          { name: "Frenzy", potency: 7, duration: 3, chance: 0.2 },
        ],
      },
      {
        name: "Bandits",
        stats: {
          health: 60,
          attack: 18,
          defense: 12,
        },
        effects: [
          { name: "Ambush", potency: 5, duration: 1, chance: 0.6 },
          { name: "Steal", potency: 3, duration: 1, chance: 0.5 },
        ],
      },
    ],
    treasures: [
      {
        name: "Elven Artifacts",
        stats: {
          magicPower: 25,
          durability: 100,
        },
        effects: [
          { name: "Enhance abilities", potency: 8, duration: 5, chance: 0.7 },
          { name: "Ancient knowledge", potency: 10, duration: 6, chance: 0.5 },
        ],
        value: 500,
      },
      {
        name: "Rare Herbs",
        stats: {
          healingPower: 20,
          rarity: 8,
        },
        effects: [
          { name: "Heal wounds", potency: 10, duration: 2, chance: 0.8 },
          { name: "Boost stamina", potency: 5, duration: 3, chance: 0.6 },
        ],
        value: 150,
      },
      {
        name: "Mana Crystals",
        stats: {
          manaRestoration: 30,
          purity: 90,
        },
        effects: [
          { name: "Restore mana", potency: 12, duration: 4, chance: 0.9 },
          { name: "Enhance spells", potency: 7, duration: 5, chance: 0.7 },
        ],
        value: 300,
      },
    ],
    lore: `It is said that the Forest of Ancient Whispers was once the realm of a vanished elven civilization.
        The trees are believed to have absorbed the magic and memory of this people, creating a place where the boundary between the material and spiritual worlds blurs.`,
  },
};
