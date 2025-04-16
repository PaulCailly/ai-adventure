"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Card, CardContent } from "./ui/card";

export interface Trophy {
  id: string;
  label: string;
  grayscale?: boolean;
}

const trophyList: Trophy[] = [
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

const trophyDescriptions: Record<string, string> = {
  "lecteur-de-lettre": "Un hommage à votre passion pour la lecture.",
  "taverne-debloquee": "Bienvenue à la taverne, lieu de repos et de récits.",
  "balade-en-foret": "Une promenade paisible à travers les bois.",
  "habit-de-heros": "Portez l'habit d'un véritable héros.",
  "saut-de-l-ange": "Un saut audacieux vers l'inconnu.",
  "aventure-fantastique": "Une aventure épique pleine de mystères.",
};

export default function Trophies() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {trophyList.map((trophy) => (
          <DropdownMenu key={trophy.id}>
            <DropdownMenuTrigger asChild>
              <div>
                <Card
                  className={`cursor-pointer hover:bg-muted transition aspect-square flex items-center justify-center border ${
                    trophy.grayscale ? "grayscale" : ""
                  }`}
                >
                  <CardContent className="p-0">
                    <img
                      src={`/images/trophees/${trophy.id}.png`}
                      alt={trophy.label}
                      className={`h-full w-full object-cover rounded-lg ${
                        trophy.grayscale ? "grayscale" : ""
                      }`}
                    />
                  </CardContent>
                </Card>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={`/images/trophees/${trophy.id}.png`}
                    alt={trophy.label}
                    className={`h-16 w-16 object-cover rounded-lg ${
                      trophy.grayscale ? "grayscale" : ""
                    }`}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">{trophy.label}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {trophyDescriptions[trophy.id]}
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
        {Array.from({ length: 24 - trophyList.length }).map((_, index) => (
          <Card
            key={`empty-${index}`}
            className="border border-dashed bg-muted/10 aspect-square flex items-center justify-center"
          >
            <CardContent className="p-2">
              <span className="text-xs text-muted-foreground"></span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
