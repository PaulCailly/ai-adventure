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

    console.log(
      `Updated stats for hero ${heroId}: Health=${updatedHealth}, Mana=${updatedMana}, Gold=${updatedGold}`
    );
    return `Stats updated successfully.`;
  } catch (error) {
    console.error("Error updating hero", error);
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
    throw new Error("Item not found");
  }
  if (item.identified) {
    throw new Error("Item is already identified");
  }

  // Load the character linked to the item
  const character = await getCharacterById({ id: item.characterId });
  if (!character) {
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
    throw new Error("Not enough gold to identify the item");
  }

  // Deduct the gold cost from the character
  await updateHero({
    heroId: character.id,
    gold: -cost,
    health: 0,
    mana: 0,
  });

  // Build a prompt for item identification using all characteristics of the item
  const prompt = `
You are an expert in identifying mystical items.
The player presents you with an unidentified item of rarity "${item.rarity}".
Item characteristics: ${item.name}, Buffs - ${JSON.stringify(
    item.buffs
  )}, Quality - ${item.rarity}

Using the rich and diverse lore of the Forest of Ancient Whispers (below), create a unique and imaginative name that reflects the item's rarity. The name should draw inspiration from various elements such as the ancient elven civilization, the magical transformations, the ongoing struggle between factions, and the mystical ambiance of the forest. Additionally, craft a vivid description of less than 140 characters that captures the item's essence, weaving in fantastical and mysterious elements from the lore.

Rules for naming based on rarity:
- Uncommon: Use slightly more intriguing words. Examples: "Enhanced", "Refined", "Sturdy", "Improved", "Advanced", "Better", "Superior", "Upgraded", "Distinct", "Notable", "Special", "Unique".
- Rare: Use words that suggest uniqueness and value. Examples: "Exquisite", "Rare", "Valuable", "Precious", "Exceptional", "Exclusive", "Select", "Elite", "Premium", "Choice", "Distinctive", "Remarkable".
- Epic: Use grand and powerful words. Examples: "Majestic", "Mythic", "Ancient", "Heroic", "Legendary", "Noble", "Grand", "Regal", "Lofty", "Sublime", "Magnificent", "Glorious".
- Legendary: Use words that denote extreme rarity and power. Examples: "Divine", "Ethereal", "Transcendent", "Celestial", "Heavenly", "Mythical", "Godlike", "Supreme", "Ultimate", "Unparalleled", "Peerless", "Unmatched".

Rules for naming based on stats:
- High Attack: Use words like "Fierce", "Mighty", "Dominant", "Strong", "Powerful", "Aggressive", "Forceful", "Intense", "Bold", "Vigorous", "Potent", "Ferocious".
- High Defense: Use words like "Impenetrable", "Stalwart", "Guarded", "Secure", "Protected", "Fortified", "Resilient", "Tough", "Solid", "Stable", "Unyielding", "Defensive".
- High Health: Use words like "Vigorous", "Robust", "Enduring", "Healthy", "Sturdy", "Hearty", "Strong", "Durable", "Resilient", "Tough", "Solid", "Sound".
- High Mana: Use words like "Arcane", "Mystical", "Enchanted", "Magical", "Supernatural", "Otherworldly", "Mysterious", "Spiritual", "Sorcerous", "Wizardly", "Occult", "Esoteric".
- High Speed: Use words like "Swift", "Nimble", "Agile", "Quick", "Fast", "Rapid", "Brisk", "Lively", "Fleet", "Spry", "Zippy", "Speedy".

Incorporate lore elements:
- If the item belonged to a notable character, mention their influence or legacy.
- Use a wide variety of words to enrich the description, drawing from the lore's themes of ancient magic, elven history, and the forest's mystical nature.

Forest lore:
${zones.forest.lore}
`;

  // Call AI SDK to generate the item details using generateObject
  const result = await generateObject({
    model: openai("gpt-4o"),
    system: "You are an expert in identifying mystical items.",
    prompt,
    schema: z.object({
      name: z
        .string()
        .describe(
          "The name of the item. It should match the rarity of the item and be inspired by the diverse elements of the forest lore."
        ),
      description: z
        .string()
        .describe(
          "A very short sentence about the item, it can be a formal description, a quote, an anecdote, or a funny sentence."
        ),
    }),
  });
  const { name: newName, description: newDescription } = result.object;

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

export { db };
