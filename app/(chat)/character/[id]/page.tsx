/* eslint-disable @next/next/no-img-element */
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { Heart, Sword, Shield, Zap, Sparkle } from "lucide-react";

import { BottomBar } from "@/components/bottom-bar";

import { getChatById, getCharactersByChatId } from "@/lib/db/queries";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    return redirect("/");
  }

  const characters = await getCharactersByChatId({ chatId: id });
  const character = characters[0];

  if (!character) {
    return redirect("/");
  }

  return (
    <div className="relative h-full">
      <ScrollArea className="h-[calc(100%-64px)]">
        <div className="px-4 py-6">
          <Card className="w-full border-2 border-primary/20 bg-gradient-to-b from-background/95 to-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
            <div className="relative aspect-[3/4] w-full">
              {character.avatar && (
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="object-cover size-full"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute top-4 inset-x-4">
                <h2 className="text-2xl font-bold text-white mb-3 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg inline-block">
                  {character.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-black/50 backdrop-blur-sm"
                  >
                    {character.race}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-black/50 backdrop-blur-sm"
                  >
                    {character.class}
                  </Badge>
                </div>
              </div>
              <div className="absolute bottom-4 inset-x-4 flex justify-between">
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <Heart className="size-4 text-red-500" />
                  <span className="text-white font-bold">
                    {character.health}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <Sparkle className="size-4 text-blue-500" />
                  <span className="text-white font-bold">{character.mana}</span>
                </div>
              </div>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                  <Sword className="size-4 mb-1" />
                  <span className="text-xs text-muted-foreground">Attack</span>
                  <span className="font-bold">{character.attack}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                  <Shield className="size-4 mb-1" />
                  <span className="text-xs text-muted-foreground">Defense</span>
                  <span className="font-bold">{character.defense}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                  <Zap className="size-4 mb-1" />
                  <span className="text-xs text-muted-foreground">Speed</span>
                  <span className="font-bold">{character.speed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <BottomBar />
    </div>
  );
}
