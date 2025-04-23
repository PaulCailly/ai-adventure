import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { and, asc, desc, eq, gt, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  user,
  chat,
  type User,
  type Message,
  message,
  character,
  type Character,
  globalProgress,
  inventoryItem,
  healTimestamp,
} from "./schema";

import { zones } from "@/lib/ai/zones";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function getMostRecentChat({ userId }: { userId: string }) {
  try {
    const [recentChat] = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, userId))
      .orderBy(desc(chat.createdAt))
      .limit(1);
    return recentChat;
  } catch (error) {
    console.error("Failed to get most recent chat from database");
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(message).where(eq(message.chatId, id));
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error("Failed to save messages in database", error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error("Failed to get messages by chat id from database", error);
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error("Failed to get message by id from database");
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    return await db
      .delete(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))
      );
  } catch (error) {
    console.error(
      "Failed to delete messages by id after timestamp from database"
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error("Failed to update chat visibility in database");
    throw error;
  }
}

// Character CRUD operations
export async function createCharacter(
  characterData: Omit<Character, "id" | "createdAt">
) {
  try {
    return await db.insert(character).values({
      ...characterData,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to create character in database");
    throw error;
  }
}

export async function listCharacters() {
  try {
    return await db.select().from(character);
  } catch (error) {
    console.error("Failed to list characters from database");
    throw error;
  }
}

export async function getCharacterById({ id }: { id: string }) {
  try {
    const [selectedCharacter] = await db
      .select()
      .from(character)
      .where(eq(character.id, id));
    return selectedCharacter;
  } catch (error) {
    console.error("Failed to get character by id from database");
    throw error;
  }
}

export async function getCharactersByUserId({ userId }: { userId: string }) {
  try {
    return await db
      .select()
      .from(character)
      .where(eq(character.userId, userId))
      .orderBy(desc(character.createdAt));
  } catch (error) {
    console.error("Failed to get characters by user id from database");
    throw error;
  }
}

export async function updateCharacter({
  id,
  ...updateData
}: Partial<Character> & { id: string }) {
  try {
    return await db
      .update(character)
      .set(updateData)
      .where(eq(character.id, id));
  } catch (error) {
    console.error("Failed to update character in database");
    throw error;
  }
}

export async function deleteCharacter({ id }: { id: string }) {
  try {
    return await db.delete(character).where(eq(character.id, id));
  } catch (error) {
    console.error("Failed to delete character from database");
    throw error;
  }
}

// Global Progress operations
export async function getGlobalProgress() {
  try {
    const [progress] = await db.select().from(globalProgress).limit(1);
    return progress;
  } catch (error) {
    console.error("Failed to get global progress from database");
    throw error;
  }
}

export async function createGlobalProgress() {
  try {
    const now = new Date();
    return await db
      .insert(globalProgress)
      .values({ id: 1, xp: 0, lastUpdated: now })
      .returning();
  } catch (error) {
    console.error("Failed to create global progress in database");
    throw error;
  }
}

export async function updateGlobalProgress({
  xp,
  lastUpdated,
}: {
  xp: number;
  lastUpdated: Date;
}) {
  try {
    return await db
      .update(globalProgress)
      .set({ xp, lastUpdated })
      .where(eq(globalProgress.id, 1));
  } catch (error) {
    console.error("Failed to update global progress in database");
    throw error;
  }
}

export async function updateCharacterStats({
  heroId,
  stats,
}: {
  heroId: string;
  stats: {
    health: number;
    mana: number;
    attack: number;
    defense: number;
    speed: number;
  };
}) {
  await db
    .update(character)
    .set({
      health: stats.health,
      mana: stats.mana,
      attack: stats.attack,
      defense: stats.defense,
      speed: stats.speed,
    })
    .where(eq(character.id, heroId));
}

export async function updateHero({
  heroId,
  health = 0,
  mana = 0,
  gold = 0,
}: {
  heroId: string;
  health?: number;
  mana?: number;
  gold?: number;
}) {
  try {
    const hero = await getCharacterById({ id: heroId });
    if (!hero) {
      throw new Error("Hero not found");
    }

    // Calculate the new health, ensuring it does not drop below 0.
    const updatedHealth = Math.max(0, hero.health + health);
    const updatedMana = Math.max(0, hero.mana + mana);
    const updatedGold = hero.gold + gold;

    // Update the hero's stats in the database.
    await db
      .update(character)
      .set({
        health: updatedHealth,
        mana: updatedMana,
        gold: updatedGold,
      })
      .where(eq(character.id, heroId));

    return `Stats updated successfully.`;
  } catch (error) {
    throw error;
  }
}

export async function addInventoryItem({
  heroId,
  name,
  identified,
  rarity,
  description,
  itemType,
  buffs,
}: {
  heroId: string;
  name: string;
  identified: boolean;
  rarity: string;
  description: string;
  itemType:
    | "consumable"
    | "equipable"
    | "passive"
    | "weapon"
    | "armor"
    | "accessory";
  buffs: { [key: string]: number };
}) {
  try {
    return await db.insert(inventoryItem).values({
      characterId: heroId,
      name,
      identified,
      rarity,
      description,
      itemType,
      buffs,
    });
  } catch (error) {
    console.error("Failed to add inventory item", error);
    throw error;
  }
}

export async function getInventoryItemsByCharacterId({
  characterId,
}: {
  characterId: string;
}) {
  try {
    return await db
      .select()
      .from(inventoryItem)
      .where(eq(inventoryItem.characterId, characterId))
      .orderBy(asc(inventoryItem.createdAt));
  } catch (error) {
    console.error("Failed to get inventory items for character", error);
    throw error;
  }
}

// Retrieves the heal timestamp for a character
export async function getHealTimestamp({
  characterId,
}: {
  characterId: string;
}) {
  try {
    const [record] = await db
      .select()
      .from(healTimestamp)
      .where(eq(healTimestamp.characterId, characterId));
    return record;
  } catch (error) {
    console.error("Failed to get heal timestamp", error);
    throw error;
  }
}

// Inserts or updates the heal timestamp for a character
export async function upsertHealTimestamp({
  characterId,
  lastHeal,
}: {
  characterId: string;
  lastHeal: Date;
}) {
  try {
    const existing = await getHealTimestamp({ characterId });
    if (existing) {
      return await db
        .update(healTimestamp)
        .set({ lastHeal })
        .where(eq(healTimestamp.characterId, characterId));
    } else {
      return await db.insert(healTimestamp).values({
        characterId,
        lastHeal,
      });
    }
  } catch (error) {
    console.error("Failed to update heal timestamp", error);
    throw error;
  }
}

// Function to buy an item from the market.
export async function buyItem(params: {
  character: Character;
  cost: number;
  item: {
    name: string;
    rarity: string;
    description: string;
    itemType:
      | "consumable"
      | "equipable"
      | "passive"
      | "weapon"
      | "armor"
      | "accessory";
    buffs?: { [key: string]: number };
  };
}) {
  const { character, cost, item } = params;

  if (character.gold < cost) {
    throw new Error("Not enough gold to purchase the item");
  }

  // Deduct the gold from the hero.
  await updateHero({
    heroId: character.id,
    gold: -cost,
    health: 0,
    mana: 0,
  });

  // Create a new inventory item.
  const newItem = {
    characterId: character.id,
    name: item.name,
    identified: true,
    rarity: item.rarity,
    description: item.description,
    itemType: item.itemType,
    buffs: item.buffs || {},
  };

  await db.insert(inventoryItem).values(newItem);
  return {
    message: `Item purchased successfully for ${cost} gold`,
    item: newItem,
  };
}

// Function to sell an item.
export async function sellItem(itemId: string) {
  const [item] = await db
    .select()
    .from(inventoryItem)
    .where(eq(inventoryItem.id, itemId));

  if (!item) {
    throw new Error("Item not found");
  }

  const sellValues: Record<string, number> = {
    common: 10,
    uncommon: 25,
    rare: 50,
    epic: 100,
    legendary: 200,
  };

  const sellValue = sellValues[item.rarity.toLowerCase()] || 0;

  await db.delete(inventoryItem).where(eq(inventoryItem.id, itemId));

  await updateHero({
    heroId: item.characterId,
    gold: sellValue,
    health: 0,
    mana: 0,
  });

  return {
    message: `Item sold successfully. You received ${sellValue} gold.`,
    gold: sellValue,
  };
}

// Function to improve an inventory item.
export async function improveItem(params: {
  itemId: string;
  improvementPercentage: number;
  character: Character;
}) {
  const { itemId, improvementPercentage, character } = params;

  const [item] = await db
    .select()
    .from(inventoryItem)
    .where(eq(inventoryItem.id, itemId));

  if (!item) {
    throw new Error("Item not found");
  }

  if (!["equipable", "weapon", "armor", "accessory"].includes(item.itemType)) {
    throw new Error("This item type cannot be improved");
  }

  const improvementCost = improvementPercentage * 5;

  if (character.gold < improvementCost) {
    throw new Error("Not enough gold to improve the item");
  }

  await updateHero({
    heroId: character.id,
    gold: -improvementCost,
    health: 0,
    mana: 0,
  });

  const newDescription = `${item.description} (Amélioré de ${improvementPercentage}%)`;

  await db
    .update(inventoryItem)
    .set({ description: newDescription })
    .where(eq(inventoryItem.id, itemId));

  return {
    message: `Item improved successfully for ${improvementCost} gold`,
    newDescription,
    cost: improvementCost,
  };
}

export async function discardItem({ itemId }: { itemId: string }) {
  await db.delete(inventoryItem).where(eq(inventoryItem.id, itemId));
  return { message: "Item discarded successfully" };
}

// Item generation helper types and constants
type ItemAdjective = {
  word: string;
  weight: number;
  minRarity: number; // 1 = common, 5 = legendary
  statPreference?: "attack" | "defense" | "health" | "mana" | "speed";
};

type NameComponent = {
  text: string;
  source: string;
  weight: number;
  type: "character" | "location" | "concept";
};

type Rarity = keyof typeof RARITY_LEVELS;

const RARITY_LEVELS = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
};

const ADJECTIVES: ItemAdjective[] = [
  // Attack-focused adjectives
  { word: "Féroce", weight: 1, minRarity: 1, statPreference: "attack" },
  { word: "Brutal", weight: 1, minRarity: 2, statPreference: "attack" },
  { word: "Impitoyable", weight: 1, minRarity: 3, statPreference: "attack" },
  { word: "Dévastateur", weight: 1, minRarity: 4, statPreference: "attack" },
  { word: "Titanesque", weight: 0.7, minRarity: 5, statPreference: "attack" },

  // Defense-focused adjectives
  { word: "Robuste", weight: 1, minRarity: 1, statPreference: "defense" },
  { word: "Fortifié", weight: 1, minRarity: 2, statPreference: "defense" },
  { word: "Inébranlable", weight: 1, minRarity: 3, statPreference: "defense" },
  { word: "Impénétrable", weight: 1, minRarity: 4, statPreference: "defense" },
  { word: "Adamantin", weight: 0.7, minRarity: 5, statPreference: "defense" },

  // Health-focused adjectives
  { word: "Vital", weight: 1, minRarity: 1, statPreference: "health" },
  { word: "Vigoureux", weight: 1, minRarity: 2, statPreference: "health" },
  { word: "Régénérateur", weight: 1, minRarity: 3, statPreference: "health" },
  { word: "Immortel", weight: 1, minRarity: 4, statPreference: "health" },
  { word: "Éternel", weight: 0.7, minRarity: 5, statPreference: "health" },

  // Mana-focused adjectives
  { word: "Mystique", weight: 1, minRarity: 1, statPreference: "mana" },
  { word: "Arcanique", weight: 1, minRarity: 2, statPreference: "mana" },
  { word: "Ésotérique", weight: 1, minRarity: 3, statPreference: "mana" },
  { word: "Transcendant", weight: 1, minRarity: 4, statPreference: "mana" },
  { word: "Omnipotent", weight: 0.7, minRarity: 5, statPreference: "mana" },

  // Speed-focused adjectives
  { word: "Agile", weight: 1, minRarity: 1, statPreference: "speed" },
  { word: "Véloce", weight: 1, minRarity: 2, statPreference: "speed" },
  { word: "Fulgurant", weight: 1, minRarity: 3, statPreference: "speed" },
  { word: "Supersonique", weight: 1, minRarity: 4, statPreference: "speed" },
  { word: "Célérité", weight: 0.7, minRarity: 5, statPreference: "speed" },

  // Generic quality adjectives by rarity
  { word: "Simple", weight: 1.5, minRarity: 1 },
  { word: "Raffiné", weight: 1.2, minRarity: 2 },
  { word: "Précieux", weight: 1, minRarity: 3 },
  { word: "Légendaire", weight: 0.8, minRarity: 4 },
  { word: "Divin", weight: 0.5, minRarity: 5 },
];

function extractNameComponents(): NameComponent[] {
  const components: NameComponent[] = [];

  // Process each zone
  Object.entries(zones).forEach(([zoneKey, zone]) => {
    // Extract character names from dangers
    zone.dangers.forEach((danger) => {
      if (danger.isBoss) {
        components.push({
          text: danger.name,
          source: zone.name,
          weight: 0.5, // Boss names are rarer
          type: "character",
        });
      } else {
        components.push({
          text: danger.name,
          source: zone.name,
          weight: 1,
          type: "character",
        });
      }
    });

    // Extract location names and concepts from lore
    const loreWords = zone.lore.split(/\s+/);
    const conceptRegex = /[A-Z][a-zéèêëîïôöûüç]{5,}/g;
    const concepts = zone.lore.match(conceptRegex) || [];

    concepts.forEach((concept) => {
      components.push({
        text: concept,
        source: zone.name,
        weight: 0.8,
        type: "concept",
      });
    });

    components.push({
      text: zone.name,
      source: zone.name,
      weight: 0.7,
      type: "location",
    });
  });

  return components;
}

const NAME_COMPONENTS = extractNameComponents();

function getHighestStat(buffs: Record<string, number>): string | undefined {
  const stats = ["attack", "defense", "health", "mana", "speed"];
  let maxStat: string | undefined;
  let maxValue = -Infinity;

  for (const stat of stats) {
    if (buffs[stat] && buffs[stat] > maxValue) {
      maxValue = buffs[stat];
      maxStat = stat;
    }
  }

  return maxStat;
}

function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }

  return items[0];
}

async function generateItemName(
  rarity: string,
  buffs: Record<string, number>,
  itemType: string
): Promise<{ name: string; description: string }> {
  const rarityLevel = RARITY_LEVELS[rarity.toLowerCase() as Rarity] || 1;
  const dominantStat = getHighestStat(buffs);

  // Filter adjectives by rarity and stat preference
  const validAdjectives = ADJECTIVES.filter(
    (adj) =>
      adj.minRarity <= rarityLevel &&
      (!adj.statPreference || adj.statPreference === dominantStat)
  );

  // Filter name components based on rarity
  const validComponents = NAME_COMPONENTS.filter((comp) => {
    if (rarityLevel >= 4) return true; // Epic and Legendary can use any component
    if (rarityLevel === 3) return comp.weight >= 0.7; // Rare items use medium-weight components
    return comp.weight >= 1; // Common and uncommon use only common components
  });

  // Select random components
  const adjective = weightedRandom(validAdjectives);
  const nameComponent = weightedRandom(validComponents);

  // Use AI to properly format the name in French
  const result = await generateObject({
    model: openai("gpt-4o"),
    system:
      "You are a French language expert specializing in item naming in fantasy games.",
    prompt: `
Given these components, create a grammatically correct French item name:
- Adjective: "${adjective.word}"
- Item Type: "${itemType}"
- Name Component: "${nameComponent.text}" (type: ${nameComponent.type})
- Source Location: "${nameComponent.source}"

Rules:
1. Use proper French articles and prepositions
2. Ensure correct grammatical agreement
3. Keep it concise and natural-sounding
4. Return ONLY the name and a short description, nothing else
`,
    schema: z.object({
      name: z.string().describe("The grammatically correct French item name"),
      description: z
        .string()
        .describe(
          "A short description in French, mentioning the source location"
        ),
    }),
  });

  return result.object;
}

export async function identifyItem({
  itemId,
}: {
  itemId: string;
}): Promise<{ name: string; description: string }> {
  // Retrieve the item from the database
  const [item] = await db
    .select()
    .from(inventoryItem)
    .where(eq(inventoryItem.id, itemId));
  if (!item) {
    console.error(`Item with ID ${itemId} not found`);
    throw new Error("Item not found");
  }
  if (item.identified) {
    console.warn(`Item with ID ${itemId} is already identified`);
    throw new Error("Item is already identified");
  }

  // Load the character linked to the item
  const character = await getCharacterById({ id: item.characterId });
  if (!character) {
    console.error(`Character linked to item ID ${itemId} not found`);
    throw new Error("Character not found");
  }

  // Determine the identification cost based on rarity
  const identificationCosts: Record<string, number> = {
    common: 10,
    uncommon: 25,
    rare: 50,
    epic: 100,
    legendary: 200,
  };
  const cost = identificationCosts[item.rarity.toLowerCase()] || 50;

  if (character.gold < cost) {
    console.error(
      `Character does not have enough gold to identify item ID ${itemId}`
    );
    throw new Error("Not enough gold to identify the item");
  }

  // Deduct the gold cost from the character
  await updateHero({
    heroId: character.id,
    gold: -cost,
    health: 0,
    mana: 0,
  });

  // Generate item name and description using our new system
  const { name: newName, description: newDescription } = await generateItemName(
    item.rarity,
    item.buffs as Record<string, number>,
    item.name
  );

  // Update the item record to mark it as identified and update its details
  await db
    .update(inventoryItem)
    .set({
      identified: true,
      name: newName,
      description: newDescription,
    })
    .where(eq(inventoryItem.id, itemId));

  return { name: newName, description: newDescription };
}

export async function consumeConsumableItem({
  heroId,
  itemId,
}: {
  heroId: string;
  itemId: string;
}) {
  // Retrieve the item from the database.
  const [item] = await db
    .select()
    .from(inventoryItem)
    .where(eq(inventoryItem.id, itemId));

  if (!item) {
    throw new Error("Item not found");
  }

  // Ensure this item is a consumable.
  if (
    item.itemType !== "consumable" &&
    item.itemType !== "potion" &&
    item.itemType !== "elixir" &&
    item.itemType !== "antidote"
  ) {
    throw new Error("This item is not consumable");
  }

  // Retrieve the hero to apply buffs.
  const heroData = await getCharacterById({ id: heroId });
  if (!heroData) {
    throw new Error("Hero not found");
  }

  // Extract stats for easy reading. Adjust the keys to match your typical buff usage.
  const currentHealth = heroData.health;
  const currentMana = heroData.mana;
  const healthBuff = (item.buffs as { health?: number })?.health ?? 0;
  const manaBuff = (item.buffs as { mana?: number })?.mana ?? 0;

  // Apply new stats. Adjust logic as needed for your game.
  const newHealth = Math.min(100, currentHealth + healthBuff);
  const newMana = Math.min(100, currentMana + manaBuff);

  // Update hero with buffed stats (this function already exists in queries).
  await updateHero({
    heroId,
    health: newHealth - currentHealth, // net change in health
    mana: newMana - currentMana, // net change in mana
  });

  // Remove the item from the inventory.
  await db.delete(inventoryItem).where(eq(inventoryItem.id, itemId));

  return { message: "Consumable item used successfully." };
}

export { db };
