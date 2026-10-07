// Carrousel du hero (façon Brar's) : une pizza par diapositive, avec sa couleur de fond et ses stickers.
// Les photos sont préparées par scripts/preparer-hero.mjs.

import type { Decor } from "@/components/hero/HeroDecor";

type CouleurSticker = "croute" | "basilic" | "blanc" | "tomate";

export type DiapoHero = {
  produit: string; // id dans data/produits.ts
  image: string;
  imageSm: string;
  fond: string; // fond de la section
  forme: string; // forme claire derrière la pizza
  titre: string; // couleur du nom
  texteClair: boolean; // éléments clairs (boutons, points) sur fond foncé
  decor: Decor; // ombres en fond qui évoquent le nom de la pizza (motifs semés, ou skyline plein écran)
  ombre: string; // couleur de la silhouette
  ombreOpacite: number; // opacité de la silhouette (faible : c'est une ombre)
  stickers: { tour: string; centre: string; couleur: CouleurSticker }[]; // [gauche, droite]
};

const img = (nom: string) => ({ image: `/images/hero/${nom}.webp`, imageSm: `/images/hero/${nom}-sm.webp` });

export const DIAPOS_HERO: DiapoHero[] = [
  {
    produit: "la-reine",
    ...img("la-reine"),
    fond: "#F4B63F",
    forme: "#F8CB6E",
    titre: "#D7282F",
    texteClair: false,
    decor: { motifs: ["/decors/couronne.svg"] },
    ombre: "#7a3d00",
    ombreOpacite: 0.11,
    stickers: [
      { tour: "On livre chez vous", centre: "Dakar", couleur: "tomate" },
      { tour: "Pizza populaire", centre: "Reine", couleur: "basilic" },
    ],
  },
  {
    produit: "la-time-burger",
    ...img("la-time-burger"),
    fond: "#D7282F",
    forme: "#E2474D",
    titre: "#FFF3DF",
    texteClair: true,
    decor: { motifs: ["/decors/burger.svg"] },
    ombre: "#5c0a0d",
    ombreOpacite: 0.16,
    stickers: [
      { tour: "La pizza du moment", centre: "Time", couleur: "croute" },
      { tour: "Base crème fraîche", centre: "Crème", couleur: "blanc" },
    ],
  },
  {
    produit: "la-4-fromages",
    ...img("la-4-fromages"),
    fond: "#23703A",
    forme: "#2F8F46",
    titre: "#F4B63F",
    texteClair: true,
    decor: { motifs: ["/decors/fromage.svg"] },
    ombre: "#0b3318",
    ombreOpacite: 0.25,
    stickers: [
      { tour: "Végétarienne", centre: "Végé", couleur: "blanc" },
      { tour: "Gorgonzola provolone", centre: "4", couleur: "croute" },
    ],
  },
  {
    produit: "la-mexicaine",
    ...img("la-mexicaine"),
    fond: "#FFF3DF",
    forme: "#FFE3B5",
    titre: "#D7282F",
    texteClair: false,
    decor: { motifs: ["/decors/sombrero.svg", "/decors/moustache.svg"] },
    ombre: "#a3561f",
    ombreOpacite: 0.13,
    stickers: [
      { tour: "Merguez pepperoni", centre: "Épicée", couleur: "tomate" },
      { tour: "On livre chez vous", centre: "Dakar", couleur: "croute" },
    ],
  },
  {
    produit: "la-chicago",
    ...img("la-chicago"),
    fond: "#1B1B1B",
    forme: "#2C2C2C",
    titre: "#F4B63F",
    texteClair: true,
    decor: { panorama: "/decors/skyline.svg" },
    ombre: "#ffffff",
    ombreOpacite: 0.07,
    stickers: [
      { tour: "Cheddar et œuf", centre: "Chicago", couleur: "croute" },
      { tour: "Base crème fraîche", centre: "Crème", couleur: "basilic" },
    ],
  },
];
