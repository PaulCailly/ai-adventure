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
}): string {
  const currentZone = params.zone
    ? zones[params.zone as keyof typeof zones]
    : zones["forest"];

  return `
Language for Dialogue: French

<Hero>
- Name: ${params.name}
- Race: ${params.race}
- Class: ${params.class}
- Weapon: ${params.weapon}
- Strength: ${params.strength}
- Weakness: ${params.weakness}
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

<Instructions>
These instructions and tool descriptions are in English.

1. Guide the adventure over multiple turns (up to 8 maximum). Do not reveal the exact number of turns to the player.
2. Each segment should reflect previous choices and combat outcomes.
3. In combat scenarios:
   - Damage is calculated using the formula: damage = max(0, attackerAttack + diceRoll - defenderDefense).
   - Use the "combatCalculation" tool to compute numeric damage.
   - Utilize the "rollDice" tool to introduce randomness into combat.
4. All dialogue (narrative responses) must be exclusively in French.
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
</ToolUsageProtocol>

<OutputFormat>
- Begin each turn by summarizing the current situation and outlining the effects from previous calculations (using rollDice and combatCalculation).
- Provide at least one numbered option (ideally three) for the next action.
- Ensure that all narrative dialogue is in French.
</OutputFormat>
  `;
}
