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
    description: `Une forêt mystérieuse où les arbres anciens murmurent des secrets oubliés.
        Les ombres dansent entre les branches et des lueurs étranges attirent les voyageurs dans les profondeurs boisées.`,
    level: "11-15",
    dangers: [
      {
        name: "Esprits Sylvestres",
        health: 50,
        mana: 30,
        attack: 15,
        defense: 10,
        speed: 12,
      },
      {
        name: "Bêtes Corrompues",
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
        name: "Trolls de la Forêt",
        health: 100,
        mana: 20,
        attack: 25,
        defense: 20,
        speed: 8,
      },
      {
        name: "Loups de l'Ombre",
        health: 70,
        mana: 50,
        attack: 22,
        defense: 18,
        speed: 20,
      },
      {
        name: "Vignes Enchantées",
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
        name: "Artefacts Elfes",
        identified: true,
        rarity: "épique",
        description: "Artefacts anciens des elfes, imprégnés de magie.",
        itemType: "équipable",
        buffs: { attack: 10, defense: 5 },
        createdAt: new Date(),
      },
      {
        id: "2",
        characterId: "0",
        name: "Herbes Rares",
        identified: true,
        rarity: "rare",
        description: "Herbes aux propriétés curatives puissantes.",
        itemType: "consommable",
        buffs: { health: 10, defense: 2 },
        createdAt: new Date(),
      },
      {
        id: "3",
        characterId: "0",
        name: "Cristaux de Mana",
        identified: true,
        rarity: "légendaire",
        description: "Cristaux qui restaurent le mana et améliorent les sorts.",
        itemType: "consommable",
        buffs: { mana: 30 },
        createdAt: new Date(),
      },
      {
        id: "4",
        characterId: "0",
        name: "Feuilles Murmurantes",
        identified: true,
        rarity: "commun",
        description: "Feuilles qui bruissent avec les secrets de la forêt.",
        itemType: "consommable",
        buffs: { mana: 5 },
        createdAt: new Date(),
      },
      {
        id: "5",
        characterId: "0",
        name: "Écorce Mystique",
        identified: true,
        rarity: "peu commun",
        description: "Écorce qui renforce la peau comme une armure.",
        itemType: "équipable",
        buffs: { defense: 3 },
        createdAt: new Date(),
      },
      {
        id: "6",
        characterId: "0",
        name: "Rosée Scintillante",
        identified: true,
        rarity: "rare",
        description: "Rosée qui améliore l'agilité et la vitesse.",
        itemType: "consommable",
        buffs: { speed: 4 },
        createdAt: new Date(),
      },
      {
        id: "7",
        characterId: "0",
        name: "Pierre Runique Ancienne",
        identified: true,
        rarity: "épique",
        description:
          "Une pierre gravée de runes qui booste le pouvoir magique.",
        itemType: "équipable",
        buffs: { mana: 20, attack: 5 },
        createdAt: new Date(),
      },
      {
        id: "8",
        characterId: "0",
        name: "Cape Fantôme",
        identified: true,
        rarity: "légendaire",
        description:
          "Une cape qui permet à son porteur de se fondre dans les ombres.",
        itemType: "équipable",
        buffs: { speed: 10, defense: 5 },
        createdAt: new Date(),
      },
      {
        id: "9",
        characterId: "0",
        name: "Glands Enchantés",
        identified: true,
        rarity: "commun",
        description:
          "Glands qui peuvent être lancés pour distraire les ennemis.",
        itemType: "consommable",
        buffs: { speed: 2 },
        createdAt: new Date(),
      },
      {
        id: "10",
        characterId: "0",
        name: "Lanterne Spirituelle",
        identified: true,
        rarity: "peu commun",
        description: "Une lanterne qui révèle des chemins cachés.",
        itemType: "équipable",
        buffs: { speed: 3 },
        createdAt: new Date(),
      },
      {
        id: "11",
        characterId: "0",
        name: "Élixir de la Forêt",
        identified: true,
        rarity: "rare",
        description:
          "Un élixir qui guérit les blessures et restaure la vitalité.",
        itemType: "consommable",
        buffs: { health: 15 },
        createdAt: new Date(),
      },
      {
        id: "12",
        characterId: "0",
        name: "Flèche au Clair de Lune",
        identified: true,
        rarity: "épique",
        description: "Une flèche qui ne manque jamais sa cible.",
        itemType: "équipable",
        buffs: { attack: 8 },
        createdAt: new Date(),
      },
      {
        id: "13",
        characterId: "0",
        name: "Montre Intemporelle",
        identified: true,
        rarity: "légendaire",
        description: "Une montre qui arrête le temps pendant un bref instant.",
        itemType: "consommable",
        buffs: { speed: 15 },
        createdAt: new Date(),
      },
      {
        id: "14",
        characterId: "0",
        name: "Champignon Rieur",
        identified: true,
        rarity: "commun",
        description: "Un champignon qui provoque un rire incontrôlable.",
        itemType: "consommable",
        buffs: {},
        createdAt: new Date(),
      },
      {
        id: "15",
        characterId: "0",
        name: "Pierre Écho",
        identified: true,
        rarity: "peu commun",
        description: "Une pierre qui répercute les sons de la forêt.",
        itemType: "consommable",
        buffs: { mana: 10 },
        createdAt: new Date(),
      },
      {
        id: "16",
        characterId: "0",
        name: "Poussière de Fée",
        identified: true,
        rarity: "rare",
        description: "Poussière qui améliore les capacités magiques.",
        itemType: "consommable",
        buffs: { mana: 20 },
        createdAt: new Date(),
      },
      {
        id: "17",
        characterId: "0",
        name: "Amulette du Gardien",
        identified: true,
        rarity: "épique",
        description: "Une amulette qui protège contre la magie noire.",
        itemType: "équipable",
        buffs: { defense: 10 },
        createdAt: new Date(),
      },
      {
        id: "18",
        characterId: "0",
        name: "Boussole Céleste",
        identified: true,
        rarity: "légendaire",
        description: "Une boussole qui pointe toujours vers le désir du cœur.",
        itemType: "équipable",
        buffs: { speed: 5, mana: 5 },
        createdAt: new Date(),
      },
      {
        id: "19",
        characterId: "0",
        name: "Baguette Fantaisiste",
        identified: true,
        rarity: "peu commun",
        description: "A wand that creates harmless illusions.",
        itemType: "consumable",
        buffs: {},
        createdAt: new Date(),
      },
      {
        id: "20",
        characterId: "0",
        name: "Flamme Éternelle",
        identified: true,
        rarity: "legendary",
        description:
          "A flame that never extinguishes, providing warmth and light.",
        itemType: "equipable",
        buffs: { attack: 5, defense: 5 },
        createdAt: new Date(),
      },
    ],
    lore: `On dit que la Forêt des Murmures Anciens était autrefois le royaume d'une civilisation elfique disparue.
        Les arbres auraient absorbé la magie et la mémoire de ce peuple, créant un endroit où la frontière entre les mondes matériel et spirituel s'estompe.
        
        Il y a longtemps, la reine elfe Elaria régnait sur cette forêt avec sagesse et grâce. Elle était connue pour sa profonde connexion avec la nature et sa capacité à communiquer avec les esprits de la forêt. Cependant, un sombre sorcier nommé Malakar chercha à corrompre la magie de la forêt pour son propre profit. Il libéra une malédiction qui transforma les créatures de la forêt en formes monstrueuses et transforma les esprits autrefois paisibles en entités vengeresses.

        Elaria, dans une tentative désespérée de sauver son peuple, réalisa un puissant rituel qui lia son esprit au cœur de la forêt. Cet acte arrêta la malédiction de Malakar mais à un grand coût. La forêt devint un lieu de crépuscule éternel, où les esprits des elfes et les créatures corrompues sont enfermés dans une lutte sans fin.

        Les voyageurs qui entrent dans la Forêt des Murmures Anciens parlent souvent d'entendre la voix d'Elaria dans le bruissement des feuilles, les guidant loin du danger. Certains disent que la forêt ne sera restaurée dans sa gloire d'antan que lorsqu'un héros émergera pour briser la malédiction et vaincre Malakar une fois pour toutes.

        La forêt abrite également diverses factions, chacune avec ses propres objectifs. Les Gardiens Sylvestres, un groupe de druides et de rangers, cherchent à protéger la forêt et ses secrets. La Confrérie de l'Ombre, une bande de voleurs et d'assassins, exploite les dangers de la forêt pour leur propre profit. Et l'Ordre de la Flamme Éternelle, un culte dédié à Malakar, travaille à étendre sa corruption.

        Au cœur de la forêt se trouve l'ancienne cité elfique d'Eldoria, maintenant en ruines. On dit que la bibliothèque de la ville détient la clé pour briser la malédiction, mais elle est gardée par une magie puissante et des créatures dangereuses. Seuls les aventuriers les plus courageux et les plus rusés osent la chercher.

        La Forêt des Murmures Anciens est un lieu de beauté et de danger, où la ligne entre la réalité et le mythe est floue. C'est une terre d'intrigues profondes, où chaque ombre cache un secret et chaque murmure raconte une histoire.`,
  },
};
