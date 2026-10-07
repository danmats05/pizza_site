import type { CategorieId, FiltreId } from "./types";

// Ordre d'affichage du menu. `vignette` : photo du mega menu.
// Les photos qui apparaissent au survol des onglets sont dans data/onglets.ts (généré).
export const CATEGORIES: { id: CategorieId; label: string; accroche: string; vignette: string }[] = [
  { id: "pizza", label: "Pizzas", accroche: "Base tomate, base crème ou spéciales", vignette: "/images/base-tomate/la-reine-sm.webp" },
  { id: "texmex", label: "Tex-Mex", accroche: "Tenders, wings, frites…", vignette: "/images/tex-mex/tenders-nature-sm.webp" },
  { id: "tacos", label: "Tacos", accroche: "Simple ou en menu", vignette: "/images/tacos/tacos-viande-hachee-sm.webp" },
  { id: "sandwich", label: "Sandwichs", accroche: "Kebab, steak, chawarma", vignette: "/images/sandwichs/sandwich-chawarma-sm.webp" },
  { id: "panini", label: "Paninis", accroche: "Pressés et bien chauds", vignette: "/images/panini/le-venezia-sm.webp" },
  { id: "salade", label: "Salades", accroche: "Fraîches et complètes", vignette: "/images/salade/la-fermiere-sm.webp" },
  { id: "dessert", label: "Desserts", accroche: "Crêpes, tiramisu, glaces", vignette: "/images/dessert/tarte-au-daim-sm.webp" },
  { id: "boisson", label: "Boissons", accroche: "Sodas, jus naturels, eau", vignette: "/images/vignettes/boissons.webp" },
];

// `icone` : pictos Icons8 vectorisés en SVG (public/icons, scripts/vectoriser-icones.py). `fond` : teinte claire de la couleur de l'icône
// (rouge #E02820 pour tomate, ketchup, piment et viande ; vert #10E068 pour la salade ; cyan #10C8E0 pour le poisson).
export const FILTRES: { id: FiltreId; label: string; icone: string; fond: string }[] = [
  { id: "tomate", label: "Base tomate", icone: "/icons/tomate.svg", fond: "#fbe1e0" },
  { id: "creme", label: "Base crème", icone: "/icons/ketchup.svg", fond: "#fbe1e0" },
  { id: "poisson", label: "Poisson", icone: "/icons/poisson.svg", fond: "#def7fb" },
  { id: "epice", label: "Épicé", icone: "/icons/piment.svg", fond: "#fbe1e0" },
  { id: "vege", label: "Végétarien", icone: "/icons/salade.svg", fond: "#defbea" },
  { id: "viande", label: "Viande", icone: "/icons/viande.svg", fond: "#fbe1e0" },
];

// Produit mis en avant dans le mega menu et le hero.
export const PIZZA_DU_MOMENT = "la-time-burger";
