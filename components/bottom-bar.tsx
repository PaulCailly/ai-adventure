"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Trophy,
  Star,
  Users,
  Activity,
  Clover,
  Smile,
  Cross,
  Dumbbell,
  Brain,
  Crown,
  Target,
  Heart,
  Sparkles,
} from "lucide-react";

const trophees = [
  { id: "lecteur-de-lettre", label: "Lecteur de Lettre", grayscale: false },
  { id: "taverne-debloquee", label: "Taverne Débloquée", grayscale: false },
  { id: "balade-en-foret", label: "Balade en Forêt", grayscale: true },
  { id: "habit-de-heros", label: "Habit de Héros", grayscale: true },
  { id: "saut-de-l-ange", label: "Saut de l'Ange", grayscale: true },
  {
    id: "aventure-fantastique",
    label: "Aventure Fantastique",
    grayscale: true,
  },
];

const talents = [
  {
    id: "agilite",
    label: "Agilité",
    icon: Activity,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
  {
    id: "chance",
    label: "Chance",
    icon: Clover,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
  {
    id: "charisme",
    label: "Charisme",
    icon: Smile,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
  {
    id: "foi",
    label: "Foi",
    icon: Cross,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
  {
    id: "force",
    label: "Force",
    icon: Dumbbell,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
  {
    id: "intelligence",
    label: "Intelligence",
    icon: Brain,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
  {
    id: "leadership",
    label: "Leadership",
    icon: Crown,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
  {
    id: "magie",
    label: "Magie",
    icon: Sparkles,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
  {
    id: "precision",
    label: "Précision",
    icon: Target,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
  {
    id: "vitalite",
    label: "Vitalité",
    icon: Heart,
    levels: {
      bronze: false,
      silver: true,
      gold: true,
    },
  },
];

export function BottomBar() {
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
            <ScrollArea className="h-[500px]">
              <SheetHeader>
                <SheetTitle>Trophées</SheetTitle>
                <SheetDescription>
                  <div className="grid grid-cols-3 gap-6">
                    {trophees.map(({ id, label, grayscale }) => (
                      <div key={id} className="p-4 border rounded-lg shadow-sm">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-20 h-20 bg-center bg-cover rounded-lg ${
                              grayscale ? "grayscale" : ""
                            }`}
                            style={{
                              backgroundImage: `url(/images/trophees/${id}.png)`,
                              backgroundSize: "cover",
                            }}
                          />
                          <span className="mt-2 text-xs text-center">
                            {label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetDescription>
              </SheetHeader>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center">
            <Star className="size-6" />
            <span className="text-xs">Talents</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-w-[430px] mx-auto inset-x-0 overflow-auto"
          >
            <ScrollArea className="h-[500px]">
              <SheetHeader>
                <SheetTitle>Talents</SheetTitle>
                <SheetDescription>
                  <div className="grid grid-cols-1 gap-6">
                    {talents.map(({ id, label, icon: Icon, levels }) => (
                      <div key={id} className="p-4 border rounded-lg shadow-sm">
                        <div className="font-semibold mb-3 flex gap-2 items-center text-white">
                          <span>{label}</span>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex flex-col items-center">
                            <img
                              src={`/images/talents/bronze-${id}.png`}
                              alt={`Bronze ${label}`}
                              className={`w-20 h-20 ${
                                levels.bronze ? "grayscale" : ""
                              }`}
                            />
                            <span className="text-sm mt-1">Bronze</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <img
                              src={`/images/talents/silver-${id}.png`}
                              alt={`Silver ${label}`}
                              className={`w-20 h-20 ${
                                levels.silver ? "grayscale" : ""
                              }`}
                            />
                            <span className="text-sm mt-1">Argent</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <img
                              src={`/images/talents/gold-${id}.png`}
                              alt={`Gold ${label}`}
                              className={`w-20 h-20 ${
                                levels.gold ? "grayscale" : ""
                              }`}
                            />
                            <span className="text-sm mt-1">Or</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetDescription>
              </SheetHeader>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center">
            <Users className="size-6" />
            <span className="text-xs">Friends</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-w-[430px] mx-auto inset-x-0"
          >
            <SheetHeader>
              <SheetTitle>Friends</SheetTitle>
              <SheetDescription>
                Vos amis:
                <ul className="mt-4 space-y-2">
                  <li>Sir Galahad</li>
                  <li>Merlin le Sage</li>
                  <li>Robin des bois</li>
                </ul>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
