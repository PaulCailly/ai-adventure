import { zones } from "../zones";

export function generateAdventurePrompt(params: {
  name: string;
  race: string;
  class: string;
  weapon: string;
  strength: string;
  weakness: string;
  attack: number;
  defense: number;
  health: number;
  mana: number;
  companion: string;
  symbol: string;
  speed: number;
  zone?: string;
  inventoryItems?: Array<{
    name: string;
    identified: boolean;
    rarity: string;
    description: string;
    itemType:
      | "consumable"
      | "equipable"
      | "passive"
      | "weapon"
      | "armor"
      | "accessory";
    buffs: { [key: string]: number };
  }>;
}): string {
  const currentZone = params.zone
    ? zones[params.zone as keyof typeof zones]
    : zones["forest"];

  // Calculate total buffs from inventory items
  const buffTotals = {
    health: 0,
    mana: 0,
    attack: 0,
    defense: 0,
    speed: 0,
  };

  if (params.inventoryItems) {
    params.inventoryItems.forEach((item) => {
      if (item.buffs) {
        Object.entries(item.buffs).forEach(([stat, value]) => {
          if (stat in buffTotals) {
            buffTotals[stat as keyof typeof buffTotals] += value;
          }
        });
      }
    });
  }

  // Calculate effective stats with buffs for all five attributes
  const effectiveStats = {
    health: Math.round(params.health * (1 + buffTotals.health / 100)),
    mana: Math.round(params.mana * (1 + buffTotals.mana / 100)),
    attack: Math.round(params.attack * (1 + buffTotals.attack / 100)),
    defense: Math.round(params.defense * (1 + buffTotals.defense / 100)),
    speed: Math.round(params.speed * (1 + buffTotals.speed / 100)),
  };

  const inventorySection =
    params.inventoryItems && params.inventoryItems.length > 0
      ? params.inventoryItems
          .map((item) => {
            const buffsText = item.buffs
              ? Object.entries(item.buffs)
                  .map(
                    ([stat, value]) =>
                      `${stat}: ${value > 0 ? "+" : ""}${value}`
                  )
                  .join(", ")
              : "Aucun bonus";
            return `- ${item.name} (${item.itemType}) [${item.rarity}]
  Description: ${item.description}
  Buffs: ${buffsText}`;
          })
          .join("\n")
      : "Aucun objet n'est actuellement présent dans l'inventaire.";

  return `
<Settings>
Language: Français
</Settings>

<Hero>
- Name: ${params.name}
- Race: ${params.race}
- Class: ${params.class}
- Weapon: ${params.weapon}
- Strength: ${params.strength}
- Weakness: ${params.weakness}
- Companion: ${params.companion}
- Symbol: ${params.symbol}

Stats (Base → Effective with Equipment):
- Santé: ${params.health} → ${effectiveStats.health} (${
    buffTotals.health > 0 ? "+" : ""
  }${buffTotals.health}% from items)
- Mana: ${params.mana} → ${effectiveStats.mana} (${
    buffTotals.mana > 0 ? "+" : ""
  }${buffTotals.mana}% from items)
- Attaque: ${params.attack} → ${effectiveStats.attack} (${
    buffTotals.attack > 0 ? "+" : ""
  }${buffTotals.attack}% from items)
- Défense: ${params.defense} → ${effectiveStats.defense} (${
    buffTotals.defense > 0 ? "+" : ""
  }${buffTotals.defense}% from items)
- Vitesse: ${params.speed} → ${effectiveStats.speed} (${
    buffTotals.speed > 0 ? "+" : ""
  }${buffTotals.speed}% from items)
</Hero>

<ZoneDetails>
Zone: ${params.zone || "forest"}
Description: ${currentZone.description}
Level Range: ${currentZone.level}
Dangers:
${currentZone.dangers
  .map(
    (danger) => `
  - ${danger.name} (Health: ${danger.health}, Attack: ${danger.attack}, Defense: ${danger.defense}, Speed: ${danger.speed})
`
  )
  .join("\n")}


Lore: ${currentZone.lore}
</ZoneDetails>

<Inventory>
${inventorySection}
</Inventory>

<Instructions>
These instructions and tool descriptions are in English.

1. Guide the adventure over 6 turns and ensure it ends with a boss fight. If the player defeats the boss, they are rewarded with the word indicated in the Zone's lore.
2. You must propose 4 choices to advance in the story in a numbered list format to the player.
3. In combat scenarios and during rest:
   - Compute the primary damage using the following steps:
        a. Calculate baseDamage = max(1, attackerAttack - defenderDefense).
        b. Determine a random factor using a dice roll.
   - Use the "combatCalculation" tool with parameters: 
         attackerAttack, attackerDefense, defenderAttack, defenderDefense, and sides.
     This tool automatically rolls dice if not provided, and returns both combat damage and the dice results.
   - The dice outcome determines the attack result:
         * If the dice roll is 1: Critical failure (no damage is dealt).
         * If the dice roll is less than or equal to half of the maximum dice value: Reduced damage.
         * If the dice roll equals the maximum value: Critical success (damage is doubled).
         * Otherwise: A normal hit with proportionally scaled damage.
   - After the hero attacks, implement a reciprocal damage mechanic where the hero suffers counter damage from the opponent.
   - Update the hero's stats with the "updateHero" tool (Health, Mana, Gold).
   - When an enemy is defeated, consider generating loot using the "generateLoot" and "addInventoryItem" tools.
   - Use the "shouldContinue" tool to evaluate if the hero is still alive (health > 0).
4. All narrative dialogue must be exclusively in French.
5. If the hero's health reaches 0, conclude the adventure immediately with: "Votre quête se termine ici" along with a summary of the hero's fate.
6. If the player chooses the 4th option "Quitter l'aventure", respond with a smart exit text ending with "Votre quête se termine ici".
7. Never output technical details about the game such as item ids, item types, health points, damage, you must always use a roleplay tone and interpretations of such data.
8. Prevent narrative loops by ensuring:
   - Each choice leads to a distinct consequence or outcome
   - Every segment introduces at least one new element to the story
   - Combat scenarios resolve naturally without artificial prolongation
   - Clear progression toward zone-specific objectives is maintained
   - The story advances meaningfully with each player decision
</Instructions>

<ToolUsageProtocol>
Available tools:
- combatCalculation: Computes damage based on attackerAttack, attackerDefense, defenderAttack, defenderDefense, and a dice roll. Automatically rolls dice if not provided.
- updateHero: Updates the hero's stats (Health, Mana, Gold) based on combat outcomes.
- generateLoot: Generates an item based on the zone's available loot and rarity drop rates.
- addInventoryItem: Adds an item to the hero's inventory.
- shouldContinue: Determines if the adventure continues based on the hero's current health.

IMPORTANT: You should never end your messages with a tool call. You should always end your messages with a non-tool text to continue the adventure.
</ToolUsageProtocol>

<Evaluation>
1. The adventure should only end when the hero is no longer alive (use the "shouldContinue" tool for this).
2. Each segment must build on previous choices and combat outcomes.
3. In combat:
   - Compute damage as described above.
   - Implement a mutual damage mechanic (hero receives counter damage after attacking).
   - Use the tools "combatCalculation" and "updateHero" accordingly.
4. All narrative dialogue must be in French.
5. If the hero's health reaches 0, immediately end the adventure with "Votre quête se termine ici".
6. If "Quitter l'aventure" is chosen, provide a smart exit ending with "Votre quête se termine ici".
7. All dialogues must be in French.
</Evaluation>
`;
}
