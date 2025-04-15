import { zones } from "../zones";

export function generateAdventurePrompt(params: {
  name: string;
  race: string;
  class: string;
  weapon: string;
  strength: string;
  weakness: string;
  companion: string;
  symbol: string;
  zone?: string;
  inventoryItems?: Array<{
    name: string;
    identified: boolean;
    rarity: string;
    description: string;
    effect: string;
  }>;
}): string {
  const currentZone = params.zone
    ? zones[params.zone as keyof typeof zones]
    : zones["forest"];

  const inventorySection =
    params.inventoryItems && params.inventoryItems.length > 0
      ? params.inventoryItems
          .map(
            (item) =>
              `- ${item.name} [${item.rarity}]: ${item.description} ${
                item.effect ? "— " + item.effect : ""
              }`
          )
          .join("\n")
      : "Aucun objet n'est actuellement présent dans l'inventaire.";

  return `
Language for Dialogue: French

<Hero>
- Name: ${params.name}
- Race: ${params.race}
- Class: ${params.class}
- Weapon: ${params.weapon}
- Strength: ${params.strength}
- Weakness: ${params.weakness}
- Companion: ${params.companion}
- Symbol: ${params.symbol}
</Hero>

<ZoneDetails>
Zone: ${params.zone || "forest"}
Description: ${currentZone.description}
Level Range: ${currentZone.level}
Dangers:
${currentZone.dangers
  .map(
    (danger) => `
  - ${danger.name} (Health: ${danger.stats.health}, Attack: ${
      danger.stats.attack
    }, Defense: ${danger.stats.defense})
    Effects: ${danger.effects
      .map(
        (effect) =>
          effect.name +
          " (Potency: " +
          effect.potency +
          ", Duration: " +
          effect.duration +
          ", Chance: " +
          effect.chance +
          ")"
      )
      .join(", ")}
`
  )
  .join("\n")}

Treasures:
${currentZone.treasures
  .map(
    (treasure) => `
  - ${treasure.name} (Value: ${treasure.value})
    Stats: ${Object.entries(treasure.stats)
      .map(([key, value]) => key + ": " + value)
      .join(", ")}
    Effects: ${treasure.effects
      .map(
        (effect) =>
          effect.name +
          " (Potency: " +
          effect.potency +
          ", Duration: " +
          effect.duration +
          ", Chance: " +
          effect.chance +
          ")"
      )
      .join(", ")}
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

1. Guide the adventure over multiple turns (up to 8 maximum). Do not reveal the exact number of turns to the player.
2. Each segment should reflect previous choices and combat outcomes.
3. In combat scenarios and during rest:
   - Calculate primary damage using the formula: damage = max(0, attackerAttack + diceRoll - defenderDefense).
   - After you attack, implement a reciprocal damage mechanic where the hero suffers counter damage from the opponent.
   - Use the "rollDice" tool to generate randomness for both the primary and counter damage calculations.
   - Use the "combatCalculation" tool to compute the numerical values.
   - Use the "updateHero" tool to update the hero's stats. Provide changes (which can be positive for healing or loot, or negative for damage or mana cost) for Health, Mana, and Gold.
   - When an enemy is defeated, you may also call the "addInventoryItem" tool to add loot to the hero's inventory.
   - After any tool call, display the result of what happened to the player.
4. All narrative dialogue must be exclusively in French.
5. On the final turn, conclude the adventure without presenting any further choices by ending with: "Votre quête se termine ici".
</Instructions>

<ToolUsageProtocol>
Available tools:
- rollDice: Generates a random number (parameter: sides, range: 2 to 20) to produce chance in combat.
- combatCalculation: Computes actual damage during combat. It requires:
  * attackerAttack (number): The attacking entity's attack value.
  * defenderDefense (number): The defending entity's defense value.
  * sides (number): The dice's number of sides (from 2 to 20).
  
  The calculation is: damage = max(0, attackerAttack + diceRoll - defenderDefense).
- updateHero: Updates the hero's stats (Health, Mana, and Gold) by adding the provided values.
- addInventoryItem: Adds an item to the hero's inventory with properties such as name, identified (bool), rarity, description, and effect.
</ToolUsageProtocol>

<OutputFormat>
- Begin each turn by summarizing the current situation and outlining the effects from previous calculations.
- Provide at least one numbered option for the next action (ideally three).
- Ensure that all narrative responses are in French.
</OutputFormat>
  `;
}
