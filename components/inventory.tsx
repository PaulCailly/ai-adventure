"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Loader2,
  Box,
  Trash2,
  CheckCircle,
  BadgeSwissFranc,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { InventoryItem } from "@/lib/db/schema";

interface InventoryProps {
  characterId: string;
}

export default function Inventory({ characterId }: InventoryProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const rarityColors: Record<string, string> = {
    commun: "text-white",
    "peu commun": "text-green-500",
    rare: "text-blue-500",
    épique: "text-purple-500",
    légendaire: "text-orange-500",
  };

  const rarityBorderColors: Record<string, string> = {
    commun: "border-white",
    "peu commun": "border-green-500",
    rare: "border-blue-500",
    épique: "border-purple-500",
    légendaire: "border-orange-500",
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

  async function handleSell(itemId: string) {
    try {
      const res = await fetch("/api/inventory/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });
      if (res.ok) {
        setItems((current) => current.filter((item) => item.id !== itemId));
      } else {
        console.error("Failed to sell inventory item");
      }
    } catch (error) {
      console.error("Error selling inventory item:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  const totalSlots = 24;
  const emptySlots = totalSlots - items.length;

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {items.map((item) => (
          <DropdownMenu key={item.id}>
            <DropdownMenuTrigger asChild>
              <div>
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
            <DropdownMenuContent className="w-64">
              <div className="p-4 border-b flex flex-col gap-4">
                <div className="flex items-center space-x-4">
                  <Box className="h-12 w-12 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <Badge
                      variant="outline"
                      className={`text-xs w-fit ${getRarityColor(item.rarity)}`}
                    >
                      {item.rarity.charAt(0).toUpperCase() +
                        item.rarity.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Object.entries(item.buffs as Record<string, any>).map(
                    ([key, value]) => (
                      <span key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                        {typeof value === "number" && value > 0
                          ? `+${value}`
                          : String(value)}
                        <br />
                      </span>
                    )
                  )}
                </p>
              </div>
              <DropdownMenuItem onClick={() => handleSell(item.id)}>
                <BadgeSwissFranc className="mr-2 h-4 w-4" />
                Sell
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDiscard(item.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Discard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
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
    </div>
  );
}
