// Start of Selection
import { InventoryItem } from "@/lib/db/schema";
import { generateUUID } from "@/lib/utils";

export type ItemQuality = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemSlot = "weapon" | "armor" | "accessory";

// Calculate the item's budget based on its level.
// Here we assume every 15 item levels increases the budget by 15%.
function calculateBudget(itemLevel: number): number {
  const baseBudget = 1;
  return baseBudget * Math.pow(1.15, itemLevel / 15);
}

// New stat multipliers: each function uses the item level to scale the bonus.
const statMultipliers = {
  attack: 1,
  defense: (itemLevel: number) => 0.5 * itemLevel + 10,
  health: (itemLevel: number) => 0.7 * itemLevel + 15,
  mana: (itemLevel: number) => 0.3 * itemLevel + 5,
  speed: (itemLevel: number) => 0.2 * itemLevel + 3,
};

// New quality distributions that split the budget among all five stats.
// The percentages add up to 1 for each quality.
const qualityDistribution: Record<
  ItemQuality,
  {
    attack: number;
    defense: number;
    health: number;
    mana: number;
    speed: number;
  }
> = {
  common: {
    attack: 0.3,
    defense: 0.3,
    health: 0.25,
    mana: 0.075,
    speed: 0.075,
  },
  uncommon: {
    attack: 0.28,
    defense: 0.28,
    health: 0.27,
    mana: 0.085,
    speed: 0.085,
  },
  rare: { attack: 0.26, defense: 0.26, health: 0.3, mana: 0.09, speed: 0.09 },
  epic: { attack: 0.24, defense: 0.24, health: 0.32, mana: 0.1, speed: 0.1 },
  legendary: {
    attack: 0.22,
    defense: 0.22,
    health: 0.34,
    mana: 0.11,
    speed: 0.11,
  },
};

// Define base names for various item slots.
const baseNames: Record<ItemSlot, string[]> = {
  weapon: [
    "Épée",
    "Hache",
    "Dague",
    "Lance",
    "Arc",
    "Masse",
    "Faux",
    "Bâton",
    "Fléau",
    "Glaive",
    "Sabre",
    "Katana",
    "Trident",
    "Couteau",
    "Marteau",
    "Pique",
    "Gourdin",
    "Fronde",
    "Arbalète",
    "Cimeterre",
    "Claymore",
    "Javelot",
  ],
  armor: [
    "Plastron",
    "Heaume",
    "Grèves",
    "Casque",
    "Jambières",
    "Gantelets",
    "Bouclier",
    "Brassards",
    "Spallières",
    "Cuissardes",
    "Brassière",
    "Haubert",
    "Gambison",
    "Brigandine",
    "Cagoule",
    "Cervelière",
    "Cuirasse",
    "Garde",
    "Cape",
    "Bottes",
    "Ceinture",
  ],
  accessory: [
    "Bague",
    "Amulette",
    "Bracelet",
    "Collier",
    "Talisman",
    "Médaillon",
    "Broche",
    "Pendentif",
    "Charme",
    "Gemme",
    "Sceau",
    "Diadème",
    "Anneau",
    "Chapelet",
  ],
};

// Revised buffs assignment function.
// It now receives computed values for all five stats and then adjusts them based on item type.
function getBuffsForSlot(
  slot: ItemSlot,
  computedStats: {
    attack: number;
    defense: number;
    health: number;
    mana: number;
    speed: number;
  }
) {
  switch (slot) {
    case "weapon":
      // Weapons: emphasize attack and speed, with a slight reduction to mana.
      return {
        attack: Math.round(computedStats.attack * 1.1),
        defense: Math.round(computedStats.defense * 0.8),
        health: Math.round(computedStats.health * 0.9),
        mana: Math.round(computedStats.mana * 0.5),
        speed: Math.round(computedStats.speed * 1.2),
      };
    case "armor":
      // Armor: emphasize defense and health, with moderate boosts for mana; speed might be lower.
      return {
        attack: Math.round(computedStats.attack * 0.6),
        defense: Math.round(computedStats.defense * 1.2),
        health: Math.round(computedStats.health * 1.1),
        mana: Math.round(computedStats.mana * 0.8),
        speed: Math.round(computedStats.speed * 0.8),
      };
    case "accessory":
    default:
      // Accessories: more balanced with a slight boost in mana.
      return {
        attack: Math.round(computedStats.attack * 0.8),
        defense: Math.round(computedStats.defense * 0.8),
        health: Math.round(computedStats.health * 0.9),
        mana: Math.round(computedStats.mana * 1.1),
        speed: Math.round(computedStats.speed * 0.9),
      };
  }
}

/**
 * Generates a dynamic loot item with stat distributions coherent
 * to slot and quality across all five stats.
 *
 * @param options.itemLevel - The level of the loot item.
 * @param options.quality - The quality (rarity) of the item.
 * @param options.slot - The item slot/type (e.g., weapon, armor, accessory).
 * @returns a new InventoryItem object.
 */
export function generateLootItem(options: {
  itemLevel: number;
  quality: ItemQuality;
  slot: ItemSlot;
}): InventoryItem {
  const { itemLevel, quality, slot } = options;
  const budget = calculateBudget(itemLevel);
  const distribution = qualityDistribution[quality];

  // Calculate raw stat values for all five attributes.
  const attackValue = budget * distribution.attack * statMultipliers.attack;
  const defenseValue =
    budget * distribution.defense * statMultipliers.defense(itemLevel);
  const healthValue =
    budget * distribution.health * statMultipliers.health(itemLevel);
  const manaValue =
    budget * distribution.mana * statMultipliers.mana(itemLevel);
  const speedValue =
    budget * distribution.speed * statMultipliers.speed(itemLevel);

  // Generate a dynamic name using zone-specific adjectives.
  const bases = baseNames[slot] || ["Item"];
  const name = bases[Math.floor(Math.random() * bases.length)];

  // Build a description that ties into the zone lore.
  const description = `Non identifié`;

  // Determine buffs from computed stats based on the item slot.
  const buffs = getBuffsForSlot(slot, {
    attack: attackValue,
    defense: defenseValue,
    health: healthValue,
    mana: manaValue,
    speed: speedValue,
  });

  return {
    id: generateUUID(),
    characterId: "0", // Placeholder; assign the actual character id when adding to inventory.
    name,
    identified: quality === "common" ? true : false,
    rarity: quality,
    description: quality === "common" ? "" : description,
    itemType: slot,
    buffs,
    createdAt: new Date(),
  };
}

/**
 * Unified loot generation with LLM-based flavor text, ensuring coherent stat allocations
 * across attack, defense, health, mana, and speed.
 */
export async function generateAndAddLootItem(options: {
  itemLevel: number;
  slot: ItemSlot;
  characterId: string;
}): Promise<InventoryItem> {
  // Determine item quality based on a random roll.
  const roll = Math.random();
  let quality: ItemQuality;
  if (roll < 0.01) {
    quality = "legendary";
  } else if (roll < 0.06) {
    quality = "epic";
  } else if (roll < 0.2) {
    quality = "rare";
  } else if (roll < 0.5) {
    quality = "uncommon";
  } else {
    quality = "common";
  }

  const budget = calculateBudget(options.itemLevel);
  const distribution = qualityDistribution[quality];

  // Calculate raw stat values for all five attributes.
  const attackValue = budget * distribution.attack * statMultipliers.attack;
  const defenseValue =
    budget * distribution.defense * statMultipliers.defense(options.itemLevel);
  const healthValue =
    budget * distribution.health * statMultipliers.health(options.itemLevel);
  const manaValue =
    budget * distribution.mana * statMultipliers.mana(options.itemLevel);
  const speedValue =
    budget * distribution.speed * statMultipliers.speed(options.itemLevel);

  const bases = baseNames[options.slot] || ["Item"];
  const name = bases[Math.floor(Math.random() * bases.length)];
  const description = `Non identifié`;

  const buffs = getBuffsForSlot(options.slot, {
    attack: attackValue,
    defense: defenseValue,
    health: healthValue,
    mana: manaValue,
    speed: speedValue,
  });

  return {
    id: generateUUID(),
    characterId: options.characterId,
    name,
    identified: quality === "common" ? true : false,
    rarity: quality,
    description: quality === "common" ? "" : description,
    itemType: options.slot,
    buffs,
    createdAt: new Date(),
  };
}
