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

  // Before converting messages, sanitize out any incomplete tool invocations.
  const sanitizedMessages = messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.filter(
          (invocation) => invocation.state === "result"
        ),
      };
    }
    return message;
  });

  const coreMessages = convertToCoreMessages(sanitizedMessages);
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
          attack: character.attack,
          defense: character.defense,
          speed: character.speed,
          companion: character.companion,
          symbol: character.symbol,
          zone: "forest", // Default zone for now
          inventoryItems: formattedInventoryItems,
        }),
        messages: coreMessages,
        maxSteps: 5,
        experimental_activeTools: [
          "combatCalculation",
          "updateHero",
          "addInventoryItem",
          "generateLoot",
        ],
        tools: {
          combatCalculation: {
            description:
              "Calculates combat damage for both attacker and defender and rolls dice if needed.",
            parameters: object({
              attackerAttack: number(),
              attackerDefense: number(),
              defenderAttack: number(),
              defenderDefense: number(),
              sides: number().min(2).max(20),
              attackerDice: number().optional(),
              defenderDice: number().optional(),
            }),
            execute: async ({
              attackerAttack,
              attackerDefense,
              defenderAttack,
              defenderDefense,
              sides,
              attackerDice,
              defenderDice,
            }) => {
              if (attackerDice === undefined) {
                attackerDice = Math.floor(Math.random() * sides) + 1;
              }
              if (defenderDice === undefined) {
                defenderDice = Math.floor(Math.random() * sides) + 1;
              }

              console.log(`⚔️ Combat calculation started with:
                Attacker: Attack=${attackerAttack}, Defense=${attackerDefense}
                Defender: Attack=${defenderAttack}, Defense=${defenderDefense}
                Dice sides=${sides}
                Provided dice rolls: Attacker=${attackerDice}, Defender=${defenderDice}`);

              const calcDamage = (
                attack: number,
                defense: number,
                diceRoll: number,
                role: string
              ) => {
                console.log(`🎲 ${role} dice roll: ${diceRoll}`);
                const randomFactor = ((diceRoll - 1) / (sides - 1)) * 0.4 + 0.8;
                console.log(
                  `📊 ${role} random factor: ${randomFactor.toFixed(2)}`
                );
                let baseDamage = attack * randomFactor;
                console.log(
                  `💥 ${role} base damage before defense: ${baseDamage.toFixed(
                    2
                  )}`
                );
                baseDamage = baseDamage * (1 - defense / 100);
                console.log(
                  `🛡️ ${role} damage after ${defense}% defense: ${baseDamage.toFixed(
                    2
                  )}`
                );
                let outcome = "";
                let damageValue = 0;

                if (diceRoll === 1) {
                  outcome = "critical failure";
                  damageValue = 0;
                } else if (diceRoll === sides) {
                  outcome = "critical success";
                  damageValue = baseDamage * 2;
                } else if (diceRoll <= Math.floor(sides / 2)) {
                  outcome = "failure";
                  damageValue = baseDamage * 0.5;
                } else {
                  outcome = "success";
                  damageValue = baseDamage;
                }

                const finalDamage = Math.round(damageValue);
                console.log(`✨ ${role} final result:
                  Outcome: ${outcome}
                  Final damage: ${finalDamage}`);

                return {
                  diceRoll,
                  randomFactor,
                  outcome,
                  damage: finalDamage,
                };
              };

              const attackerResult = calcDamage(
                attackerAttack,
                defenderDefense,
                attackerDice,
                "Attacker"
              );
              const defenderResult = calcDamage(
                defenderAttack,
                attackerDefense,
                defenderDice,
                "Defender"
              );

              console.log(`🏁 Combat calculation complete:
                Attacker dealt ${attackerResult.damage} damage (${attackerResult.outcome})
                Defender dealt ${defenderResult.damage} damage (${defenderResult.outcome})`);

              return {
                attacker: attackerResult,
                defender: defenderResult,
                roll1: attackerDice,
                roll2: defenderDice,
                total: attackerDice + defenderDice,
              };
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
                  legendary: 0.01,
                  epic: 0.05,
                  rare: 0.2,
                  common: 0.74,
                };

                const items = zoneData.items;
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

                const selectedItem =
                  droppedItems[Math.floor(Math.random() * droppedItems.length)];

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
