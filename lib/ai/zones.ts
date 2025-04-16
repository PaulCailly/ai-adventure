interface Danger {
  name: string;
  health: number;
  mana: number;
  attack: number;
  defense: number;
  speed: number;
  spawnChance?: number;
  isBoss?: boolean;
}

interface Zone {
  description: string;
  level: string;
  dangers: Danger[];
  lore: string;
}

export const zones: Record<string, Zone> = {
  market: {
    description: `Un marché animé où se mêlent marchands, artisans et aventuriers en quête de bonnes affaires. 
        Les stands débordent de potions, d'artefacts et d'équipements rares.`,
    level: "1-10",
    lore: `Au cœur de la ville, le marché est le centre du commerce et des échanges. 
        Ici, les aventuriers peuvent acheter des potions réparatrices, vendre leurs butins, ou encore payer pour l'identification et l'amélioration d'objets. 
        L'ambiance chaleureuse et animée contraste avec la rudesse de la vie en pleine aventure.`,
    dangers: [],
  },
  forest: {
    description: `Une forêt mystérieuse où les arbres anciens murmurent des secrets oubliés.
        Les ombres dansent entre les branches et des lueurs étranges attirent les voyageurs dans les profondeurs boisées.`,
    level: "11-15",
    lore: `On dit que la Forêt des Murmures Anciens était autrefois le royaume d'une civilisation elfique disparue.
    Les arbres auraient absorbé la magie et la mémoire de ce peuple, créant un endroit où la frontière entre les mondes matériel et spirituel s'estompe.
    
    Il y a longtemps, la reine elfe Elaria régnait sur cette forêt avec sagesse et grâce. Elle était connue pour sa profonde connexion avec la nature et sa capacité à communiquer avec les esprits de la forêt. Cependant, un sombre sorcier nommé Malakar chercha à corrompre la magie de la forêt pour son propre profit. Il libéra une malédiction qui transforma les créatures de la forêt en formes monstrueuses et transforma les esprits autrefois paisibles en entités vengeresses.

    Elaria, dans une tentative désespérée de sauver son peuple, réalisa un puissant rituel qui lia son esprit au cœur de la forêt. Cet acte arrêta la malédiction de Malakar mais à un grand coût. La forêt devint un lieu de crépuscule éternel, où les esprits des elfes et les créatures corrompues sont enfermés dans une lutte sans fin.

    Les voyageurs qui entrent dans la Forêt des Murmures Anciens parlent souvent d'entendre la voix d'Elaria dans le bruissement des feuilles, les guidant loin du danger. Certains disent que la forêt ne sera restaurée dans sa gloire d'antan que lorsqu'un héros émergera pour briser la malédiction et vaincre Malakar une fois pour toutes.

    La forêt abrite également diverses factions, chacune avec ses propres objectifs. Les Gardiens Sylvestres, un groupe de druides et de rangers, cherchent à protéger la forêt et ses secrets. La Confrérie de l'Ombre, une bande de voleurs et d'assassins, exploite les dangers de la forêt pour leur propre profit. Et l'Ordre de la Flamme Éternelle, un culte dédié à Malakar, travaille à étendre sa corruption.

    Au cœur de la forêt se trouve l'ancienne cité elfique d'Eldoria, maintenant en ruines. On dit que la bibliothèque de la ville détient la clé pour briser la malédiction, mais elle est gardée par une magie puissante et des créatures dangereuses. Seuls les aventuriers les plus courageux et les plus rusés osent la chercher.

    La Forêt des Murmures Anciens est un lieu de beauté et de danger, où la ligne entre la réalité et le mythe est floue. C'est une terre d'intrigues profondes, où chaque ombre cache un secret et chaque murmure raconte une histoire.
    
    Selon la légende le héro qui sauvera la forêt d'Elaria sera recompensé d'une la première partie de la Formule Secrète: "Joliement".
    `,

    dangers: [
      {
        name: "Sylvestre",
        health: 50,
        mana: 30,
        attack: 15,
        defense: 10,
        speed: 12,
        spawnChance: 0.15,
      },
      {
        name: "Cerf corrompu",
        health: 80,
        mana: 40,
        attack: 20,
        defense: 15,
        speed: 25,
        spawnChance: 0.12,
      },
      {
        name: "Renard corrompu",
        health: 40,
        mana: 20,
        attack: 10,
        defense: 7,
        speed: 20,
        spawnChance: 0.18,
      },
      {
        name: "Bandits",
        health: 60,
        mana: 20,
        attack: 18,
        defense: 12,
        speed: 14,
        spawnChance: 0.17,
      },
      {
        name: "Troll de la Forêt",
        health: 100,
        mana: 20,
        attack: 25,
        defense: 20,
        speed: 8,
        spawnChance: 0.1,
      },
      {
        name: "Sombre-Loup",
        health: 70,
        mana: 50,
        attack: 22,
        defense: 18,
        speed: 20,
        spawnChance: 0.16,
      },
      {
        name: "Vignes Enchantées",
        health: 40,
        mana: 60,
        attack: 10,
        defense: 25,
        speed: 5,
        spawnChance: 0.2,
      },
      {
        name: "Ancien Gardien",
        health: 250,
        mana: 200,
        attack: 35,
        defense: 30,
        speed: 10,
        spawnChance: 0.02,
        isBoss: true,
      },
      {
        name: "Sylva, l'esprit de la forêt",
        health: 300,
        mana: 250,
        attack: 40,
        defense: 35,
        speed: 12,
        spawnChance: 0.01,
        isBoss: true,
      },
    ],
  },
};
