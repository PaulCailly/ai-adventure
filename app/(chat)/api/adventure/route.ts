import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { auth } from "@/app/(auth)/auth";
import { customModel } from "@/lib/ai";
import { models } from "@/lib/ai/models";
import { generateAdventurePrompt } from "@/lib/ai/prompts";
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
  getCharacterById,
  updateHero,
} from "@/lib/db/queries";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";
import { object, number, string } from "zod";
import { AISDKExporter } from "langsmith/vercel";

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
        }),
        messages: coreMessages,
        maxSteps: 5,
        experimental_activeTools: [
          "rollDice",
          "combatCalculation",
          "updateHero",
        ],
        tools: {
          rollDice: {
            description:
              "Used to generate a random number to introduce chance into combat.",
            parameters: object({
              sides: number().min(2).max(20),
            }),
            execute: async ({ sides }) => {
              const roll = Math.floor(Math.random() * sides) + 1;
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
              const diceRoll = Math.floor(Math.random() * sides) + 1;
              const damage = Math.max(
                0,
                attackerAttack + diceRoll - defenderDefense
              );
              return damage;
            },
          },
          updateHero: {
            description:
              "Updates the hero's Health and Mana based on the outcome of combat. If the hero's health reaches 0, the adventure should immediately end.",
            parameters: object({
              heroId: string(),
              health: number(),
              mana: number(),
            }),
            execute: async ({ heroId, health, mana }) => {
              await updateHero({ heroId, health, mana });
              return health <= 0
                ? "Hero defeated, adventure ends immediately"
                : "Hero updated successfully";
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
        experimental_telemetry: AISDKExporter.getSettings({
          runName: "adventure-stream-text",
        }),
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
