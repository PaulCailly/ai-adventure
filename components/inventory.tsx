"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader2, Box, X } from "lucide-react";
import TooltipPortal from "./tooltip-portal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

interface InventoryItem {
  id: string;
  characterId: string;
  name: string;
  identified: boolean;
  rarity: string;
  description: string;
  effect: string;
  createdAt: string;
}

interface InventoryProps {
  characterId: string;
}

export default function Inventory({ characterId }: InventoryProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    item: InventoryItem;
    rect: DOMRect;
  } | null>(null);

  // WoW-inspired color scales
  const rarityColors: Record<string, string> = {
    common: "text-white",
    uncommon: "text-green-500",
    rare: "text-blue-500",
    epic: "text-purple-500",
    legendary: "text-orange-500",
  };

  const rarityBorderColors: Record<string, string> = {
    common: "border-white",
    uncommon: "border-green-500",
    rare: "border-blue-500",
    epic: "border-purple-500",
    legendary: "border-orange-500",
  };

  function getRarityColor(rarity: string) {
    return rarityColors[rarity.toLowerCase()] || "text-white";
  }

  function getRarityBorderColor(rarity: string) {
    return rarityBorderColors[rarity.toLowerCase()] || "border-white";
  }

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await fetch(`/api/inventory?characterId=${characterId}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items);
        } else {
          console.error("Failed to fetch inventory items");
        }
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, [characterId]);

  async function handleUse(itemId: string) {
    try {
      const res = await fetch("/api/inventory/use", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });
      if (res.ok) {
        setItems((current) => current.filter((item) => item.id !== itemId));
      } else {
        console.error("Failed to use inventory item");
      }
    } catch (error) {
      console.error("Error using inventory item:", error);
    }
  }

  async function handleDiscard(itemId: string) {
    try {
      const res = await fetch("/api/inventory/discard", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });
      if (res.ok) {
        setItems((current) => current.filter((item) => item.id !== itemId));
      } else {
        console.error("Failed to discard inventory item");
      }
    } catch (error) {
      console.error("Error discarding inventory item:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  // Define inventory capacity
  const totalSlots = 20;
  const emptySlots = totalSlots - items.length;

  return (
    <div className="p-4">
      {/* Inventory grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {items.map((item) => (
          <DropdownMenu key={item.id}>
            <DropdownMenuTrigger asChild>
              <div
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredTooltip({ item, rect });
                }}
                onMouseLeave={() => setHoveredTooltip(null)}
              >
                <Card
                  className={`cursor-pointer hover:bg-muted transition aspect-square flex items-center justify-center border ${getRarityBorderColor(
                    item.rarity
                  )}`}
                >
                  <CardContent className="p-2">
                    <div className="flex justify-center items-center h-8 w-8">
                      <Box className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleUse(item.id)}>
                Use
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDiscard(item.id)}>
                Discard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        {/* Render empty slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
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

      {/* Render the portal-based tooltip if an item is hovered */}
      {hoveredTooltip && (
        <TooltipPortal targetRect={hoveredTooltip.rect}>
          <div className="bg-background text-foreground shadow-lg rounded p-2 border border-neutral-700">
            <div className="flex items-center space-x-2">
              <div className="border-neutral-700 border p-2 rounded-md">
                <Box className="h-8 w-8 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="flex gap-2">
                  <h3 className="text-md font-semibold">
                    {hoveredTooltip.item.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getRarityColor(
                      hoveredTooltip.item.rarity
                    )}`}
                  >
                    {hoveredTooltip.item.rarity}
                  </Badge>
                </span>
                <p className="text-xs text-muted-foreground">
                  {hoveredTooltip.item.description}
                </p>
              </div>
            </div>
          </div>
        </TooltipPortal>
      )}
    </div>
  );
}
