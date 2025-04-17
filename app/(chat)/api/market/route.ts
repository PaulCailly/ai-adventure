import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { auth } from "@/app/(auth)/auth";
import { customModel } from "@/lib/ai";
import { models } from "@/lib/ai/models";
import { generateMarketPrompt } from "@/lib/ai/prompts/market";
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
  getCharacterById,
  getInventoryItemsByCharacterId,
  buyItem,
  sellItem,
  improveItem,
  identifyItem,
} from "@/lib/db/queries";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";
import { object, number, string } from "zod";

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

  // Remove any incomplete tool invocations.
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
    const title = "Au marché";
    await saveChat({ id, userId: session.user.id, title });
  }

  const character = await getCharacterById({ id: characterId });
  if (!character) {
    return new Response("Character not found", { status: 404 });
  }

  // Retrieve and format the hero's inventory items.
  const inventoryItems = await getInventoryItemsByCharacterId({ characterId });
  const formattedInventoryItems = inventoryItems.map((item: any) => ({
    id: item.id,
    name: item.name,
    identified: item.identified,
    rarity: item.rarity,
    description: item.description,
    itemType: item.itemType as "consumable" | "equipable" | "passive",
    buffs: item.buffs as { [key: string]: number },
  }));

  // Save the incoming user message.
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
        system: generateMarketPrompt({
          name: character.name,
          race: character.race,
          class: character.class,
          gold: character.gold ?? 0,
          inventoryItems: formattedInventoryItems,
          zone: "market",
        }),
        messages: coreMessages,
        maxSteps: 5,
        experimental_activeTools: [
          "negociate",
          "buyItem",
          "sellItem",
          "identifyItem",
        ],
        tools: {
          negociate: {
            description:
              "Conducts a negotiation with the merchant using dice mechanics to determine the outcome.",
            parameters: object({
              buyerSkill: number(),
              sellerSkill: number(),
              sides: number().min(2).max(20),
              buyerDice: number().optional(),
              sellerDice: number().optional(),
            }),
            execute: async ({
              buyerSkill,
              sellerSkill,
              sides,
              buyerDice,
              sellerDice,
            }) => {
              if (buyerDice === undefined) {
                buyerDice = Math.floor(Math.random() * sides) + 1;
              }
              if (sellerDice === undefined) {
                sellerDice = Math.floor(Math.random() * sides) + 1;
              }
              console.log(`💬 Start of negotiation:
  Buyer Skill: ${buyerSkill}, Seller Skill: ${sellerSkill}
  Dice sides: ${sides}
  Rolls -> Buyer: ${buyerDice}, Seller: ${sellerDice}`);

              const effectiveBuyer = buyerSkill * (buyerDice / sides);
              const effectiveSeller = sellerSkill * (sellerDice / sides);
              let outcome = "";
              let discount = 0;

              if (buyerDice === 1) {
                outcome = "critical failure";
                discount = 0;
              } else if (buyerDice === sides) {
                outcome = "critical success";
                discount = effectiveBuyer * 1.5;
              } else if (effectiveBuyer > effectiveSeller) {
                outcome = "success";
                discount = effectiveBuyer;
              } else {
                outcome = "failure";
                discount = effectiveBuyer * 0.5;
              }

              const finalDiscount = Math.round(discount);
              console.log(
                `💡 Résultat de la négociation: ${outcome} avec une remise de: ${finalDiscount}`
              );
              return {
                buyerDice,
                sellerDice,
                effectiveBuyer,
                effectiveSeller,
                outcome,
                discount: finalDiscount,
              };
            },
          },
          buyItem: {
            description:
              "Allows purchasing an item in the market. Provide the details of the item to be purchased and the cost.",
            parameters: object({
              item: object({
                name: string(),
                rarity: string(),
                description: string(),
                itemType: string(),
                buffs: object({}).optional(),
              }),
              cost: number(),
            }),
            execute: async ({ item, cost }: { item: any; cost: number }) => {
              try {
                const result = await buyItem({
                  character,
                  cost,
                  item,
                });
                return result;
              } catch (error: any) {
                return { error: error.message };
              }
            },
          },
          sellItem: {
            description:
              "Allows selling an item from your inventory. Provide the ID of the item to be sold.",
            parameters: object({
              itemId: string(),
            }),
            execute: async ({ itemId }: { itemId: string }) => {
              try {
                const result = await sellItem(itemId);
                return result;
              } catch (error: any) {
                return { error: error.message };
              }
            },
          },
          identifyItem: {
            description:
              "Allows identifying an unknown item. The cost is deducted from your gold and the item receives a new name and description based on the lore of the Forest of Ancient Whispers. The identification cost is based on the item's rarity: common - 10 gold, uncommon - 25 gold, rare - 50 gold, epic - 100 gold, legendary - 200 gold.",
            parameters: object({
              itemId: string(),
            }),
            execute: async ({ itemId }: { itemId: string }) => {
              try {
                const result = await identifyItem({ itemId });
                return result;
              } catch (error: any) {
                console.log(error);
                return { error: error.message };
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
              messages: sanitizedMessages.map((message: any) => ({
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
