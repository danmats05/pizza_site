// Coordonnées et infos pratiques de la pizzeria.
// Site de démonstration : toutes les valeurs marquées FICTIF sont inventées
// et seront remplacées par les vraies une fois l'accord avec la pizzeria obtenu.

export const CONFIG = {
  nom: "Pizza Time",
  ville: "Dakar",
  url: "https://pizzatimedkr.com",

  whatsapp: "221770000000", // FICTIF (démo)
  telephone: "+221 77 000 00 00", // FICTIF (démo)
  telephoneLien: "+221770000000", // FICTIF (démo)

  adresse: "Rue 10 x Avenue Cheikh Anta Diop, Fann, Dakar", // FICTIF (démo)

  // Heure de Dakar = UTC, toute l'année.
  horaires: { debut: "11:00", fin: "23:30" }, // FICTIF (démo)
  joursFermeture: [] as number[], // FICTIF (démo) — 0 = dimanche … 6 = samedi

  paiements: ["Wave", "Orange Money", "Espèces"],

  reseaux: {
    instagram: "https://www.instagram.com/", // FICTIF (démo)
    facebook: "https://www.facebook.com/", // FICTIF (démo)
    tiktok: "https://www.tiktok.com/", // FICTIF (démo)
  },
} as const;
