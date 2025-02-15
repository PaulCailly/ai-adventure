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

  // Prevent launching the adventure if the character's health is below 0
  if (character.health < 0) {
    return new Response("Votre santé est insuffisante pour l'aventure", {
      status: 400,
    });
  }

  // Retrieve the hero's current inventory.
  const inventoryItems = await getInventoryItemsByCharacterId({
    characterId,
  });

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
          inventoryItems,
        }),
        messages: coreMessages,
        maxSteps: 5,
        experimental_activeTools: [
          "rollDice",
          "combatCalculation",
          "updateHero",
          "addInventoryItem",
        ],
        tools: {
          rollDice: {
            description:
              "Used to generate a random number to introduce chance into combat.",
            parameters: object({
              sides: number().min(2).max(20),
            }),
            execute: async ({ sides }) => {
              console.log(
                chalk.cyanBright(`🎲 rollDice invoked with sides: ${sides}`)
              );
              const roll = Math.floor(Math.random() * sides) + 1;
              console.log(chalk.greenBright(`🎲 rollDice result: ${roll}`));
              return roll;
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
            },
          },
          addInventoryItem: {
            description:
              "Adds an item to the hero's inventory with the provided properties.",
            parameters: object({
              name: string(),
              identified: zBoolean(),
              rarity: string(),
              description: string(),
              effect: string(),
            }),
            execute: async ({
              name,
              identified,
              rarity,
              description,
              effect,
            }) => {
              console.log(
                `🛡 addInventoryItem invoked for heroId: ${characterId} with item: ${name}`
              );
              await addInventoryItem({
                heroId: characterId,
                name,
                identified,
                rarity,
                description,
                effect,
              });
              return "Item added successfully";
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
