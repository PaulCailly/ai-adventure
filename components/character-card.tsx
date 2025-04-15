"use client";

import {
  Heart,
  Sparkle,
  Sword,
  Shield,
  Zap,
  Loader2,
  MoreVertical,
  Users,
  Swords,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import ExperienceBar from "./experience-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { generateUUID } from "@/lib/utils";
import { useRouter } from "next/navigation";

function CharacterCard({
  character,
  isSelf = false,
  guildCount,
}: {
  character: any;
  isSelf?: boolean;
  guildCount?: number;
}) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(character.avatar);
  const [loading, setLoading] = useState(false);

  const handleReforgeAvatar = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: character.name,
          race: character.race,
          class: character.class,
          weapon: character.weapon,
          strength: character.strength,
          weakness: character.weakness,
          companion: character.companion,
          symbol: character.symbol,
          stats: {
            health: character.health,
            mana: character.mana,
            attack: character.attack,
            defense: character.defense,
            speed: character.speed,
          },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          setAvatarUrl(data.imageUrl);
        }
      } else {
        console.error("Failed to regenerate avatar");
      }
    } catch (error) {
      console.error("Error regenerating avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (character.name === "Lucas") {
      toast.error(
        "Vous devez être niveau 11 minimum pour accéder à cette zone.",
        { position: "bottom-center" }
      );
      return;
    }
    router.push(`/adventure`);
  };

  return (
    <div className="px-4 py-6 flex flex-col gap-4 pb-48">
      <Card className="w-full border bg-gradient-to-b from-background/95 to-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
        <div className="relative aspect-[3/4] w-full max-h-[50vh]">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={character.name}
              className="object-cover w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute top-4 inset-x-4 flex justify-between items-start">
            <div className="flex flex-row gap-2 min-w-0">
              <Badge
                variant="secondary"
                className="bg-black/50 backdrop-blur-sm text-xs whitespace-nowrap"
              >
                {character.name}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-black/50 backdrop-blur-sm text-xs whitespace-nowrap"
              >
                {character.race}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-black/50 backdrop-blur-sm text-xs whitespace-nowrap"
              >
                {character.class}
              </Badge>
              <div className="flex flex-row gap-2">
                <div className="h-fit flex-shrink-0 flex flex-row gap-1"></div>
              </div>
            </div>
            {isSelf && (
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-black/50 backdrop-blur-sm p-2 rounded-lg flex-shrink-0">
                  <MoreVertical className="size-5 text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleReforgeAvatar}>
                    Reforge Avatar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="absolute bottom-4 inset-x-4 flex justify-between">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <Heart className="size-4 text-red-500" />
              <span className="text-white font-bold">{character.health}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <Sparkle className="size-4 text-blue-500" />
              <span className="text-white font-bold">{character.mana}</span>
            </div>
          </div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
              <Loader2 className="animate-spin h-8 w-8 text-white" />
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
              <Sword className="size-4 mb-1" />
              <span className="text-xs text-muted-foreground">Attaque</span>
              <span className="font-bold">{character.attack}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
              <Shield className="size-4 mb-1" />
              <span className="text-xs text-muted-foreground">Défense</span>
              <span className="font-bold">{character.defense}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
              <Zap className="size-4 mb-1" />
              <span className="text-xs text-muted-foreground">Vitesse</span>
              <span className="font-bold">{character.speed}</span>
            </div>
          </div>

          <CardContent className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">Guilde</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  <span>
                    {guildCount ?? 1} membre{(guildCount ?? 1) > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
            <ExperienceBar />
          </CardContent>
        </CardContent>
      </Card>
      <Link href="#" onClick={handleForestClick} className="w-full">
        <Card className="hover:opacity-90 transition-all duration-200 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="py-4 px-5">
            <div className="flex justify-between items-center gap-3 min-w-0">
              <div className="flex flex-row gap-2 min-w-0">
                <Swords className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    Forêt des Murmures Anciens
                  </h3>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-xs font-normal flex-shrink-0"
              >
                Niv. 11-15
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

export default CharacterCard;
