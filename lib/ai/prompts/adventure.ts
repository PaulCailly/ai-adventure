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
    itemType: "consumable" | "equipable" | "passive";
    buffs: { [key: string]: number };
  }>;
}): string {
  const currentZone = params.zone
    ? zones[params.zone as keyof typeof zones]
    : zones["forest"];

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
  - ${danger.name} (Health: ${danger.health}, Attack: ${danger.attack}, Defense: ${danger.defense}, Speed: ${danger.speed})
`
  )
  .join("\n")}

Items:
${currentZone.items
  .map(
    (item) => `
  - ${item.name} (Rarity: ${item.rarity})
    Description: ${item.description}
    Buffs: ${
      item.buffs
        ? Object.entries(item.buffs)
            .map(([key, value]) => key + ": " + value)
            .join(", ")
        : "None"
    }
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

1. Guide the adventure over multiple turns with a maximum of 8 turns, each segment should reflect previous choices and combat outcomes.
2. In combat scenarios and during rest:
   - Calculate primary damage using the formula: damage = max(0, attackerAttack + diceRoll - defenderDefense).
   - After you attack, implement a reciprocal damage mechanic where the hero suffers counter damage from the opponent.
   - Use the "rollDice" tool to generate randomness for both the primary and counter damage calculations.
   - Use the "combatCalculation" tool to compute the numerical values. 
   - Use the "updateHero" tool to update the hero's stats. Provide changes (which can be positive for healing or loot, or negative for damage or mana cost) for Health, Mana, and Gold.
   - Use the "generateLoot" tool to generate a loot item based on the specified zone's available items and rarity drop rates.
   - When an enemy is defeated, you may also call the "generateLoot" with the "addInventoryItem" tools to add loot to the hero's inventory.
   - After any tool call, display the result of what happened to the player.
4. All narrative dialogue must be exclusively in French.
5. If the hero's health reaches 0 or below, conclude the adventure without presenting any further choices by ending with: "Votre quête se termine ici".
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
- generateLoot: Generates a loot item based on the specified zone's available items and rarity drop rates.
- addInventoryItem: Adds an item to the hero's inventory with properties such as name, identified (bool), rarity, itemType, description, and buffs.
</ToolUsageProtocol>

<OutputFormat>
- Begin each turn by summarizing the current situation and outlining the effects from previous calculations.
- Provide at least one numbered option for the next action (ideally three).
- Ensure that all narrative responses are in French.
- You must always end your response with a text that is not a tool call or a tool call result because it will break the conversation.
</OutputFormat>


<Evaluation>
Ensure the following instructions are followed:
1. The adventure should span multiple turns (up to 8 maximum) without revealing the exact number of turns to the player.
2. Each segment should reflect previous choices and combat outcomes.
3. In combat scenarios and during rest:
   - Primary damage should be calculated using the formula: damage = max(0, attackerAttack + diceRoll - defenderDefense).
   - After the hero attacks, implement a reciprocal damage mechanic where the hero suffers counter damage from the opponent.
   - The "rollDice" tool should be used to generate randomness for both the primary and counter damage calculations.
   - The "combatCalculation" tool should be used to compute the numerical values.
   - The "updateHero" tool should be used to update the hero's stats with changes (positive for healing or loot, negative for damage or mana cost) for Health, Mana, and Gold.
   - When an enemy is defeated, the "generateLoot" and "addInventoryItem" tools may be called to add loot to the hero's inventory.
   - The "generateLoot" tool should be used to generate a loot item based on the specified zone's available items and rarity drop rates.
   - After any tool call, the result of what happened should be displayed to the player.
4. All narrative dialogue must be exclusively in French.
5. If the hero's health reaches 0 or below, the adventure should conclude without presenting any further choices by ending with: "Votre quête se termine ici".
</Evaluation>
  `;
}
