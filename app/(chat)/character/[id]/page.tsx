/* eslint-disable @next/next/no-img-element */
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { Heart, Sword, Shield, Zap, Sparkle, ChevronLeft } from "lucide-react";

import { BottomBar } from "@/components/bottom-bar";
import ExperienceBar from "@/components/experience-bar";

import {
  getCharacterById,
  listCharacters,
  getCharactersByUserId,
} from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";
import CharacterCard from "@/components/character-card";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/login");
  }

  const params = await props.params;
  const { id } = params;
  const character = await getCharacterById({ id });

  if (!character) {
    return redirect("/");
  }

  const allCharacters = await listCharacters();
  const userCharacters = await getCharactersByUserId({
    userId: session.user.id,
  });

  const isMainCharacter = userCharacters.some(
    (userCharacter) => userCharacter.id === character.id
  );

  return (
    <div className="max-w-[430px] h-screen max-h-[932px] m-auto overflow-hidden border">
      <div className="relative h-full">
        {!isMainCharacter && (
          <div className="relative top-4 left-4 z-100 pb-4">
            <a href={`/character/${session.user.id}`}>
              <ChevronLeft className="size-6 text-white" />
            </a>
          </div>
        )}
        <ScrollArea className="h-[calc(100%-64px)]">
          <CharacterCard character={character} isSelf={isMainCharacter} />
        </ScrollArea>
        <BottomBar characters={allCharacters} character={userCharacters[0]} />
      </div>
    </div>
  );
}
