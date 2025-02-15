import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const character = pgTable("Character", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  name: text("name").notNull(),
  race: text("race").notNull(),
  class: text("class").notNull(),
  weapon: text("weapon").notNull(),
  strength: text("strength").notNull(),
  weakness: text("weakness").notNull(),
  companion: text("companion").notNull(),
  symbol: text("symbol").notNull(),
  avatar: text("avatar"),
  health: integer("health").notNull(),
  mana: integer("mana").notNull(),
  gold: integer("gold").notNull().default(20),
  attack: integer("attack").notNull(),
  defense: integer("defense").notNull(),
  speed: integer("speed").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type Character = InferSelectModel<typeof character>;

export const inventoryItem = pgTable("InventoryItem", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  characterId: uuid("characterId")
    .notNull()
    .references(() => character.id),
  name: text("name").notNull(),
  identified: boolean("identified").notNull().default(false),
  rarity: text("rarity").notNull(),
  description: text("description").notNull(),
  effect: text("effect").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type InventoryItem = InferSelectModel<typeof inventoryItem>;

export const globalProgress = pgTable("GlobalProgress", {
  id: integer("id").primaryKey().notNull().default(1),
  xp: integer("xp").notNull().default(0),
  lastUpdated: timestamp("lastUpdated").notNull().defaultNow(),
});

export type GlobalProgress = InferSelectModel<typeof globalProgress>;

export const healTimestamp = pgTable("HealTimestamp", {
  characterId: uuid("characterId")
    .notNull()
    .references(() => character.id),
  lastHeal: timestamp("lastHeal").notNull(),
});

export type HealTimestamp = InferSelectModel<typeof healTimestamp>;
