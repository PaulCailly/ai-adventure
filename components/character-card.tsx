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
  PlusCircle,
  ShoppingCart,
} from "lucide-react";
import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";

// Types for the buff breakdown
interface BuffDetail {
  name: string;
  value: number;
}

interface StatBuffs {
  health: number;
  mana: number;
  attack: number;
  defense: number;
  speed: number;
}

interface StatBuffDetails {
  health: BuffDetail[];
  mana: BuffDetail[];
  attack: BuffDetail[];
  defense: BuffDetail[];
  speed: BuffDetail[];
}

interface StatDropdownProps {
  label: string;
  base: number;
  buffTotal: number;
  buffDetails: BuffDetail[];
  icon: React.ReactNode;
  variant?: "inline" | "grid";
}

const computeEffectiveStat = (base: number, buffPercentage: number): number => {
  return Math.round(base * (1 + buffPercentage / 100));
};

// A small helper that wraps a stat value with a dropdown.
// In variant "inline" it is rendered as an inline row (e.g. for health/mana overlay),
// while in variant "grid" it shows the icon above the value and label.
const StatDropdown = ({
  label,
  base,
  buffTotal,
  buffDetails,
  icon,
  variant = "inline",
}: StatDropdownProps) => {
  const effectiveStat = computeEffectiveStat(base, buffTotal);
  // Filter out bonuses that are 0 before rendering equipment details.
  const filteredBuffDetails = buffDetails.filter(
    (detail) => detail.value !== 0
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "grid" ? (
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg cursor-pointer">
            {icon}
            <span className="font-bold">{effectiveStat}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 cursor-pointer">
            {icon}
            <span className="text-white font-bold">{effectiveStat}</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4">
        <div className="text-sm">
          <div>
            <strong>{label}</strong>
          </div>
          <div>Base: {base}</div>
          <div>Bonus: {buffTotal}%</div>
          <div>Total: {effectiveStat}</div>
          {filteredBuffDetails.length > 0 && (
            <>
              <div className="mt-2">
                <strong>Équipements</strong>
              </div>
              <ul className="list-disc list-inside">
                {filteredBuffDetails.map((detail, index) => (
                  <li key={index}>
                    {detail.name}:{" "}
                    {detail.value > 0
                      ? `+${detail.value}%`
                      : `${detail.value}%`}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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

  // Local state for heal button cooldown and current health
  const [healLoading, setHealLoading] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [currentHealth, setCurrentHealth] = useState<number>(character.health);

  // States for buff totals and breakdowns sourced from the inventory items
  const [buffTotals, setBuffTotals] = useState<StatBuffs>({
    health: 0,
    mana: 0,
    attack: 0,
    defense: 0,
    speed: 0,
  });

  const [buffDetails, setBuffDetails] = useState<StatBuffDetails>({
    health: [],
    mana: [],
    attack: [],
    defense: [],
    speed: [],
  });

  // Utility to convert seconds into a formatted string.
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Fetch the current heal cooldown from the server.
  async function fetchCooldown() {
    try {
      const res = await fetch(`/api/heal/status?characterId=${character.id}`);
      if (res.ok) {
        const data = await res.json();
        setCooldownRemaining(data.cooldownRemaining);
      }
    } catch (err) {
      console.error("Error fetching heal cooldown", err);
    }
  }

  // Initial cooldown fetch.
  useEffect(() => {
    fetchCooldown();
  }, [character.id]);

  // Tick-down cooldown every second.
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch the inventory items for this character and calculate the buffs.
  useEffect(() => {
    async function fetchInventoryBuffs() {
      try {
        const res = await fetch(`/api/inventory?characterId=${character.id}`);
        if (res.ok) {
          const data = await res.json();
          const totals: StatBuffs = {
            health: 0,
            mana: 0,
            attack: 0,
            defense: 0,
            speed: 0,
          };
          const details: StatBuffDetails = {
            health: [],
            mana: [],
            attack: [],
            defense: [],
            speed: [],
          };
          data.items.forEach((item: any) => {
            if (item.identified && item.buffs) {
              Object.entries(item.buffs).forEach(([key, value]) => {
                if (
                  ["health", "mana", "attack", "defense", "speed"].includes(key)
                ) {
                  const numericValue = Number(value) || 0;
                  totals[key as keyof StatBuffs] += numericValue;
                  details[key as keyof StatBuffDetails].push({
                    name: item.name,
                    value: numericValue,
                  });
                }
              });
            }
          });
          setBuffTotals(totals);
          setBuffDetails(details);
        } else {
          console.error("Failed to fetch inventory buffs");
        }
      } catch (error) {
        console.error("Error fetching inventory buffs", error);
      }
    }
    fetchInventoryBuffs();
  }, [character.id]);

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
            health: currentHealth,
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

  const handleHeal = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (healLoading) return;
    if (currentHealth >= 100) {
      toast.error("Votre santé est déjà à 100.");
      return;
    }
    if (cooldownRemaining > 0) {
      toast.error(
        `Vous devez attendre encore ${formatTime(
          cooldownRemaining
        )} avant de vous soigner.`
      );
      return;
    }
    setHealLoading(true);
    try {
      const response = await fetch("/api/heal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: character.id }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(data.message || "Vous avez été soigné !");
        setCurrentHealth(data.newHealth);
        fetchCooldown();
      } else {
        toast.error(
          data.message || "Vous ne pouvez pas vous soigner maintenant."
        );
      }
    } catch (error) {
      console.error("Error healing:", error);
      toast.error("Erreur lors des soins.");
    } finally {
      setHealLoading(false);
    }
  };

  const handleForestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentHealth < 0) {
      toast.error("Votre santé est insuffisante pour l'aventure.", {
        position: "bottom-center",
      });
      return;
    }
    if (character.name === "Lucas") {
      toast.error(
        "Vous devez être niveau 11 minimum pour accéder à cette zone.",
        {
          position: "bottom-center",
        }
      );
      return;
    }
    router.push(`/adventure`);
  };

  // New handler for the Market button without opening hours check
  const handleMarketClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/market`);
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
            <StatDropdown
              variant="inline"
              label="Santé"
              base={currentHealth}
              buffTotal={buffTotals.health}
              buffDetails={buffDetails.health}
              icon={<Heart className="size-4 text-red-500" />}
            />
            <StatDropdown
              variant="inline"
              label="Mana"
              base={character.mana}
              buffTotal={buffTotals.mana}
              buffDetails={buffDetails.mana}
              icon={<Sparkle className="size-4 text-blue-500" />}
            />
          </div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
              <Loader2 className="animate-spin h-8 w-8 text-white" />
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <StatDropdown
              variant="grid"
              label="Attaque"
              base={character.attack}
              buffTotal={buffTotals.attack}
              buffDetails={buffDetails.attack}
              icon={<Sword className="size-4" />}
            />
            <StatDropdown
              variant="grid"
              label="Défense"
              base={character.defense}
              buffTotal={buffTotals.defense}
              buffDetails={buffDetails.defense}
              icon={<Shield className="size-4" />}
            />
            <StatDropdown
              variant="grid"
              label="Vitesse"
              base={character.speed}
              buffTotal={buffTotals.speed}
              buffDetails={buffDetails.speed}
              icon={<Zap className="size-4" />}
            />
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

      {/* Heal button */}
      <Link href="#" onClick={handleHeal} className="w-full">
        <Card className="hover:opacity-90 transition-all duration-200 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="py-4 px-5">
            <div className="flex justify-between items-center gap-3 min-w-0">
              <div className="flex flex-row gap-2 min-w-0 items-center">
                <PlusCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    Se reposer
                  </h3>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-xs font-normal flex-shrink-0"
              >
                {cooldownRemaining > 0
                  ? formatTime(cooldownRemaining)
                  : "Disponible"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Market button */}
      {character.name !== "Lucas" && (
        <Link href="#" onClick={handleMarketClick} className="w-full">
          <Card className="hover:opacity-90 transition-all duration-200 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="py-4 px-5">
              <div className="flex justify-between items-center gap-3 min-w-0">
                <div className="flex flex-row gap-2 min-w-0 items-center">
                  <ShoppingCart className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      Marché
                    </h3>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs font-normal flex-shrink-0"
                >
                  Ouvert
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Forest button */}
      <Link href="#" onClick={handleForestClick} className="w-full">
        <Card className="hover:opacity-90 transition-all duration-200 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="py-4 px-5">
            <div className="flex justify-between items-center gap-3 min-w-0">
              <div className="flex flex-row gap-2 min-w-0 items-center">
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
