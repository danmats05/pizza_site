import type { ReactNode } from "react";

type Couleur = "croute" | "basilic" | "tomate" | "blanc";

const COULEURS: Record<Couleur, string> = {
  croute: "bg-croute text-charbon",
  basilic: "bg-basilic-fonce text-white",
  tomate: "bg-tomate text-white",
  blanc: "bg-white text-charbon",
};

/**
 * Petite étiquette à plat (« Populaire », « Nouveau »…).
 * Padding asymétrique : la police du texte a ses lettres posées bas, on les remonte pour un centrage optique.
 */
export function Badge({
  children,
  couleur = "croute",
  className = "",
}: {
  children: ReactNode;
  couleur?: Couleur;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 pt-[1.75px] pb-[6.25px] text-xs font-bold ${COULEURS[couleur]} ${className}`}>
      {children}
    </span>
  );
}
