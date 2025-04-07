export const Lore = {
    context: {
      title: "La Dernière Alliance",
      summary:
        "Lucas, futur marié et passionné de jeux de rôle et de World of Warcraft, est aspiré dans un monde parallèle magique par un sortilège inconnu déclenché lors de son anniversaire. Ses amis lui font vivre une aventure entre fiction et réalité, où il devra affronter des ennemis anciens, résoudre des énigmes, renforcer sa Guilde, et lever une malédiction qui menace autant ce monde que son retour possible chez lui."
    },
  
    prologue: {
      event: "L'anniversaire de Lucas",
      trigger:
        "En ouvrant une enveloppe lors de son anniversaire, Lucas entend une voix qui murmure 'Vous n’êtes pas prêts…'. Ce moment enclenche un sortilège de trans-dimension lancé depuis un autre monde , on l'apprendra plus tard, par un ancien moine nommé Aedan.",
      guide:
        "Pierre Defoyer, Tavernier mystérieux issu de cette autre réalité, contacte Lucas via une taverne numérique pour l’orienter. Il le pousse à créer son identité d'aventurier dans cette autre dimension et à récupérer ses habits de chaman elfique dans une taverne réelle, début de son immersion dans un monde parallèle."
    },
  
    quests: [
      {
        name: "L’Aventure Fantastique – Escape Game",
        events: [
          "Lucas rejoint sa Guilde IRL pour une expérience scénarisée dans un escape game.",
          "Ils affrontent un Guerrier Inconnu, silhouette sombre et redoutable, porteur d'une magie noire.",
          "Après l’avoir fait fuir, ils récupèrent un œuf de dragon ancien et puissant.",
          "Pensant bien faire, ils confient l’œuf à un prétendu allié — qui s’avère être un agent de la secte des Saloupiens, ce qu'on apprendra lors la lecture du livre des équilibres."
        ]
      },
      {
        name: "Le Tombeau du Dragon Leprestrix",
        revelations: [
          "Le dragon Leprestrix protégeait la province de la Nupesse et y répandait paix et prospérité.",
          "Il était accompagné de l’Ordre Epitechien, un groupe de moines loyaux et sages.",
          "Mais des Saloupiens infiltrés au sein de l’Ordre le trahirent, volèrent son œuf et provoquèrent sa mort.",
          "Son esprit, fou de douleur et de trahison, hante son tombeau devenu sanctuaire corrompu.",
          "Lucas affronte le Spectre fou de Leprestrix, le tue sans effacer la malédiction et découvre une relique contenant le mot 'joliment'."
        ]
      },
      {
        name: "Fort Gaultier",
        requirements: [
          "Lucas doit renforcer sa Guilde IRL en convainquant de nouvelles personnes de le rejoindre dans l'aventure et tenter son assaut contre le Fort Gaultier."
        ],
        objectives: [
          "Infiltrer le Fort Gaultier, bastion de la secte Saloupienne, sans blesser les civils.",
          "Combattre Depardrix, alpha loup-garou misogyne et geôlier brutal.",
          "Libérer Aedan, ancien moine Epitechien, leader de la Résistance et invocateur de Lucas.",
          "Trouver une relique marquée du mot 'valoir'."
        ]
      },
      {
        name: "La Bibliothèque du Savoir",
        mechanics: "Une salle protégée par 10 questions de culture générale posées par les Sages Drouet. Chaque bonne réponse ouvre un peu plus la voie vers la Vérité. Il n’y a pas d’ennemis physiques ici, seulement l’intellect comme arme.",
        outcomes: [
          "Le Livre des Équilibres révèle la véritable histoire du monde, la trahison de Leprestrix et l’influence corruptrice de Trumpelanus.",
          "Lucas découvre un lien troublant entre lui-même et le Guerrier Inconnu.",
          "Le troisième mot de la formule secrète, 'reliure', apparaît sur une relique.",
          "Un flyer enchanté se matérialise et annonce le mystérieux Festival Leprestrix."
        ]
      }
    ],
  
    foundation: {
      lucas: "Héros principal, jeune homme du monde réel transporté dans un univers fantastique. Il est au centre d’une prophétie ancienne et joue un rôle crucial dans la survie de la province de la Nupesse.",
      malediction: "Sort de trans-dimension lancé par Aedan pour faire venir Lucas. Il ne pourra retourner chez lui qu’en accomplissant sa mission et en découvrant tous les fragments de la Formule Secrète.",
      leprestrix: "Dragon légendaire de sagesse et de paix. Il fut trahi par son propre ordre, tué, et son œuf dérobé. Sa mort a maudit la province de la Nupesse.",
      saloupiens: "Secte maléfique menée par Trumpelanus. Ils infiltrent les institutions, manipulent les esprits et cherchent à contrôler le monde par la richesse et la magie noire.",
      trumpelanus: "Leader tyrannique et manipulateur des Saloupiens. Grand stratège, corrompt les âmes pour atteindre ses fins.",
      guerrierInconnu: "Avatar sombre de Lucas dans une dimension alternative. Il est tombé sous l’influence de Trumpelanus et a joué un rôle majeur dans la chute de Leprestrix.",
      aedan: "Moine draconique et chef de la Résistance. Ami proche de Leprestrix et instigateur du rituel qui invoque Lucas dans ce monde.",
      tavernier: "Pierre Defoyer, tavernier-magicien, liaison entre les deux mondes de Lucas. Il oriente discrètement les événements ",
      guilde: "Compagnons de Lucas, amis réels qui participent à l’aventure avec lui. Leur présence et leur engagement sont essentiels à sa réussite.",
      province: "Nupesse, région prospère grâce à Leprestrix, aujourd’hui en déclin sous la coupe des Saloupiens.",
      oeuf: "Relique draconique d’une puissance incommensurable. Convoitée pour ses vertus magiques et stratégiques. Son vol est à l’origine du chaos."
    }
  };
  