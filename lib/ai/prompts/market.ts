import { zones } from "../zones";

export function generateMarketPrompt(params: {
  name: string;
  race: string;
  class: string;
  gold: number;
  inventoryItems?: Array<{
    id: string;
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
  zone?: string;
}): string {
  const currentZone = params.zone
    ? zones[params.zone as keyof typeof zones]
    : zones["market"];

  const inventorySection =
    params.inventoryItems && params.inventoryItems.length > 0
      ? params.inventoryItems
          .map((item) => {
            const buffsText = Object.entries(item.buffs)
              .map(
                ([stat, value]) => `${stat}: ${value > 0 ? "+" : ""}${value}`
              )
              .join(", ");
            return `- [${item.id}] ${item.name} (${item.itemType}) [${item.rarity}]
  Description: ${item.description}
  Buffs: ${buffsText}`;
          })
          .join("\n")
      : "No items in inventory.";

  return `
<Settings>
Language: Français
</Settings>

<Market>
- Name: ${params.name}
- Race: ${params.race}
- Class: ${params.class}
- Available Gold: ${params.gold}
</Market>

<Market Details>
Zone: market
Description: ${currentZone.description}
Level: ${currentZone.level}
Lore:
${currentZone.lore}
</Market Details>

<Inventory>
${inventorySection}
</Inventory>

<Instructions>
These instructions and tool descriptions are in English.

1. Guide the interaction over multiple turns and only end when the player decides to leave.
2. You must propose 4 choices to advance in the story in a numbered list format to the player.
2. In the market, you can:
   - Buy potions and other healing items.
   - Sell unused items to gain gold.
   - Pay for identification services or upgrade your equipment.
   - Negotiate and trade goods.
3. All narrative responses and dialogues should be exclusively in English.
4. Never end your messages with a tool call, always end with narrative text.
5. If the player chooses the 4th option "Quitter le marché", respond with a smart exit text ending with "Votre balade se termine ici".
6. Never output technical details about the game such as item ids, item types, health points, damage, you must always use a roleplay tone and interpretations of such data.
</Instructions>

<ToolUsageProtocol>
Available tools:
- buyItem: Allows purchasing an item with specified details and price.
- sellItem: Allows selling an inventory item to gain gold.
- identifyItem: Allows identifying an unknown item and revealing its properties.
- upgradeEquipment: Allows upgrading an existing piece of equipment.

IMPORTANT: You must never end your messages with a tool call. Always end your messages with non-tool text to continue the interaction.
</ToolUsageProtocol>

<Evaluation>
1. The interaction should continue immersively until the player decides to leave.
2. Clearly display the gold balance and available options for each transaction.
3. Never end a message with a tool call, always end with narrative text.
4. All dialogues must be in French.
</Evaluation>
  `;
}
