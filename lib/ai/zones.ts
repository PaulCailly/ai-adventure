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
    name: "Tombe du Dragon Leprestrix",
    image: "tombe-dragon.jpg",
    description: `Une crypte oubliée, enfouie sous les ruines moussues d'un temple draconique au cœur de la province de la Nupesse.
        L'air y est chargé de magie ancienne et d'une tension palpable. Les murs suintent d'humidité, porteurs de murmures perdus,
        échos de trahisons immémoriales et de l'agonie d'un dragon oublié.`,
    level: "10-14",
    lore: `Après une aventure épique, Lucas et sa guilde ont réussi à récupérer, avant de se le refaire prendre, un œuf de dragon lors d'un affrontement contre un guerrier inconnu.
    Cherchant à comprendre la provenance de cet artefact, ils découvrent qu'il s'agit de l'œuf de **Leprestrix le Pointilleux**, 
    un dragon légendaire qui régnait il y a peu sur la province de la Nupesse. 

    Leprestrix était un être pacifique et sage, adoré pour sa bienveillance. Il était entouré de **l'Ordre Epitechien**, 
    un groupe de moines qui le servaient fidèlement... du moins en apparence. Car au fil du temps, des membres corrompus par la secte des Saloupiens
    s'infiltrèrent dans l'Ordre. Ils fomentèrent un complot : voler l'œuf de Leprestrix pour en exploiter la puissance et dominer la province.

    Trahi par ses plus proches alliés, Leprestrix fut abattu dans son propre sanctuaire. Son cri final maudit le lieu, 
    transformant la crypte en un tombeau hanté, où son esprit blessé demeure prisonnier, rongé par la douleur et la trahison.

    Aujourd'hui, la Tombe du Dragon est un endroit maudit, gardé par des créatures ténébreuses : spectres, sentinelles et monstres nés de la magie déformée.
    Aucun intrus ne peut quitter ces lieux sans avoir affronté la dernière épreuve : **le Spectre de Leprestrix lui-même**, 
    surgissant dans un rugissement spectral pour juger ceux qui osent le défier.

    Sa mort ne résoudra pas la malédiction mais elle révélera **une relique ancienne**. 
    Sur celle-ci sera gravé le **premier mot de la Formule Secrète** permettant à Lucas de tenter de percer le mystère de sa présence ici : **"joliment"**.`,

    dangers: [
      {
        name: "Spectres du Culte Epitechien",
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
        isBoss: false,
      },
      {
        name: "Spectre de Leprestrix le Pointilleux",
        health: 300,
        mana: 350,
        attack: 60,
        defense: 45,
        speed: 12,
        spawnChance: 1.0,
        isBoss: true,
      },
    ],
  },
  fort_gaultier: {
    name: "Fort Gaultier",
    image: "fort-gaultier.jpg",
    description: `Une forteresse austère et lugubre, nichée dans les hauteurs rocheuses à la frontière de la Nupesse.
        Entourée de brumes empoisonnées et de cris lointains, elle sert désormais de prison aux opposants du régime Saloupien.`,
    level: "14-19",
    lore: `Lucas a reçu un message de Pierre Defoyer :
    une âme proche de Leprestrix, **emprisonnée dans le Fort Gaultier**, détient des informations vitales sur les événements passés. Après avoir rassemblé davantage d'alliés pour renforcer sa Guilde et atteindre le fort. Il prend d'assaut le fort ! 

    Ce prisonnier, dont l'identité est tenue secrète, serait un ancien membre de **l'Ordre Epitechien** et haut responsable de la **Résistance** contre la secte des Saloupiens.

    Le Fort Gaultier est dirigé par un sadique tyrannique connu sous le nom de **Depardrix**, un loup-garou mégalomane, misogyne et complètement désaxé, qui règne sur ses captifs avec brutalité.

    Lucas et sa guilde doivent infiltrer la prison, éviter les civils innocents, et affronter la milice du fort – composée de loups-garous sauvages et de soldats fanatiques.

    Au cœur du bastion, un combat sans merci les attend contre **Depardrix**, qui garde les clés de la cellule d'un prisonnier qui se révelera, après la mort au combat de Depardrix, lors de l'ouverture de sa cellule à être : **le moine Aedan**.

    Une fois délivré, Aedan révéle son fort lien avec Leprestrix et la guerre contre Trumpelanus et sa secte des Saloupiens. Il explique aussi qu'il est à l'origine de la malédiction de Lucas, qu'il a besoin de Lui pour sauver la Nupesse ! Avant de repartir

    🎁 Lucas repère dans la cellule ,une nouvelle **relique**, une peau marquée du mot : **"valoir"** – le deuxième élément de la Formule Secrète.`,

    dangers: [
      {
        name: "Loups-Garous du Bastion",
        health: 90,
        mana: 40,
        attack: 35,
        defense: 20,
        speed: 14,
        spawnChance: 0.2,
      },
      {
        name: "Chiens de Garde Déchainés",
        health: 70,
        mana: 20,
        attack: 25,
        defense: 15,
        speed: 16,
        spawnChance: 0.18,
      },
      {
        name: "Gardes Saloupiens",
        health: 100,
        mana: 30,
        attack: 38,
        defense: 25,
        speed: 12,
        spawnChance: 0.15,
      },
      {
        name: "Tortionnaire de la Tour",
        health: 120,
        mana: 60,
        attack: 45,
        defense: 30,
        speed: 10,
        spawnChance: 0.1,
      },
      {
        name: "Depardrix, Alpha du Fort",
        health: 300,
        mana: 100,
        attack: 60,
        defense: 40,
        speed: 12,
        spawnChance: 1.0,
        isBoss: true,
      },
    ],
  },
  "bibliotheque-du-savoir": {
    name: "La Bibliothèque du Savoir",
    image: "bibliotheque-du-savoir.jpg",
    description: `Une bibliothèque ancienne et mystérieuse, cachée dans les ruines d'un ancien temple.`,
    level: "19-24",
    lore: `
 Lucas et sa guilde doivent répondre à des **épreuves de sagesse** posées par les **Sages Drouet**, pour mériter l'accès à un **livre unique** dans lequel il vont découvrir le dernier morceau de la formule secrète: "Reliure", écrit à travers les âges par les peuples libres.
 Pour obtenir le livre, il faut répondre à toutes les questions suivantes sans faire d'erreur. Si une réponse est fausse, le joueur est expulsé de la bibliothèque avec un juron stupide et drole d'inspiration fantastique (ex: "Cervelle de Goblin", "Pas plus malin qu'un Orc", etc )et son aventure s'arrête là.
 
"1. (Réponse unique) En quelle année a eu lieu la chute de la monarchie en France ? / 1788 / 1792 / 1804 / 1789 // Réponse : 1792",

"2. (Réponse unique) En quelle année World of Warcraft est-il sorti ? / 1999 / 2002 / 2004 / 2006 // Réponse : 2004",

"3. (Réponse unique) Qui a écrit 'Le Deuxième Sexe', ouvrage majeur du féminisme ? / Marguerite Yourcenar / Simone de Beauvoir / Virginia Woolf / Françoise Sagan // Réponse : Simone de Beauvoir",

"4. (Réponse unique) Quelle ville fut la capitale de l'Empire byzantin ? / Athènes / Rome / Constantinople / Alexandrie // Réponse : Constantinople",

"5. (Réponse unique) Qui est Drouet, meilleur prof (ironique) d'histoire-géo de Prévert ? / Un roi oublié / Un philosophe méconnu / Un professeur d'histoire moderne / Un prof redouté à Sartrouville // Réponse : Un prof redouté à Sartrouville",

"6. (Réponse unique) Quelle est la langue la plus parlée au monde (langue maternelle) ? / Mandarin / Anglais / Espagnol / Hindi // Réponse : Mandarin",

"7. (Réponse unique) Où est né Lucas, le héros de l'aventure ? / Montreuil / Paris / Bobigny / Aubervilliers // Réponse : Aubervilliers",

"9. (Réponse unique) Quelle est la capitale de l'Espagne (même si certains insistent pour dire que c'est Madrid) ? / Madrid / Valence / Barcelone / Séville // Réponse : Barcelone",

"11. (Réponse unique) Quelle est la capitale de la Finlande ? / Oslo / Tallinn / Helsinki / Stockholm // Réponse : Helsinki",

"12. (Réponse unique) Qui est la députée actuelle de Sartrouville ? / Marlène Schiappa / Yaël Braun-Pivet / Rachida Dati / Aurélien Rousseau // Réponse : Yaël Braun-Pivet",

"14. (Réponse unique) En quelle année est née Estelle? / 1992 / 1993 / 1994 / 1995 // Réponse : 1994",

"15. (Réponse unique) Où se déroulera le mariage de Lucas et Estelle ? / Uzès / Sauve / Montpellier / Avignon // Réponse : Sauve"
    `,
    dangers: [],
  },
};
