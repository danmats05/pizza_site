// Quartiers livrés et frais de livraison.
// FICTIF (démo) : liste et montants inventés à partir des exemples du brief.

export type Zone = { nom: string; frais: number };

export const ZONES: Zone[] = [
  { nom: "Plateau", frais: 1000 },
  { nom: "Médina", frais: 1000 },
  { nom: "Fann", frais: 1000 },
  { nom: "Point E", frais: 1000 },
  { nom: "Mermoz", frais: 1500 },
  { nom: "Sacré-Cœur", frais: 1500 },
  { nom: "Ouakam", frais: 1500 },
  { nom: "Yoff", frais: 2000 },
  { nom: "Ngor", frais: 2000 },
  { nom: "Almadies", frais: 2000 },
  { nom: "Parcelles Assainies", frais: 2000 },
];

export const FRAIS_MIN = Math.min(...ZONES.map((z) => z.frais));
