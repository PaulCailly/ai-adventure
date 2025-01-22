import { redirect } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Brain,
  Sword,
  Shield,
  Zap,
  Axe,
  Cross,
  Dog,
  User,
  Dumbbell,
  AlertCircle,
} from "lucide-react";

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
    <ScrollArea className="h-full">
      <div className="container max-w-4xl mx-auto p-6">
        <Card className="border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="flex flex-row items-center gap-6">
            {character.avatar && (
              <div className="relative overflow-hidden">
                <img
                  src={character.avatar}
                  alt={character.name}
                  width="96"
                  height="96"
                  className="size-24 rounded-full object-cover ring-2 ring-primary/20"
                />
              </div>
            )}
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold">
                {character.name}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">{character.race}</Badge>
                <Badge variant="secondary">{character.class}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Card className="border-none bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Heart className="w-4 h-4" /> Health
                    </span>
                    <span className="font-medium">{character.health}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Brain className="w-4 h-4" /> Mana
                    </span>
                    <span className="font-medium">{character.mana}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Sword className="w-4 h-4" /> Attack
                    </span>
                    <span className="font-medium">{character.attack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Defense
                    </span>
                    <span className="font-medium">{character.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Speed
                    </span>
                    <span className="font-medium">{character.speed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Axe className="w-4 h-4" /> Weapon
                  </span>
                  <span className="font-medium">{character.weapon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Cross className="w-4 h-4" /> Symbol
                  </span>
                  <span className="font-medium">{character.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Dog className="w-4 h-4" /> Companion
                  </span>
                  <span className="font-medium">{character.companion}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-muted/50 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Characteristics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" /> Physical Traits
                  </h3>
                  <p className="text-muted-foreground">
                    {character.physicalTraits}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Dumbbell className="w-4 h-4" /> Strength
                  </h3>
                  <p className="text-muted-foreground">{character.strength}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Weakness
                  </h3>
                  <p className="text-muted-foreground">{character.weakness}</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
