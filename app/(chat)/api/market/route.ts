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
} from "@/lib/db/queries";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";
import { object, number, string } from "zod";

import { POST as identifyItem } from "@/app/api/inventory/identify/route";

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
          "negocier",
          "acheterObjet",
          "vendreObjet",
          "identifierObjet",
          "ameliorerEquipement",
        ],
        tools: {
          negocier: {
            description:
              "Effectue une négociation avec le marchand en utilisant la mécanique de dés pour déterminer l'issue.",
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
              console.log(`💬 Début de négociation:
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
          acheterObjet: {
            description:
              "Permet d'acheter un objet dans le marché. Indiquez les détails de l'objet à acheter et le coût.",
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
          vendreObjet: {
            description:
              "Permet de vendre un objet de votre inventaire. Fournissez l'ID de l'objet à vendre.",
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
          identifierObjet: {
            description:
              "Permet d'identifier un objet inconnu. Le coût est déduit de votre or et l'objet reçoit un nouveau nom ainsi qu'une description basée sur la lore de la Forêt des Murmures Anciens.",
            parameters: object({
              itemId: string(),
            }),
            execute: async ({ itemId }: { itemId: string }) => {
              const identifyRequest = new Request(request.url, {
                method: "POST",
                headers: request.headers,
                body: JSON.stringify({ itemId }),
              });
              const identifyResponse = await identifyItem(identifyRequest);
              const identifyData = await identifyResponse.json();
              if (identifyResponse.status !== 200) {
                return { error: identifyData.error };
              }
              return identifyData;
            },
          },
          ameliorerEquipement: {
            description:
              "Permet d'améliorer un équipement existant. Fournissez l'ID de l'objet et le pourcentage d'amélioration désiré.",
            parameters: object({
              itemId: string(),
              improvementPercentage: number(),
            }),
            execute: async ({
              itemId,
              improvementPercentage,
            }: {
              itemId: string;
              improvementPercentage: number;
            }) => {
              try {
                const result = await improveItem({
                  itemId,
                  improvementPercentage,
                  character,
                });
                return result;
              } catch (error: any) {
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
