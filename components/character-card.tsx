"use client";

import { Heart, Sparkle, Sword, Shield, Zap } from "lucide-react";
import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

function CharacterCard({ character }: { character: any }) {
  const [avatarUrl, setAvatarUrl] = useState(character.avatar);
  const [loading, setLoading] = useState(false);
  const tapCountRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const handleCardClick = async () => {
    // Increment tap count on each click and reset if tapping slows down
    tapCountRef.current += 1;
    if (timerRef.current) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        tapCountRef.current = 0;
      }, 600);
      if (tapCountRef.current >= 3) {
        tapCountRef.current = 0;
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
              physicalTraits: character.physicalTraits,
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
      }
    }
  };
  return (
    <div className="px-4 py-6">
      <Card
        className="w-full border bg-gradient-to-b from-background/95 to-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden"
        onClick={handleCardClick}
      >
        <div className="relative aspect-[3/4] w-full">
          {avatarUrl && (
            <img
              src={avatarUrl}
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
              <span className="text-white font-bold">{character.health}</span>
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
        </CardContent>
      </Card>
    </div>
  );
}

export default CharacterCard;
