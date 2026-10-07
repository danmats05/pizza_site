export type CategorieId = "pizza" | "texmex" | "tacos" | "sandwich" | "panini" | "salade" | "dessert" | "boisson";

export type FiltreId = "tomate" | "creme" | "poisson" | "epice" | "vege" | "viande";

/** Une option qui change le prix : taille de pizza, formule simple / menu, nombre de pièces… */
export type Option = { id: string; label: string; prix: number };

/** Un choix sans incidence sur le prix : parfum, sauce, viande… */
export type Choix = { titre: string; liste: string[] };

type ProduitBase = {
  id: string;
  cat: CategorieId;
  nom: string;
  desc: string;
  img: string | null; // 800 px
  imgSm: string | null; // 400 px
  enStock: boolean;
  tags: FiltreId[];
  badge?: string;
  choix?: Choix[];
};

export type ProduitPrixUnique = ProduitBase & { type: "unique"; prix: number };

export type ProduitAOptions = ProduitBase & {
  type: "options";
  options: { titre: string; liste: Option[]; defaut: string };
};

export type Produit = ProduitPrixUnique | ProduitAOptions;
