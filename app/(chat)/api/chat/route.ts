import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { z } from "zod";
import { OpenAI } from "openai";
import { put } from "@vercel/blob";

import { auth } from "@/app/(auth)/auth";
import { customModel } from "@/lib/ai";
import { models } from "@/lib/ai/models";
import { systemPrompt } from "@/lib/ai/prompts";
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
  createCharacter,
} from "@/lib/db/queries";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";

export const maxDuration = 60;

type AllowedTools = "generateHero";

const heroTools: AllowedTools[] = ["generateHero"];

const allTools: AllowedTools[] = [...heroTools];

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
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
    const title = "The journey begins...";
    await saveChat({ id, userId: session.user.id, title });
  }

  const userMessageId = generateUUID();

  await saveMessages({
    messages: [
      { ...userMessage, id: userMessageId, createdAt: new Date(), chatId: id },
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
        system: systemPrompt,
        messages: coreMessages,
        maxSteps: 5,
        experimental_activeTools: allTools,
        tools: {
          generateHero: {
            description:
              "Generate a hero character sheet with stats and details",
            parameters: z.object({
              name: z.string(),
              race: z.string(),
              class: z.string(),
              weapon: z.string(),
              strength: z.string(),
              weakness: z.string(),
              companion: z.string(),
              symbol: z.string(),
              stats: z.object({
                health: z.number(),
                mana: z.number(),
                attack: z.number(),
                defense: z.number(),
                speed: z.number(),
              }),
            }),
            execute: async ({
              name,
              race,
              class: heroClass,
              weapon,
              strength,
              weakness,
              companion,
              symbol,
              stats,
            }) => {
              const openai = new OpenAI();
              const imagePrompt = `
              Create a captivating fantasy portrait of a ${race} ${heroClass} named ${name}.
              Wielding a ${weapon} with confidence.
              Their ${strength} radiates through their pose, while hints of their ${weakness} add depth to their character.
              The scene features an environment characteristic of the ${race} race.
              The art style should be highly detailed with rich textures, vibrant colors, and professional video game quality rendering using Unreal Engine 5.
              Focus on specific, visually representable elements.
              Avoid ambiguous language that could be interpreted as including text.
              Do not use any text on image.
              Do not use any User Interface elements on image.
              The image must be in a vertical, full-length format that shows the character from head to toe, ensuring a non-landscape view.`;

              const imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: imagePrompt,
                size: "1024x1792",
                quality: "standard",
                n: 1,
              });

              const imageUrl = imageResponse.data[0].url;
              if (imageUrl) {
                const imageRes = await fetch(imageUrl);
                const imageBlob = await imageRes.blob();

                const blob = await put(`heroes/${name}.png`, imageBlob, {
                  access: "public",
                  contentType: "image/png",
                });

                await createCharacter({
                  userId: session?.user?.id || "none",
                  name,
                  race,
                  class: heroClass,
                  weapon,
                  strength,
                  weakness,
                  companion,
                  symbol,
                  health: stats.health,
                  mana: stats.mana,
                  attack: stats.attack,
                  defense: stats.defense,
                  speed: stats.speed,
                  chatId: id,
                  avatar: blob.url,
                });
              }

              return "Success";
            },
          },
        },
        onFinish: async ({ response }) => {
          if (session.user?.id) {
            try {
              const responseMessagesWithoutIncompleteToolCalls =
                sanitizeResponseMessages(response.messages);

              await saveMessages({
                messages: responseMessagesWithoutIncompleteToolCalls.map(
                  (message) => {
                    const messageId = generateUUID();

                    if (message.role === "assistant") {
                      dataStream.writeMessageAnnotation({
                        messageIdFromServer: messageId,
                      });
                    }

                    return {
                      id: messageId,
                      chatId: id,
                      role: message.role,
                      content: message.content,
                      createdAt: new Date(),
                    };
                  }
                ),
              });
            } catch (error) {
              console.error("Failed to save chat:", error);
              console.error(
                "Error stack:",
                error instanceof Error
                  ? error.stack
                  : "No stack trace available"
              );
            }
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: "stream-text",
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

  if (!session || !session.user) {
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
