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
  vote,
  character,
  type Character,
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
    await db.delete(vote).where(eq(vote.chatId, id));
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

export async function getCharactersByChatId({ chatId }: { chatId: string }) {
  try {
    return await db
      .select()
      .from(character)
      .where(eq(character.chatId, chatId))
      .orderBy(desc(character.createdAt));
  } catch (error) {
    console.error("Failed to get characters by chat id from database");
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
