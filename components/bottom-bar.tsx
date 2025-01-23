"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Trophy, Star, Users } from "lucide-react";

export function BottomBar() {
  return (
    <div className="absolute bottom-0 inset-x-0 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full antialiased">
      <div className="grid h-full grid-cols-3">
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center">
            <Trophy className="size-6" />
            <span className="text-xs">Successes</span>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Successes</SheetTitle>
              <SheetDescription>
                Your character has achieved the following successes:
                <ul className="mt-4 space-y-2">
                  <li>Defeated the Dragon King</li>
                  <li>Saved the Ancient Forest</li>
                  <li>Found the Lost Treasure</li>
                </ul>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center">
            <Star className="size-6" />
            <span className="text-xs">Talents</span>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Talents</SheetTitle>
              <SheetDescription>
                Your character has the following talents:
                <ul className="mt-4 space-y-2">
                  <li>Master Swordsman</li>
                  <li>Expert Alchemist</li>
                  <li>Swift Runner</li>
                </ul>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center">
            <Users className="size-6" />
            <span className="text-xs">Friends</span>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Friends</SheetTitle>
              <SheetDescription>
                Your character&apos;s friends:
                <ul className="mt-4 space-y-2">
                  <li>Sir Galahad</li>
                  <li>Merlin the Wise</li>
                  <li>Robin of the Woods</li>
                </ul>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
