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
    console.log(
      `Current stats for hero ${heroId}: Health=${hero.health}, Mana=${hero.mana}, Gold=${hero.gold}`
    );
    const newHealth = hero.health + health;
    const newMana = hero.mana + mana;
    const newGold = hero.gold + gold;
    console.log(
      `Calculated new stats: Health=${newHealth}, Mana=${newMana}, Gold=${newGold}`
    );

    await db
      .update(character)
      .set({
        health: newHealth,
        mana: newMana,
        gold: newGold,
      })
      .where(eq(character.id, heroId));

    if (newHealth <= 0) {
      return "Vous avez été vaincu. Votre quête se termine ici";
    } else {
      return "Hero updated successfully";
    }
  } catch (error) {
    console.error("Failed to update hero in database", error);
    throw error;
  }
}

export async function addInventoryItem({
  heroId,
  name,
  identified,
  rarity,
  description,
  effect,
}: {
  heroId: string;
  name: string;
  identified: boolean;
  rarity: string;
  description: string;
  effect: string;
}) {
  try {
    return await db.insert(inventoryItem).values({
      characterId: heroId,
      name,
      identified,
      rarity,
      description,
      effect,
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

export { db };
