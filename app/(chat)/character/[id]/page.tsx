/* eslint-disable @next/next/no-img-element */
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import {
  Heart,
  Sword,
  Shield,
  Zap,
  Sparkle,
  ChevronLeft,
  Coins,
  Skull,
  MapPin,
  Swords,
  BadgeSwissFranc,
  BadgeIndianRupee,
  BadgeCent,
  Flag,
} from "lucide-react";

import { BottomBar } from "@/components/bottom-bar";
import ExperienceBar from "@/components/experience-bar";

import {
  getCharacterById,
  listCharacters,
  getCharactersByUserId,
} from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";
import CharacterCard from "@/components/character-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        {isMainCharacter ? (
          <>
            <div className="relative top-4 px-4 z-100 pb-4">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  className="bg-black/50 backdrop-blur-sm text-white border-white/20 hover:bg-black/60 hover:text-white hover:border-white/30"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Taverne</span>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-black/50 backdrop-blur-sm text-white border-white/20 hover:bg-black/60 hover:text-white hover:border-white/30"
                  >
                    <BadgeSwissFranc className="text-yellow-500 h-4 w-4" />
                    <span>20</span>
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="relative top-4 left-4 z-100 pb-4">
            <a
              href={`/character/${session.user.id}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "bg-black/50 backdrop-blur-sm text-white border-white/20 hover:bg-black/60 hover:text-white hover:border-white/30"
              )}
            >
              <ChevronLeft />
              Retour
            </a>
          </div>
        )}
        <ScrollArea className="h-[calc(100%-64px)]">
          <CharacterCard
            character={character}
            isSelf={isMainCharacter}
            guildCount={allCharacters.length}
          />
        </ScrollArea>
        <BottomBar characters={allCharacters} character={userCharacters[0]} />
      </div>
    </div>
  );
}
