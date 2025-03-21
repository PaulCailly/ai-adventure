"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Character } from "@/lib/db/schema";
import { ScrollArea, ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { Trophy, Box, Users, ChevronRight, Share2 } from "lucide-react";
import Link from "next/link";
import Inventory from "@/components/inventory";
import Trophies from "@/components/trophies";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface BottomBarProps {
  characters: Character[];
  character: Character;
}

export function BottomBar({ characters, character }: BottomBarProps) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/register`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Aide-moi dans ma quête !",
          text: "Aide-moi à progresser dans ma quête en rejoignant l'aventure !",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Erreur lors du partage :", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert(`Lien copié dans le presse-papier : ${shareUrl}`);
      } catch (err) {
        prompt("Copiez ce lien :", shareUrl);
      }
    }
  };

  return (
    <div className="absolute bottom-0 inset-x-0 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full antialiased">
      <div className="grid h-full grid-cols-3">
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center">
            <Trophy className="size-6" />
            <span className="text-xs">Trophées</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-w-[430px] mx-auto inset-x-0 overflow-auto"
          >
            <ScrollArea>
              <SheetHeader>
                <SheetTitle>Trophées</SheetTitle>
                <SheetDescription>
                  <Trophies />
                </SheetDescription>
              </SheetHeader>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center">
            <Box className="size-6" />
            <span className="text-xs">Inventaire</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-w-[430px] mx-auto inset-x-0 overflow-auto"
          >
            <ScrollArea>
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Inventaire</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>
              <Inventory characterId={character.id} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center">
            <Users className="size-6" />
            <span className="text-xs">Amis</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-w-[430px] mx-auto inset-x-0 bg-gradient-to-b from-background/95 to-background/50 backdrop-blur-md"
          >
            <SheetHeader className="border-b border-muted pb-4">
              <SheetTitle className="text-lg font-bold text-white">
                Amis
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[400px] mt-4">
              <ScrollAreaViewport>
                <ul className="space-y-2">
                  {characters
                    .filter((c) => c.id !== character.id)
                    .map((char: Character) => (
                      <Link
                        key={char.id}
                        href={`/character/${char.id}`}
                        className="w-full text-white font-semibold flex items-center"
                      >
                        <li className="w-full flex items-center p-2 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                          <img
                            src={char.avatar || "/images/default-avatar.png"}
                            alt={char.name}
                            className="w-16 h-16 rounded-full mr-3 object-cover object-[center_40%]"
                          />
                          <div className="flex-1">
                            {char.name}
                            <div className="text-xs text-muted-foreground">
                              {char.race} - {char.class}
                            </div>
                          </div>
                          <ChevronRight className="ml-2 text-white" />
                        </li>
                      </Link>
                    ))}
                </ul>
                <button
                  onClick={handleShare}
                  className="w-full mt-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors flex items-center justify-center gap-2 text-white"
                >
                  <Share2 className="size-5" />
                  <span>Inviter des amis</span>
                </button>
              </ScrollAreaViewport>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
