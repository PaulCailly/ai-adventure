import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { auth } from "@/app/(auth)/auth";
import { customModel } from "@/lib/ai";
import { models } from "@/lib/ai/models";
import { generateAdventurePrompt } from "@/lib/ai/prompts/adventure";
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
  getCharacterById,
  updateHero,
  addInventoryItem,
  getInventoryItemsByCharacterId,
} from "@/lib/db/queries";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";
import { object, number, string, boolean as zBoolean } from "zod";
import chalk from "chalk";
import { zones } from "@/lib/ai/zones";

export async function POST(request: Request) {
  const {
    id,
    characterId,
    messages,
    modelId,
  }: {
    id: string;
    characterId: string;
    messages: Array<Message>;
    modelId: string;
  } = await request.json();

  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response("Model not found", { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = "Into the forest";
    await saveChat({ id, userId: session.user.id, title });
  }

  const character = await getCharacterById({ id: characterId });

  if (!character) {
    return new Response("Character not found", { status: 404 });
  }

  // Retrieve the hero's current inventory.
  const inventoryItems = await getInventoryItemsByCharacterId({
    characterId,
  });

  // Map the DB items to the expected inventory item shape.
  // This strips out extra fields (like id, createdAt) and asserts that itemType is one of the allowed values.
  const formattedInventoryItems = inventoryItems.map((item) => ({
    name: item.name,
    identified: item.identified,
    rarity: item.rarity,
    description: item.description,
    itemType: item.itemType as "consumable" | "equipable" | "passive",
    buffs: item.buffs as { [key: string]: number },
  }));

  // Save the incoming user message to associate it with this chat.
  const userMessageId = generateUUID();
  await saveMessages({
    messages: [
      {
        ...userMessage,
        id: userMessageId,
        createdAt: new Date(),
        chatId: id,
      },
    ],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData({
        type: "user-message-id",
        content: userMessageId,
      });

      const result = streamText({
        model: customModel(model.apiIdentifier),
        system: generateAdventurePrompt({
          name: character.name,
          race: character.race,
          class: character.class,
          weapon: character.weapon,
          strength: character.strength,
          weakness: character.weakness,
          companion: character.companion,
          symbol: character.symbol,
          zone: "forest", // Default zone for now
          inventoryItems: formattedInventoryItems,
        }),
        messages: coreMessages,
        maxSteps: 5,
        experimental_activeTools: [
          "rollDice",
          "combatCalculation",
          "updateHero",
          "addInventoryItem",
          "generateLoot",
        ],
        tools: {
          rollDice: {
            description:
              "Used to generate a random number to introduce chance into combat.",
            parameters: object({
              sides: number().min(2).max(20),
            }),
            execute: async ({ sides }) => {
              try {
                console.log(
                  chalk.cyanBright(`🎲 rollDice invoked with sides: ${sides}`)
                );
                const roll = Math.floor(Math.random() * sides) + 1;
                console.log(chalk.greenBright(`🎲 rollDice result: ${roll}`));
                return roll;
              } catch (error) {
                console.error("Error in rollDice:", error);
                throw new Error("Failed to execute rollDice");
              }
            },
          },
          combatCalculation: {
            description:
              "Calculates actual damage in combat using the formula: damage = max(0, attackerAttack + diceRoll - defenderDefense).",
            parameters: object({
              attackerAttack: number(),
              defenderDefense: number(),
              sides: number().min(2).max(20),
            }),
            execute: async ({ attackerAttack, defenderDefense, sides }) => {
              try {
                console.log(
                  chalk.yellowBright(
                    `🔥 combatCalculation invoked with attackerAttack: ${attackerAttack}, defenderDefense: ${defenderDefense}, sides: ${sides}`
                  )
                );
                const diceRoll = Math.floor(Math.random() * sides) + 1;
                const damage = Math.max(
                  0,
                  attackerAttack + diceRoll - defenderDefense
                );
                console.log(
                  chalk.greenBright(
                    `🔥 combatCalculation result: dice rolled ${diceRoll} and calculated damage ${damage}`
                  )
                );
                return damage;
              } catch (error) {
                console.error("Error in combatCalculation:", error);
                throw new Error("Failed to execute combatCalculation");
              }
            },
          },
          updateHero: {
            description:
              "Updates the hero's stats by adding the provided values (can be positive for healing/loot or negative for damage/mana cost). If the hero's health reaches 0 or below, the adventure ends.",
            parameters: object({
              health: number(),
              mana: number(),
              gold: number(),
            }),
            execute: async ({ health, mana, gold }) => {
              try {
                console.log(
                  `🛡 updateHero invoked for heroId: ${characterId} with changes: Health=${health}, Mana=${mana}, Gold=${gold}`
                );
                const resultMessage = await updateHero({
                  heroId: characterId,
                  health,
                  mana,
                  gold,
                });
                console.log(`🛡 updateHero result: ${resultMessage}`);
                return resultMessage;
              } catch (error) {
                console.error("Error in updateHero:", error);
                throw new Error("Failed to execute updateHero");
              }
            },
          },
          addInventoryItem: {
            description:
              "Adds an item directly to the hero's inventory without performing a loot chance roll.",
            parameters: object({
              name: string(),
              identified: zBoolean(),
              rarity: string(),
              description: string(),
              itemType: string(),
              buffs: object({
                health: number().optional(),
                mana: number().optional(),
                attack: number().optional(),
                defense: number().optional(),
                speed: number().optional(),
                xpGain: number().optional(),
              }).optional(),
            }),
            execute: async ({
              name,
              identified,
              rarity,
              description,
              itemType,
              buffs,
            }) => {
              try {
                console.log(`🛡 addInventoryItem invoked for item: ${name}`);
                await addInventoryItem({
                  heroId: characterId,
                  name,
                  identified,
                  rarity,
                  description,
                  itemType,
                  buffs: buffs || {},
                });
                return "Item added successfully";
              } catch (error) {
                console.error("Error in addInventoryItem:", error);
                throw new Error("Failed to execute addInventoryItem");
              }
            },
          },
          generateLoot: {
            description:
              "Generates a loot item based on the specified zone's available items and rarity drop rates. If an item passes its drop chance roll, it is returned as loot.",
            parameters: object({
              zone: string(),
            }),
            execute: async ({ zone }) => {
              try {
                const zoneData = zones[zone];
                if (!zoneData) {
                  throw new Error(`Zone ${zone} not found.`);
                }

                // Define drop rates based on rarity.
                const lootChances: { [key: string]: number } = {
                  legendary: 0.01, // 1% chance for legendary items
                  epic: 0.05, // 5% chance for epic items
                  rare: 0.2, // 20% chance for rare items
                  common: 0.74, // 74% chance for common items
                };

                const items = zoneData.items;
                // Filter items that pass their individual loot chance.
                const droppedItems = items.filter((item) => {
                  const chance = lootChances[item.rarity.toLowerCase()] ?? 0.5;
                  const roll = Math.random();
                  console.log(
                    `Loot chance check for item "${item.name}" (${
                      item.rarity
                    }): required <= ${chance}, rolled ${roll.toFixed(2)}`
                  );
                  return roll <= chance;
                });

                if (droppedItems.length === 0) {
                  return "No loot dropped this time.";
                }

                // Randomly select one dropped item.
                const selectedItem =
                  droppedItems[Math.floor(Math.random() * droppedItems.length)];

                // Return the loot item (excluding properties that are irrelevant for insertion).
                const loot = {
                  name: selectedItem.name,
                  identified: selectedItem.rarity === "common" ? true : false,
                  rarity: selectedItem.rarity,
                  description: selectedItem.description,
                  itemType: selectedItem.itemType,
                  buffs: selectedItem.buffs,
                };

                return loot;
              } catch (error) {
                console.error("Error in generateLoot:", error);
                throw new Error("Failed to execute generateLoot");
              }
            },
          },
        },
        onFinish: async ({ response }) => {
          try {
            const sanitizedMessages = sanitizeResponseMessages(
              response.messages
            );
            await saveMessages({
              messages: sanitizedMessages.map((message) => ({
                id: generateUUID(),
                chatId: id,
                role: message.role,
                content: message.content,
                createdAt: new Date(),
              })),
            });
          } catch (error) {
            console.error("Failed to save chat:", error);
          }
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });
    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });
    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
