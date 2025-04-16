import { InventoryItem } from "@/lib/db/schema";

interface Buffs {
  health?: number;
  mana?: number;
  attack?: number;
  defense?: number;
  speed?: number;
}

interface Danger {
  name: string;
  health: number;
  mana: number;
  attack: number;
  defense: number;
  speed: number;
}

interface Zone {
  description: string;
  level: string;
  dangers: Danger[];
  items: InventoryItem[];
  lore: string;
}

export const zones: Record<string, Zone> = {
  forest: {
    description: `A mysterious forest where ancient trees whisper forgotten secrets.
        Shadows dance between the branches and strange glows lure travelers into the wooded depths.`,
    level: "11-15",
    dangers: [
      {
        name: "Sylvan Spirits",
        health: 50,
        mana: 30,
        attack: 15,
        defense: 10,
        speed: 12,
      },
      {
        name: "Corrupted Beasts",
        health: 80,
        mana: 40,
        attack: 20,
        defense: 15,
        speed: 10,
      },
      {
        name: "Bandits",
        health: 60,
        mana: 20,
        attack: 18,
        defense: 12,
        speed: 14,
      },
      {
        name: "Forest Trolls",
        health: 100,
        mana: 20,
        attack: 25,
        defense: 20,
        speed: 8,
      },
      {
        name: "Shadow Wolves",
        health: 70,
        mana: 50,
        attack: 22,
        defense: 18,
        speed: 20,
      },
      {
        name: "Enchanted Vines",
        health: 40,
        mana: 60,
        attack: 10,
        defense: 25,
        speed: 5,
      },
    ],
    items: [
      {
        id: "1",
        characterId: "0",
        name: "Elven Artifacts",
        identified: true,
        rarity: "epic",
        description: "Ancient artifacts of the elves, imbued with magic.",
        itemType: "equipable",
        buffs: { attack: 10, defense: 5 },
        createdAt: new Date(),
      },
      {
        id: "2",
        characterId: "0",
        name: "Rare Herbs",
        identified: true,
        rarity: "rare",
        description: "Herbs with potent healing properties.",
        itemType: "consumable",
        buffs: { health: 10, defense: 2 },
        createdAt: new Date(),
      },
      {
        id: "3",
        characterId: "0",
        name: "Mana Crystals",
        identified: true,
        rarity: "legendary",
        description: "Crystals that restore mana and enhance spells.",
        itemType: "consumable",
        buffs: { mana: 30 },
        createdAt: new Date(),
      },
      {
        id: "4",
        characterId: "0",
        name: "Whispering Leaves",
        identified: true,
        rarity: "common",
        description: "Leaves that rustle with the secrets of the forest.",
        itemType: "consumable",
        buffs: { mana: 5 },
        createdAt: new Date(),
      },
      {
        id: "5",
        characterId: "0",
        name: "Mystic Bark",
        identified: true,
        rarity: "uncommon",
        description: "Bark that strengthens the skin like armor.",
        itemType: "equipable",
        buffs: { defense: 3 },
        createdAt: new Date(),
      },
      {
        id: "6",
        characterId: "0",
        name: "Glimmering Dew",
        identified: true,
        rarity: "rare",
        description: "Dew that enhances agility and speed.",
        itemType: "consumable",
        buffs: { speed: 4 },
        createdAt: new Date(),
      },
      {
        id: "7",
        characterId: "0",
        name: "Ancient Rune Stone",
        identified: true,
        rarity: "epic",
        description: "A stone inscribed with runes that boost magical power.",
        itemType: "equipable",
        buffs: { mana: 20, attack: 5 },
        createdAt: new Date(),
      },
      {
        id: "8",
        characterId: "0",
        name: "Phantom Cloak",
        identified: true,
        rarity: "legendary",
        description: "A cloak that allows the wearer to blend into shadows.",
        itemType: "equipable",
        buffs: { speed: 10, defense: 5 },
        createdAt: new Date(),
      },
      {
        id: "9",
        characterId: "0",
        name: "Enchanted Acorns",
        identified: true,
        rarity: "common",
        description: "Acorns that can be thrown to distract enemies.",
        itemType: "consumable",
        buffs: { speed: 2 },
        createdAt: new Date(),
      },
      {
        id: "10",
        characterId: "0",
        name: "Spirit Lantern",
        identified: true,
        rarity: "uncommon",
        description: "A lantern that reveals hidden paths.",
        itemType: "equipable",
        buffs: { speed: 3 },
        createdAt: new Date(),
      },
      {
        id: "11",
        characterId: "0",
        name: "Forest Elixir",
        identified: true,
        rarity: "rare",
        description: "An elixir that heals wounds and restores vitality.",
        itemType: "consumable",
        buffs: { health: 15 },
        createdAt: new Date(),
      },
      {
        id: "12",
        characterId: "0",
        name: "Moonlit Arrow",
        identified: true,
        rarity: "epic",
        description: "An arrow that never misses its target.",
        itemType: "equipable",
        buffs: { attack: 8 },
        createdAt: new Date(),
      },
      {
        id: "13",
        characterId: "0",
        name: "Timeless Watch",
        identified: true,
        rarity: "legendary",
        description: "A watch that stops time for a brief moment.",
        itemType: "consumable",
        buffs: { speed: 15 },
        createdAt: new Date(),
      },
      {
        id: "14",
        characterId: "0",
        name: "Laughing Mushroom",
        identified: true,
        rarity: "common",
        description: "A mushroom that causes uncontrollable laughter.",
        itemType: "consumable",
        buffs: {},
        createdAt: new Date(),
      },
      {
        id: "15",
        characterId: "0",
        name: "Echoing Stone",
        identified: true,
        rarity: "uncommon",
        description: "A stone that echoes the sounds of the forest.",
        itemType: "consumable",
        buffs: { mana: 10 },
        createdAt: new Date(),
      },
      {
        id: "16",
        characterId: "0",
        name: "Fey Dust",
        identified: true,
        rarity: "rare",
        description: "Dust that enhances magical abilities.",
        itemType: "consumable",
        buffs: { mana: 20 },
        createdAt: new Date(),
      },
      {
        id: "17",
        characterId: "0",
        name: "Guardian's Amulet",
        identified: true,
        rarity: "epic",
        description: "An amulet that protects against dark magic.",
        itemType: "equipable",
        buffs: { defense: 10 },
        createdAt: new Date(),
      },
      {
        id: "18",
        characterId: "0",
        name: "Celestial Compass",
        identified: true,
        rarity: "legendary",
        description: "A compass that always points to the heart's desire.",
        itemType: "equipable",
        buffs: { speed: 5, mana: 5 },
        createdAt: new Date(),
      },
      {
        id: "19",
        characterId: "0",
        name: "Whimsical Wand",
        identified: true,
        rarity: "fun",
        description: "A wand that creates harmless illusions.",
        itemType: "consumable",
        buffs: {},
        createdAt: new Date(),
      },
      {
        id: "20",
        characterId: "0",
        name: "Eternal Flame",
        identified: true,
        rarity: "legendary",
        description:
          "A flame that never extinguishes, providing warmth and light.",
        itemType: "equipable",
        buffs: { attack: 5, defense: 5 },
        createdAt: new Date(),
      },
    ],
    lore: `It is said that the Forest of Ancient Whispers was once the realm of a vanished elven civilization.
        The trees are believed to have absorbed the magic and memory of this people, creating a place where the boundary between the material and spiritual worlds blurs.
        
        Long ago, the elven queen, Elaria, ruled this forest with wisdom and grace. She was known for her deep connection to nature and her ability to communicate with the spirits of the forest. However, a dark sorcerer named Malakar sought to corrupt the forest's magic for his own gain. He unleashed a curse that twisted the creatures of the forest into monstrous forms and turned the once-peaceful spirits into vengeful entities.

        Elaria, in a desperate attempt to save her people, performed a powerful ritual that bound her spirit to the heart of the forest. This act halted Malakar's curse but at a great cost. The forest became a place of eternal twilight, where the spirits of the elves and the corrupted creatures are locked in an endless struggle.

        Travelers who enter the Forest of Ancient Whispers often speak of hearing Elaria's voice in the rustling leaves, guiding them away from danger. Some say that the forest will only be restored to its former glory when a hero emerges to break the curse and defeat Malakar once and for all.

        The forest is also home to various factions, each with their own agendas. The Sylvan Guardians, a group of druids and rangers, seek to protect the forest and its secrets. The Shadow Syndicate, a band of thieves and assassins, exploit the forest's dangers for their own gain. And the Order of the Eternal Flame, a cult dedicated to Malakar, works to spread his corruption further.

        Deep within the forest lies the ancient elven city of Eldoria, now in ruins. It is said that the city's library holds the key to breaking the curse, but it is guarded by powerful magic and dangerous creatures. Only the bravest and most cunning adventurers dare to seek it out.

        The Forest of Ancient Whispers is a place of beauty and danger, where the line between reality and myth is blurred. It is a land of deep intrigue, where every shadow hides a secret and every whisper tells a story.`,
  },
};
