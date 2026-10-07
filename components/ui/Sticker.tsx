import { useId, type CSSProperties } from "react";

type Couleur = "croute" | "basilic" | "blanc" | "tomate";

const FONDS: Record<Couleur, { fond: string; texte: string }> = {
  croute: { fond: "var(--color-croute)", texte: "var(--color-encre)" },
  basilic: { fond: "var(--color-basilic-fonce)", texte: "#fff" },
  blanc: { fond: "#fff", texte: "var(--color-encre)" },
  tomate: { fond: "var(--color-tomate)", texte: "#fff" },
};

/**
 * Sticker rond façon étiquette : un texte qui fait le tour du cercle
 * (police MADE TOMMY, pour le distinguer du texte courant) et un mot fort au centre (Ultra). À plat, sans contour.
 */
export function Sticker({
  tour,
  centre,
  couleur = "croute",
  rotation = 8,
  taille = 140,
  className = "",
  style,
}: {
  tour: string;
  centre: string;
  couleur?: Couleur;
  rotation?: number;
  taille?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useId();
  const { fond, texte } = FONDS[couleur];
  // Le texte fait tout le tour du cercle sans lettres écartées : on le répète autant de fois qu'il faut
  // pour remplir la circonférence à taille normale, puis on ajuste la taille pour que ça tombe juste.
  const CIRCONFERENCE = 2 * Math.PI * 74;
  const LARGEUR_LETTRE = 0.6; // largeur moyenne d'un caractère, en fraction de la taille de police
  const motif = `${tour} • `;
  const repetitions = Math.max(1, Math.round(CIRCONFERENCE / (motif.length * LARGEUR_LETTRE * 19)));
  const tourComplet = motif.repeat(repetitions);
  const policeTour = Math.min(22, Math.max(14, CIRCONFERENCE / (tourComplet.length * LARGEUR_LETTRE)));
  const policeCentre = Math.min(36, 118 / (centre.length * 0.74));

  return (
    <div
      className={`relative shrink-0 rounded-full ${className}`}
      style={{ width: taille, height: taille, rotate: `${rotation}deg`, ...style }}
      role="img"
      aria-label={`${centre} — ${tour}`}
    >
      <svg viewBox="0 0 200 200" className="size-full" aria-hidden="true">
        <defs>
          <path id={`cercle-${id}`} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill={fond} />
        <circle cx="100" cy="100" r="56" fill="none" stroke={texte} strokeWidth="2.5" strokeDasharray="4 6" />
        <text
          fill={texte}
          style={{ fontFamily: "var(--font-tommy)", fontWeight: 600, fontSize: policeTour, letterSpacing: 0.5 }}
        >
          <textPath href={`#cercle-${id}`} textLength={2 * Math.PI * 74 - 6} lengthAdjust="spacing">
            {tourComplet}
          </textPath>
        </text>
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="central"
          fill={texte}
          style={{ fontFamily: "var(--font-display)", fontSize: policeCentre }}
        >
          {centre}
        </text>
      </svg>
    </div>
  );
}
