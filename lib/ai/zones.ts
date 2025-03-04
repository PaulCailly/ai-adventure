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
  name: string;
  image: string;
  description: string;
  level: string;
  dangers: Danger[];
  lore: string;
}

export const zones: Record<string, Zone> = {
  market: {
    name: "Marché de Luneterne",
    image: "market.jpg",
    description: `Un marché animé où se mêlent marchands, artisans et aventuriers en quête de bonnes affaires. 
        Les stands débordent de potions, d'artefacts et d'équipements rares.`,
    level: "1-10",
    lore: `Au cœur de la ville, le marché est le centre du commerce et des échanges. 
        Ici, les aventuriers peuvent acheter des potions réparatrices, vendre leurs butins, ou encore payer pour l'identification et l'amélioration d'objets. 
        L'ambiance chaleureuse et animée contraste avec la rudesse de la vie en pleine aventure.`,
    dangers: [],
  },
  tombe_dragon: {
    name: "Tombe du Dragon Perdu",
    image: "tombe-dragon.jpg",
    description: `Une crypte ancienne et oubliée, cachée sous les ruines d'un temple draconique.
        L'air y est lourd et imprégné d'une magie ancienne. Des murmures résonnent entre les murs de pierre,
        vestiges des âmes tourmentées qui y sont piégées.`,
    level: "10-14",
    lore: `Après un combat épique, les aventuriers sont parvenus à récupérer un œuf de dragon,
    vestige d'une époque oubliée. En étudiant l'œuf, ils découvrent qu'il provient d'un dragon perdu,
    Leprestrix le Pointilleux, dont l'œuf fut volé il y a des siècles. Pour comprendre l'origine de l'œuf
    et son importance, ils doivent se rendre à la Tombe du Dragon Perdu, cachée au milieu d'une forêt
    et d'un désert, là où l'Ordre Draconique a été trahi.
    
    La Tombe du Dragon Perdu est le dernier sanctuaire de Leprestrix le Pointilleux, un dragon légendaire trahi par ses propres fidèles.
    Jadis, cette crypte était un lieu de culte où un ordre draconique vénérait leur maître ancestral. Mais un jour, dans leur soif de pouvoir,
    ils volèrent son œuf et tentèrent d'utiliser sa magie pour leurs propres desseins. Enragé par cette trahison, Sarthoryx maudit la crypte
    avant d'y trouver la mort, enfermant à jamais les âmes de ses traîtres disciples.
    
    Aujourd'hui, l'endroit est hanté par ces âmes perdues, gardé par des sentinelles de pierre et des ombres rampantes qui s'accrochent
    aux voyageurs imprudents. Ceux qui parviennent à traverser ces épreuves découvriront peut-être la vérité sur la trahison du dragon
    et trouveront un indice sur l'œuf disparu.
    
    Selon les légendes, celui qui percera le secret de cette crypte sera récompensé par une relique ancienne,
    où est gravé le premier mot de la Formule Secrète : "joliment".`,

    dangers: [
      {
        name: "Spectres du Culte Draconique",
        health: 45,
        mana: 60,
        attack: 18,
        defense: 10,
        speed: 14,
        spawnChance: 0.2,
      },
      {
        name: "Linceul Rampant",
        health: 70,
        mana: 40,
        attack: 22,
        defense: 15,
        speed: 12,
        spawnChance: 0.15,
      },
      {
        name: "Sentinelle de Pierre",
        health: 100,
        mana: 10,
        attack: 25,
        defense: 30,
        speed: 6,
        spawnChance: 0.12,
      },
      {
        name: "Dévoreur d'Ames",
        health: 90,
        mana: 80,
        attack: 30,
        defense: 18,
        speed: 10,
        spawnChance: 0.1,
      },
      {
        name: "Gardien Oublié",
        health: 200,
        mana: 150,
        attack: 40,
        defense: 35,
        speed: 8,
        spawnChance: 0.1,
        isBoss: true,
      },
      {
        name: "Leprestrix le Pointilleux",
        health: 350,
        mana: 300,
        attack: 50,
        defense: 40,
        speed: 10,
        spawnChance: 0.1,
        isBoss: true,
      },
    ],
  },

  monastre_trahi: {
    name: "Monastère Trahi",
    image: "monastère-trahi.jpg",
    description: `Un monastère en ruines, perché sur une falaise escarpée, balayé par des vents froids.
        Des runes brisées parsèment le sol, témoins d'un passé oublié. Des ombres hantent les couloirs,
        murmures des anciens moines tombés en disgrâce.`,
    level: "14-18",
    lore: `Guidés par les indices trouvés dans la Tombe du Dragon Perdu, les aventuriers découvrent que l'œuf de Leprestrix
    fut vendu par un ancien moine du nom d'Aedan. Fuyant la colère du dragon et les représailles de son ordre, il trouva refuge
    dans ce monastère autrefois sacré, maintenant abandonné et maudit.
    
    On raconte qu'Aedan aurait tenté de se racheter en écrivant un manuscrit relatant la vérité sur la trahison du dragon.
    Mais avant qu'il ne puisse livrer son message, une malédiction s'abattit sur lui et sur le monastère. Désormais, ses disciples
    errent sous forme de spectres et de créatures cauchemardesques, empêchant quiconque d'accéder aux vérités qu'ils ont voulu cacher.
    
    Celui qui percera le mystère de cet endroit découvrira une relique contenant le second mot de la Formule Secrète : "valoir".`,

    dangers: [
      {
        name: "Moines Damnés",
        health: 80,
        mana: 70,
        attack: 30,
        defense: 20,
        speed: 12,
        spawnChance: 0.2,
      },
      {
        name: "Gargouilles Animées",
        health: 100,
        mana: 50,
        attack: 35,
        defense: 30,
        speed: 10,
        spawnChance: 0.15,
      },
      {
        name: "Esprits Torturés",
        health: 90,
        mana: 80,
        attack: 40,
        defense: 25,
        speed: 14,
        spawnChance: 0.17,
      },
      {
        name: "Abomination du Rituel Brisé",
        health: 180,
        mana: 120,
        attack: 55,
        defense: 40,
        speed: 10,
        spawnChance: 0.08,
      },
      {
        name: "Gardien Spectral",
        health: 160,
        mana: 110,
        attack: 45,
        defense: 35,
        speed: 8,
        spawnChance: 0.1,
      },
      {
        name: "Spectre du Moine Aedan",
        health: 300,
        mana: 250,
        attack: 60,
        defense: 45,
        speed: 12,
        spawnChance: 0.08,
        isBoss: true,
      },
    ],
  },
  voie_errants: {
    name: "Voie des Errants",
    image: "voie-errants.jpg",
    description: `Un passage spectral entre réalité et illusion, où le temps se distord et les âmes perdues murmurent leurs regrets.
      La Voie des Errants est un lieu où les vérités oubliées sont révélées, mais au prix d'un lourd tribut.`,
    level: "18-22",
    lore: `Après avoir vaincu le Spectre du Moine Aedan, les aventuriers découvrent un parchemin scellé de son propre sang.
  Ce document n'est ni une confession, ni une prière, mais une invitation cryptique menant vers un endroit oublié.
  
  La Voie des Errants est un lieu de transition entre les mondes, une route où la réalité se courbe et où les souvenirs
  deviennent tangibles. Ceux qui s'y aventurent doivent affronter leurs propres peurs et distinguer l'illusion de la vérité.
  
  Mais cette route est piégée. Des entités anciennes rôdent, cherchant à détourner les voyageurs de leur chemin,
  et un mystérieux masque rieur apparaît à chaque carrefour, guidant ou trompant ceux qui osent avancer.
  
  Selon les écrits d'Aedan, seul celui qui comprendra le véritable sens de cette route pourra découvrir
  l'ultime vérité… et atteindre la destination inconnue, marquée par le dernier mot de la Formule Secrète : "reliure".`,
    dangers: [
      {
        name: "Les Masques Gris",
        health: 120,
        mana: 100,
        attack: 50,
        defense: 35,
        speed: 14,
        spawnChance: 0.2,
      },
      {
        name: "Les Ombres Mnésiques",
        health: 140,
        mana: 120,
        attack: 55,
        defense: 40,
        speed: 10,
        spawnChance: 0.15,
      },
      {
        name: "Le Rieur Sans Nom",
        health: 180,
        mana: 150,
        attack: 65,
        defense: 50,
        speed: 12,
        spawnChance: 0.12,
      },
      {
        name: "Le Passeur d'Outre-Monde",
        health: 200,
        mana: 180,
        attack: 70,
        defense: 55,
        speed: 14,
        spawnChance: 0.1,
      },
      {
        name: "Masque du Destin Oublié",
        health: 850,
        mana: 300,
        attack: 100,
        defense: 90,
        speed: 16,
        spawnChance: 0.05,
        isBoss: true,
      },
    ],
  },
};
