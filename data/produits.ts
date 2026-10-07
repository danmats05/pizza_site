// Fichier généré par scripts/generer-produits.mjs à partir du menu du site actuel.
// Ne pas modifier à la main : ajuster les règles du script puis le relancer.
import type { Produit } from "./types";

export const PRODUITS: Produit[] = [
  {
    "id": "la-reine",
    "cat": "pizza",
    "nom": "La Reine",
    "desc": "Sauce tomate, fromage, jambon, champignons",
    "img": "/images/base-tomate/la-reine.webp",
    "imgSm": "/images/base-tomate/la-reine-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "badge": "Populaire",
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-4-saisons",
    "cat": "pizza",
    "nom": "La 4 Saisons",
    "desc": "Sauce tomate, fromage, jambon, champignons, artichauts, olives",
    "img": "/images/base-tomate/la-4-saisons.webp",
    "imgSm": "/images/base-tomate/la-4-saisons-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-campione",
    "cat": "pizza",
    "nom": "La Campione",
    "desc": "Sauce tomate, fromage, œuf, viande hachée, champignons",
    "img": "/images/base-tomate/la-campione.webp",
    "imgSm": "/images/base-tomate/la-campione-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-frenchy",
    "cat": "pizza",
    "nom": "La Frenchy",
    "desc": "Sauce tomate, crème de moutarde, poulet rôti, emmental, tomates, oignons frits, tomates cerise",
    "img": "/images/pizza/la-frenchy.webp",
    "imgSm": "/images/pizza/la-frenchy-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-fruits-de-mer",
    "cat": "pizza",
    "nom": "La Fruits de Mer",
    "desc": "Sauce tomate, fromage, fruits de mer, ail, persil",
    "img": "/images/base-tomate/la-fruits-de-mer.webp",
    "imgSm": "/images/base-tomate/la-fruits-de-mer-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "poisson"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-marguerita",
    "cat": "pizza",
    "nom": "La Marguerita",
    "desc": "Sauce tomate, fromage",
    "img": "/images/base-tomate/la-marguerita.webp",
    "imgSm": "/images/base-tomate/la-marguerita-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "vege"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-max-it",
    "cat": "pizza",
    "nom": "La Max It",
    "desc": "Sauce tomate, fromage, pepperoni, poulet, olives",
    "img": "/images/base-tomate/pizza-max-it.webp",
    "imgSm": "/images/base-tomate/pizza-max-it-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-regina",
    "cat": "pizza",
    "nom": "La Regina",
    "desc": "Sauce tomate, fromage, chorizo, champignons, olives",
    "img": "/images/base-tomate/la-regina.webp",
    "imgSm": "/images/base-tomate/la-regina-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-vegetarienne",
    "cat": "pizza",
    "nom": "La Végétarienne",
    "desc": "Sauce tomate, fromage, tomates cerises, poivrons, olives",
    "img": "/images/base-tomate/la-vegetarienne.webp",
    "imgSm": "/images/base-tomate/la-vegetarienne-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "vege"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-4-fromages",
    "cat": "pizza",
    "nom": "La 4 Fromages",
    "desc": "Sauce tomate, fromage, gorgonzola, provolone, fromage râpé",
    "img": "/images/base-tomate/la-4-fromages.webp",
    "imgSm": "/images/base-tomate/la-4-fromages-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "vege"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-buffalo",
    "cat": "pizza",
    "nom": "La Buffalo",
    "desc": "Sauce barbecue, fromage, sauce tomate, viande hachée, poivrons, oignons",
    "img": "/images/pizza/la-buffalo.webp",
    "imgSm": "/images/pizza/la-buffalo-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-butcher-lover",
    "cat": "pizza",
    "nom": "La Butcher Lover",
    "desc": "Sauce tomate, fromage, viande hachée, jambon, merguez",
    "img": "/images/base-tomate/la-butcher-lover.webp",
    "imgSm": "/images/base-tomate/la-butcher-lover-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-calzone",
    "cat": "pizza",
    "nom": "La Calzone",
    "desc": "Pizza chausson, sauce au choix",
    "img": "/images/base-tomate/la-calzone.webp",
    "imgSm": "/images/base-tomate/la-calzone-sm.webp",
    "enStock": true,
    "tags": [
      "tomate"
    ],
    "type": "unique",
    "prix": 6000,
    "choix": [
      {
        "titre": "Sauce",
        "liste": [
          "Algérienne",
          "Samouraï",
          "Barbecue",
          "Biggy burger",
          "Poivre"
        ]
      }
    ]
  },
  {
    "id": "la-chawarma",
    "cat": "pizza",
    "nom": "La Chawarma",
    "desc": "Sauce tomate, fromage, viande chawarma, tomates cerises, persil",
    "img": "/images/base-tomate/pizza-chawarma.webp",
    "imgSm": "/images/base-tomate/pizza-chawarma-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-fabulous",
    "cat": "pizza",
    "nom": "La Fabulous",
    "desc": "Fromage, poulet, oignons rouges, filet de sauce",
    "img": "/images/base-tomate/la-fabulous.webp",
    "imgSm": "/images/base-tomate/la-fabulous-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "badge": "Nouveau",
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-mexicaine",
    "cat": "pizza",
    "nom": "La Mexicaine",
    "desc": "Sauce tomate, fromage, merguez, pepperoni, poivrons, olives",
    "img": "/images/base-tomate/la-mexicaine.webp",
    "imgSm": "/images/base-tomate/la-mexicaine-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "epice",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-pecheur",
    "cat": "pizza",
    "nom": "La Pêcheur",
    "desc": "Sauce tomate, fromage, thon, œuf, olives",
    "img": "/images/base-tomate/la-pecheur.webp",
    "imgSm": "/images/base-tomate/la-pecheur-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "poisson"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-pepperoni-lover",
    "cat": "pizza",
    "nom": "La Pepperoni Lover",
    "desc": "Sauce tomate, fromage, pepperoni",
    "img": "/images/base-tomate/peperoni-lover.webp",
    "imgSm": "/images/base-tomate/peperoni-lover-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "viande"
    ],
    "badge": "Nouveau",
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-pimento",
    "cat": "pizza",
    "nom": "La Pimento",
    "desc": "Sauce chili thaï, fromage, sauce tomate, poulet frit, pepperoni de bœuf, piments forts, poivrons",
    "img": "/images/pizza/la-pimento.webp",
    "imgSm": "/images/pizza/la-pimento-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "epice",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-raclette",
    "cat": "pizza",
    "nom": "La Raclette",
    "desc": "Sauce tomate, fromage, fromage à raclette, pomme de terre, poulet fumé, poulet épicé",
    "img": "/images/base-tomate/la-raclette.webp",
    "imgSm": "/images/base-tomate/la-raclette-sm.webp",
    "enStock": true,
    "tags": [
      "tomate",
      "epice",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "l-orientale",
    "cat": "pizza",
    "nom": "L'Orientale",
    "desc": "Crème fraîche, fromage, pomme de terre, poulet fumé",
    "img": "/images/base-tomate/l-orientale.webp",
    "imgSm": "/images/base-tomate/l-orientale-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "epice",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-campagnarde",
    "cat": "pizza",
    "nom": "La Campagnarde",
    "desc": "Crème fraîche, fromage, jambon, pomme de terre, champignons",
    "img": "/images/base-creme-fraiche/la-campagnarde.webp",
    "imgSm": "/images/base-creme-fraiche/la-campagnarde-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-chicken",
    "cat": "pizza",
    "nom": "La Chicken",
    "desc": "Crème fraîche, fromage, pomme de terre, poulet fumé",
    "img": "/images/base-creme-fraiche/la-chicken.webp",
    "imgSm": "/images/base-creme-fraiche/la-chicken-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-paysanne",
    "cat": "pizza",
    "nom": "La Paysanne",
    "desc": "Crème fraîche, fromage, jambon, pomme de terre, oignons",
    "img": "/images/base-creme-fraiche/la-paysanne.webp",
    "imgSm": "/images/base-creme-fraiche/la-paysanne-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-western",
    "cat": "pizza",
    "nom": "La Western",
    "desc": "Crème fraîche, fromage, poulet épicé, poivrons, champignons",
    "img": "/images/base-creme-fraiche/la-western.webp",
    "imgSm": "/images/base-creme-fraiche/la-western-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "epice",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 5500
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 7500
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13000
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-bollywood",
    "cat": "pizza",
    "nom": "La Bollywood",
    "desc": "Crème fraîche, fromage, sauce carry, poivrons, oignons, poulet épicé",
    "img": "/images/pizza/la-bollywood.webp",
    "imgSm": "/images/pizza/la-bollywood-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "epice",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-chevre-miel",
    "cat": "pizza",
    "nom": "La Chèvre Miel",
    "desc": "Crème fraîche, fromage, fromage de chèvre, noix, miel",
    "img": "/images/pizza/la-chevre-miel.webp",
    "imgSm": "/images/pizza/la-chevre-miel-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "vege"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-chicago",
    "cat": "pizza",
    "nom": "La Chicago",
    "desc": "Crème fraîche, fromage, œuf, viande hachée, jambon, cheddar",
    "img": "/images/base-creme-fraiche/la-chicago.webp",
    "imgSm": "/images/base-creme-fraiche/la-chicago-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-kebab",
    "cat": "pizza",
    "nom": "La Kébab",
    "desc": "Crème fraîche, fromage, oignons, sauce chili thaï, poulet",
    "img": "/images/base-creme-fraiche/la-kebab.webp",
    "imgSm": "/images/base-creme-fraiche/la-kebab-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "epice",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-norvegienne",
    "cat": "pizza",
    "nom": "La Norvégienne",
    "desc": "Crème fraîche, fromage, saumon fumé",
    "img": "/images/base-creme-fraiche/la-norvegienne.webp",
    "imgSm": "/images/base-creme-fraiche/la-norvegienne-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "poisson"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-tartiflette",
    "cat": "pizza",
    "nom": "La Tartiflette",
    "desc": "Crème fraîche, fromage, reblochon, pomme de terre, oignons, dés de veau fumé",
    "img": "/images/base-creme-fraiche/la-tartiflette.webp",
    "imgSm": "/images/base-creme-fraiche/la-tartiflette-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "la-time-burger",
    "cat": "pizza",
    "nom": "La Time Burger",
    "desc": "Crème fraîche, fromage, viande hachée, cheddar, oignons rouges, pickles, ketchup",
    "img": "/images/pizza/la-time-burger.webp",
    "imgSm": "/images/pizza/la-time-burger-sm.webp",
    "enStock": true,
    "tags": [
      "creme",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Taille",
      "liste": [
        {
          "id": "junior",
          "label": "Junior",
          "prix": 6000
        },
        {
          "id": "senior",
          "label": "Senior",
          "prix": 8000
        },
        {
          "id": "mega",
          "label": "Mega",
          "prix": 13500
        }
      ],
      "defaut": "senior"
    }
  },
  {
    "id": "frites",
    "cat": "texmex",
    "nom": "Frites",
    "desc": "Pommes de terre en quartiers (potatoes)",
    "img": "/images/tex-mex/frites.webp",
    "imgSm": "/images/tex-mex/frites-sm.webp",
    "enStock": true,
    "tags": [
      "vege"
    ],
    "type": "options",
    "options": {
      "titre": "Portion",
      "liste": [
        {
          "id": "petite",
          "label": "Petite",
          "prix": 1500
        },
        {
          "id": "grande",
          "label": "Grande",
          "prix": 2500
        }
      ],
      "defaut": "petite"
    }
  },
  {
    "id": "frites-de-patates-douces",
    "cat": "texmex",
    "nom": "Frites de Patates Douces",
    "desc": "Frites de patates douces",
    "img": "/images/tex-mex/frites-patates-douces.webp",
    "imgSm": "/images/tex-mex/frites-patates-douces-sm.webp",
    "enStock": true,
    "tags": [
      "vege"
    ],
    "type": "options",
    "options": {
      "titre": "Portion",
      "liste": [
        {
          "id": "petite",
          "label": "Petite",
          "prix": 2000
        },
        {
          "id": "grande",
          "label": "Grande",
          "prix": 3000
        }
      ],
      "defaut": "petite"
    }
  },
  {
    "id": "calamars-frits",
    "cat": "texmex",
    "nom": "Calamars Frits",
    "desc": "10 pièces",
    "img": "/images/tex-mex/calamars-frits.webp",
    "imgSm": "/images/tex-mex/calamars-frits-sm.webp",
    "enStock": true,
    "tags": [
      "poisson"
    ],
    "type": "unique",
    "prix": 2500
  },
  {
    "id": "chicken-wings",
    "cat": "texmex",
    "nom": "Chicken Wings",
    "desc": "Ailes de poulet",
    "img": "/images/tex-mex/chicken-wings.webp",
    "imgSm": "/images/tex-mex/chicken-wings-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Nombre de pièces",
      "liste": [
        {
          "id": "6",
          "label": "6 pièces",
          "prix": 3500
        },
        {
          "id": "12",
          "label": "12 pièces",
          "prix": 6000
        }
      ],
      "defaut": "6"
    }
  },
  {
    "id": "mozza-sticks",
    "cat": "texmex",
    "nom": "Mozza Sticks",
    "desc": "Bâtonnets de mozzarella panés",
    "img": "/images/tex-mex/mozza-sticks.webp",
    "imgSm": "/images/tex-mex/mozza-sticks-sm.webp",
    "enStock": true,
    "tags": [
      "vege"
    ],
    "type": "options",
    "options": {
      "titre": "Nombre de pièces",
      "liste": [
        {
          "id": "5",
          "label": "5 pièces",
          "prix": 3500
        },
        {
          "id": "10",
          "label": "10 pièces",
          "prix": 6000
        }
      ],
      "defaut": "5"
    }
  },
  {
    "id": "nuggets",
    "cat": "texmex",
    "nom": "Nuggets",
    "desc": "Nuggets de poulet panés",
    "img": "/images/tex-mex/nuggets.webp",
    "imgSm": "/images/tex-mex/nuggets-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Nombre de pièces",
      "liste": [
        {
          "id": "6",
          "label": "6 pièces",
          "prix": 3500
        },
        {
          "id": "12",
          "label": "12 pièces",
          "prix": 5000
        }
      ],
      "defaut": "6"
    }
  },
  {
    "id": "swiss-cheesy",
    "cat": "texmex",
    "nom": "Swiss Cheesy",
    "desc": "Bouchées panées au fromage",
    "img": "/images/tex-mex/swiss-cheesy.webp",
    "imgSm": "/images/tex-mex/swiss-cheesy-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "options",
    "options": {
      "titre": "Nombre de pièces",
      "liste": [
        {
          "id": "5",
          "label": "5 pièces",
          "prix": 3500
        },
        {
          "id": "10",
          "label": "10 pièces",
          "prix": 6000
        }
      ],
      "defaut": "5"
    }
  },
  {
    "id": "chicken-wings-panees",
    "cat": "texmex",
    "nom": "Chicken Wings Panées",
    "desc": "Ailes de poulet panées",
    "img": "/images/tex-mex/chicken-wings-pane.webp",
    "imgSm": "/images/tex-mex/chicken-wings-pane-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Nombre de pièces",
      "liste": [
        {
          "id": "5",
          "label": "5 pièces",
          "prix": 4500
        },
        {
          "id": "10",
          "label": "10 pièces",
          "prix": 9000
        }
      ],
      "defaut": "5"
    }
  },
  {
    "id": "tenders-epices",
    "cat": "texmex",
    "nom": "Tenders Épicés",
    "desc": "Aiguillettes de poulet panées, épicées",
    "img": "/images/tex-mex/tenders-epice.webp",
    "imgSm": "/images/tex-mex/tenders-epice-sm.webp",
    "enStock": true,
    "tags": [
      "epice",
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Nombre de pièces",
      "liste": [
        {
          "id": "3",
          "label": "3 pièces",
          "prix": 4500
        },
        {
          "id": "6",
          "label": "6 pièces",
          "prix": 8500
        },
        {
          "id": "9",
          "label": "9 pièces",
          "prix": 12000
        }
      ],
      "defaut": "3"
    }
  },
  {
    "id": "tenders-nature",
    "cat": "texmex",
    "nom": "Tenders Nature",
    "desc": "Aiguillettes de poulet panées",
    "img": "/images/tex-mex/tenders-nature.webp",
    "imgSm": "/images/tex-mex/tenders-nature-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Nombre de pièces",
      "liste": [
        {
          "id": "3",
          "label": "3 pièces",
          "prix": 4500
        },
        {
          "id": "6",
          "label": "6 pièces",
          "prix": 8500
        },
        {
          "id": "9",
          "label": "9 pièces",
          "prix": 12000
        }
      ],
      "defaut": "3"
    }
  },
  {
    "id": "le-crousty",
    "cat": "texmex",
    "nom": "Le Crousty",
    "desc": "Frites ou riz, nappés de sauce au fromage et d'éclats croustillants",
    "img": "/images/tex-mex/le-crousty.webp",
    "imgSm": "/images/tex-mex/le-crousty-sm.webp",
    "enStock": true,
    "tags": [],
    "badge": "Nouveau",
    "type": "unique",
    "prix": 5500,
    "choix": [
      {
        "titre": "Base",
        "liste": [
          "Frites",
          "Riz"
        ]
      }
    ]
  },
  {
    "id": "tacos-merguez",
    "cat": "tacos",
    "nom": "Tacos Merguez",
    "desc": "Merguez, salade, tomate, oignon, fromages",
    "img": "/images/tacos/merguez.webp",
    "imgSm": "/images/tacos/merguez-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5000
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "tacos-poulet",
    "cat": "tacos",
    "nom": "Tacos Poulet",
    "desc": "Poulet, salade, tomate, oignon, fromages",
    "img": "/images/tacos/poulet.webp",
    "imgSm": "/images/tacos/poulet-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5000
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "tacos-tenders",
    "cat": "tacos",
    "nom": "Tacos Tenders",
    "desc": "Salade, tomate, oignons, Boursin",
    "img": "/images/tacos/tacos-tenders.webp",
    "imgSm": "/images/tacos/tacos-tenders-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5000
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "tacos-viande-hachee",
    "cat": "tacos",
    "nom": "Tacos Viande Hachée",
    "desc": "Viande hachée, salade, tomate, oignon, fromages",
    "img": "/images/tacos/tacos-viande-hachee.webp",
    "imgSm": "/images/tacos/tacos-viande-hachee-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5000
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "tacos-chawarma",
    "cat": "tacos",
    "nom": "Tacos Chawarma",
    "desc": "Viande chawarma, salade, tomate, oignon, fromages",
    "img": "/images/tacos/tacos-chawarma.webp",
    "imgSm": "/images/tacos/tacos-chawarma-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 4500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "tacos-cordon-bleu",
    "cat": "tacos",
    "nom": "Tacos Cordon Bleu",
    "desc": "Cordon bleu, salade, tomate, oignon, fromages",
    "img": "/images/tacos/tacos-chawarma.webp",
    "imgSm": "/images/tacos/tacos-chawarma-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 4500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "tacos-kebab-poulet",
    "cat": "tacos",
    "nom": "Tacos Kebab Poulet",
    "desc": "Kebab de poulet, salade, tomate, oignon, fromages",
    "img": "/images/tacos/tacos-chawarma.webp",
    "imgSm": "/images/tacos/tacos-chawarma-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 4500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "tacos-kebab-veau-dinde",
    "cat": "tacos",
    "nom": "Tacos Kebab Veau-Dinde",
    "desc": "Kebab de veau et dinde, salade, tomate, oignon, fromages",
    "img": "/images/tacos/tacos-chawarma.webp",
    "imgSm": "/images/tacos/tacos-chawarma-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 4500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "tacos-mix",
    "cat": "tacos",
    "nom": "Tacos Mix",
    "desc": "2 viande au choix, salade, tomate, oignon, fromages",
    "img": "/images/tacos/tacos-mix.webp",
    "imgSm": "/images/tacos/tacos-mix-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "unique",
    "prix": 4500,
    "choix": [
      {
        "titre": "1re viande",
        "liste": [
          "Viande hachée",
          "Poulet",
          "Merguez"
        ]
      },
      {
        "titre": "2e viande",
        "liste": [
          "Viande hachée",
          "Poulet",
          "Merguez"
        ]
      }
    ]
  },
  {
    "id": "sandwich-chawarma",
    "cat": "sandwich",
    "nom": "Sandwich Chawarma",
    "desc": "Salade, tomate, oignons, cheddar, viande chawarma",
    "img": "/images/sandwichs/sandwich-chawarma.webp",
    "imgSm": "/images/sandwichs/sandwich-chawarma-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 4500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "sandwich-cordon-bleu",
    "cat": "sandwich",
    "nom": "Sandwich Cordon Bleu",
    "desc": "Salade, tomate, oignons, cheddar, cordon bleu",
    "img": "/images/sandwichs/cordon-bleu.webp",
    "imgSm": "/images/sandwichs/cordon-bleu-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 4500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "sandwich-kebab",
    "cat": "sandwich",
    "nom": "Sandwich Kebab",
    "desc": "Salade, tomate, oignons, cheddar et viande de kebab",
    "img": "/images/sandwichs/sandwich-kebab.webp",
    "imgSm": "/images/sandwichs/sandwich-kebab-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 4500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "sandwich-mix-steak-cordon-bleu",
    "cat": "sandwich",
    "nom": "Sandwich Mix Steak Cordon Bleu",
    "desc": "Salade, tomate, oignons, Boursin",
    "img": "/images/sandwichs/mix-steak-cordon-bleu.webp",
    "imgSm": "/images/sandwichs/mix-steak-cordon-bleu-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 4500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "sandwich-steak-hache",
    "cat": "sandwich",
    "nom": "Sandwich Steak Haché",
    "desc": "Salade, tomate, oignons, cheddar, steak haché",
    "img": "/images/sandwichs/sandwich-steak-hache.webp",
    "imgSm": "/images/sandwichs/sandwich-steak-hache-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 4500
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 5500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "le-3-fromages",
    "cat": "panini",
    "nom": "Le 3 Fromages",
    "desc": "Crème fraîche, fromage, gorgonzola, fromage râpé",
    "img": "/images/panini/le-3-fromages.webp",
    "imgSm": "/images/panini/le-3-fromages-sm.webp",
    "enStock": true,
    "tags": [
      "vege"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3000
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 4500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "le-chevre",
    "cat": "panini",
    "nom": "Le Chèvre",
    "desc": "Crème fraîche, fromage, fromage de chèvre",
    "img": "/images/panini/le-chevre.webp",
    "imgSm": "/images/panini/le-chevre-sm.webp",
    "enStock": true,
    "tags": [
      "vege"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3000
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 4500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "le-fermier",
    "cat": "panini",
    "nom": "Le Fermier",
    "desc": "Crème fraîche, fromage, poulet fumé",
    "img": "/images/panini/le-fermier.webp",
    "imgSm": "/images/panini/le-fermier-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3000
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 4500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "le-merguez",
    "cat": "panini",
    "nom": "Le Merguez",
    "desc": "Crème fraîche, fromage, merguez",
    "img": "/images/panini/le-merguez.webp",
    "imgSm": "/images/panini/le-merguez-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3000
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 4500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "le-milano",
    "cat": "panini",
    "nom": "Le Milano",
    "desc": "Crème fraîche, fromage, tomates, thon",
    "img": "/images/panini/le-milano.webp",
    "imgSm": "/images/panini/le-milano-sm.webp",
    "enStock": true,
    "tags": [
      "poisson"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3000
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 4500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "le-pacifico",
    "cat": "panini",
    "nom": "Le Pacifico",
    "desc": "Crème fraîche, fromage, saumon fumé",
    "img": "/images/panini/le-pacifico.webp",
    "imgSm": "/images/panini/le-pacifico-sm.webp",
    "enStock": true,
    "tags": [
      "poisson"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3000
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 4500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "le-time",
    "cat": "panini",
    "nom": "Le Time",
    "desc": "Crème fraîche, fromage, tomates, viande hachée",
    "img": "/images/panini/le-time.webp",
    "imgSm": "/images/panini/le-time-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3000
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 4500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "le-venezia",
    "cat": "panini",
    "nom": "Le Venezia",
    "desc": "Crème fraîche, fromage, tomates, jambon",
    "img": "/images/panini/le-venezia.webp",
    "imgSm": "/images/panini/le-venezia-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "options",
    "options": {
      "titre": "Formule",
      "liste": [
        {
          "id": "simple",
          "label": "Simple",
          "prix": 3000
        },
        {
          "id": "menu",
          "label": "Menu",
          "prix": 4500
        }
      ],
      "defaut": "simple"
    }
  },
  {
    "id": "l-oceane-salade",
    "cat": "salade",
    "nom": "L'Océane",
    "desc": "Salade verte, tomates, œuf, concombres, saumon",
    "img": "/images/salade/l-oceane.webp",
    "imgSm": "/images/salade/l-oceane-sm.webp",
    "enStock": true,
    "tags": [
      "poisson"
    ],
    "type": "unique",
    "prix": 5000
  },
  {
    "id": "la-fermiere-salade",
    "cat": "salade",
    "nom": "La Fermière",
    "desc": "Salade verte, tomates, œuf, maïs, poulet",
    "img": "/images/salade/la-fermiere.webp",
    "imgSm": "/images/salade/la-fermiere-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "unique",
    "prix": 5000
  },
  {
    "id": "la-nicoise-salade",
    "cat": "salade",
    "nom": "La Niçoise",
    "desc": "Salade verte, tomates, olives, thon, cornichons",
    "img": "/images/salade/la-nicoise.webp",
    "imgSm": "/images/salade/la-nicoise-sm.webp",
    "enStock": true,
    "tags": [
      "poisson"
    ],
    "type": "unique",
    "prix": 5000
  },
  {
    "id": "la-paysanne-salade",
    "cat": "salade",
    "nom": "La Paysanne",
    "desc": "Salade verte, tomates, concombres, œuf, jambon",
    "img": "/images/salade/la-paysanne.webp",
    "imgSm": "/images/salade/la-paysanne-sm.webp",
    "enStock": true,
    "tags": [
      "viande"
    ],
    "type": "unique",
    "prix": 5000
  },
  {
    "id": "kinder",
    "cat": "dessert",
    "nom": "Kinder",
    "desc": "Œuf Kinder Joy avec surprise",
    "img": "/images/dessert/kinder.webp",
    "imgSm": "/images/dessert/kinder-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1000
  },
  {
    "id": "glace-mammamia",
    "cat": "dessert",
    "nom": "Glace Mammamia",
    "desc": "Glace italienne Mammamia, en boules ou en pot d'un litre",
    "img": "/images/dessert/glace-mammamia.webp",
    "imgSm": "/images/dessert/glace-mammamia-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "options",
    "options": {
      "titre": "Format",
      "liste": [
        {
          "id": "1-boule",
          "label": "1 boule",
          "prix": 1500
        },
        {
          "id": "2-boules",
          "label": "2 boules",
          "prix": 2000
        },
        {
          "id": "3-boules",
          "label": "3 boules",
          "prix": 2500
        },
        {
          "id": "pot-1l",
          "label": "Pot 1L",
          "prix": 9000
        }
      ],
      "defaut": "1-boule"
    }
  },
  {
    "id": "haagen-dazs-batonnet",
    "cat": "dessert",
    "nom": "Häagen-Dazs Bâtonnet",
    "desc": "Glace Häagen-Dazs chocolat amandes, en bâtonnet",
    "img": "/images/dessert/haagen-dazs-batonnets.webp",
    "imgSm": "/images/dessert/haagen-dazs-batonnets-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 2000
  },
  {
    "id": "crepe",
    "cat": "dessert",
    "nom": "Crêpe",
    "desc": "Crêpe au sucre, au Nutella ou à la banane",
    "img": "/images/dessert/crepe.webp",
    "imgSm": "/images/dessert/crepe-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "options",
    "options": {
      "titre": "Parfum",
      "liste": [
        {
          "id": "sucre",
          "label": "Sucre",
          "prix": 2500
        },
        {
          "id": "nutella",
          "label": "Nutella",
          "prix": 3000
        },
        {
          "id": "banane",
          "label": "Banane",
          "prix": 3500
        }
      ],
      "defaut": "sucre"
    }
  },
  {
    "id": "panini-nutella",
    "cat": "dessert",
    "nom": "Panini Nutella",
    "desc": "Panini grillé fourré au Nutella",
    "img": "/images/dessert/panini-nutella.webp",
    "imgSm": "/images/dessert/panini-nutella-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 2500
  },
  {
    "id": "tarte-au-daim",
    "cat": "dessert",
    "nom": "Tarte au Daim",
    "desc": "Part de tarte au Daim",
    "img": "/images/dessert/tarte-au-daim.webp",
    "imgSm": "/images/dessert/tarte-au-daim-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 2500
  },
  {
    "id": "tiramisu-nutella",
    "cat": "dessert",
    "nom": "Tiramisu Nutella",
    "desc": "Tiramisu au Nutella, en pot",
    "img": "/images/dessert/tiramisu.webp",
    "imgSm": "/images/dessert/tiramisu-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 3000
  },
  {
    "id": "milkshake",
    "cat": "dessert",
    "nom": "Milkshake",
    "desc": "Milkshake Bueno, Oreo ou fraise",
    "img": "/images/dessert/milkshakes.webp",
    "imgSm": "/images/dessert/milkshakes-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 4000,
    "choix": [
      {
        "titre": "Parfum",
        "liste": [
          "Bueno",
          "Oreo",
          "Fraise"
        ]
      }
    ]
  },
  {
    "id": "mini-pressea",
    "cat": "boisson",
    "nom": "Mini Pressea",
    "desc": "Brique de jus Pressea cocktail, 20 cl",
    "img": "/images/boisson/mini-pressea.webp",
    "imgSm": "/images/boisson/mini-pressea-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 700
  },
  {
    "id": "7up",
    "cat": "boisson",
    "nom": "7Up",
    "desc": "Canette 7Up",
    "img": "/images/boisson/7up.webp",
    "imgSm": "/images/boisson/7up-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1000
  },
  {
    "id": "eau-kirene",
    "cat": "boisson",
    "nom": "Eau Kirène",
    "desc": "Eau minérale Kirène, petite ou grande bouteille",
    "img": "/images/boisson/eau-kirene.webp",
    "imgSm": "/images/boisson/eau-kirene-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "options",
    "options": {
      "titre": "Contenance",
      "liste": [
        {
          "id": "petite-bouteille",
          "label": "Petite bouteille",
          "prix": 1000
        },
        {
          "id": "grande-bouteille",
          "label": "Grande bouteille",
          "prix": 1500
        }
      ],
      "defaut": "petite-bouteille"
    }
  },
  {
    "id": "fanta-orange",
    "cat": "boisson",
    "nom": "Fanta Orange",
    "desc": "Canette Fanta orange",
    "img": "/images/boisson/fanta-orange.webp",
    "imgSm": "/images/boisson/fanta-orange-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1000
  },
  {
    "id": "jus-naturel",
    "cat": "boisson",
    "nom": "Jus Naturel",
    "desc": "Jus de bissap, de bouye ou de gingembre, au verre ou en grande bouteille",
    "img": "/images/boisson/jus-naturel.webp",
    "imgSm": "/images/boisson/jus-naturel-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "options",
    "options": {
      "titre": "Contenance",
      "liste": [
        {
          "id": "verre",
          "label": "Verre",
          "prix": 1000
        },
        {
          "id": "bouteille",
          "label": "Grande bouteille",
          "prix": 5000
        }
      ],
      "defaut": "verre"
    },
    "choix": [
      {
        "titre": "Parfum",
        "liste": [
          "Bissap",
          "Bouye",
          "Gingembre"
        ]
      }
    ]
  },
  {
    "id": "mirinda-fruity",
    "cat": "boisson",
    "nom": "Mirinda Fruity",
    "desc": "Canette Mirinda fruity",
    "img": "/images/boisson/mirinda-fruity.webp",
    "imgSm": "/images/boisson/mirinda-fruity-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1000
  },
  {
    "id": "mirinda-orange",
    "cat": "boisson",
    "nom": "Mirinda Orange",
    "desc": "Canette Mirinda orange",
    "img": "/images/boisson/mirinda-orange.webp",
    "imgSm": "/images/boisson/mirinda-orange-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1000
  },
  {
    "id": "pepsi",
    "cat": "boisson",
    "nom": "Pepsi",
    "desc": "Canette Pepsi",
    "img": "/images/boisson/pepsi.webp",
    "imgSm": "/images/boisson/pepsi-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1000
  },
  {
    "id": "schweppes-agrumes",
    "cat": "boisson",
    "nom": "Schweppes Agrumes",
    "desc": "Canette Schweppes agrumes",
    "img": "/images/boisson/schweppes-agrumes.webp",
    "imgSm": "/images/boisson/schweppes-agrumes-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1000
  },
  {
    "id": "schweppes-pomme",
    "cat": "boisson",
    "nom": "Schweppes Pomme",
    "desc": "Canette Schweppes pomme",
    "img": "/images/boisson/schweppes-pomme.webp",
    "imgSm": "/images/boisson/schweppes-pomme-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1000
  },
  {
    "id": "7up-cocktail-exotique",
    "cat": "boisson",
    "nom": "7Up Cocktail Exotique",
    "desc": "Canette 7Up saveur cocktail exotique",
    "img": "/images/boisson/seven-up.webp",
    "imgSm": "/images/boisson/seven-up-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1500
  },
  {
    "id": "fanta-mangue",
    "cat": "boisson",
    "nom": "Fanta Mangue",
    "desc": "Canette Fanta mangue",
    "img": "/images/boisson/fanta-mangue.webp",
    "imgSm": "/images/boisson/fanta-mangue-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1500
  },
  {
    "id": "hawai",
    "cat": "boisson",
    "nom": "Hawaï",
    "desc": "Canette Hawaï Tropical",
    "img": "/images/boisson/hawai.webp",
    "imgSm": "/images/boisson/hawai-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1500
  },
  {
    "id": "lipton-ice-tea-pasteque",
    "cat": "boisson",
    "nom": "Lipton Ice Tea Pastèque",
    "desc": "Thé glacé Lipton à la pastèque",
    "img": "/images/boisson/lipton-ice-tea-pasteque.webp",
    "imgSm": "/images/boisson/lipton-ice-tea-pasteque-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1500
  },
  {
    "id": "oasis-tropical",
    "cat": "boisson",
    "nom": "Oasis Tropical",
    "desc": "Canette Oasis Tropical",
    "img": "/images/boisson/oasis.webp",
    "imgSm": "/images/boisson/oasis-sm.webp",
    "enStock": true,
    "tags": [],
    "type": "unique",
    "prix": 1500
  }
];
