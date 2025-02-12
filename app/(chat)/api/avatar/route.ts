// Start of Selection
import { z } from "zod";
import { OpenAI } from "openai";
import { put } from "@vercel/blob";

import { auth } from "@/app/(auth)/auth";
import {
  getChatById,
  deleteChatById,
  getCharactersByUserId,
  updateCharacter,
} from "@/lib/db/queries";
import { generateImagePrompt } from "@/lib/ai/prompts";

export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Define and validate the hero generation input schema.
  const heroSchema = z.object({
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
  });

  let payload;
  try {
    payload = heroSchema.parse(await request.json());
  } catch (error) {
    return new Response("Invalid input", { status: 400 });
  }

  const {
    name,
    race,
    class: heroClass,
    weapon,
    strength,
    weakness,
    companion,
    symbol,
    stats,
  } = payload;

  const imagePrompt = generateImagePrompt({
    name,
    race,
    heroClass,
    weapon,
    companion,
    strength,
    weakness,
  });

  try {
    // Generate the image using OpenAI's DALL-E 3.
    const openai = new OpenAI();
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1792",
      quality: "standard",
      n: 1,
    });

    const imageUrl = imageResponse.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL returned from image generation.");
    }

    // Download the generated image.
    const imageRes = await fetch(imageUrl);
    const imageBlob = await imageRes.blob();

    // Upload the image to blob storage.
    const blob = await put(`heroes/${name}-${Date.now()}.png`, imageBlob, {
      access: "public",
      contentType: "image/png",
    });

    // Update the user's main character with the new avatar.
    const userCharacters = await getCharactersByUserId({
      userId: session.user.id,
    });
    if (userCharacters.length > 0) {
      const mainCharacter = userCharacters[0];
      await updateCharacter({ id: mainCharacter.id, avatar: blob.url });
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: blob.url,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
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
// End of Selectio
