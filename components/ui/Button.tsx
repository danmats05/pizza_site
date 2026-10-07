import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variante = "principale" | "claire" | "jaune" | "noire";
type Taille = "md" | "lg" | "sm";

// Survol « origine » : couleur du disque (--origine-fond) et du texte (--origine-texte) par variante.
const VARIANTES: Record<Variante, string> = {
  principale: "bg-tomate text-white [--origine-fond:var(--color-charbon)] [--origine-texte:#fff]",
  claire: "bg-white text-charbon ring-1 ring-charbon/15 ring-inset [--origine-fond:var(--color-charbon)] [--origine-texte:#fff]",
  jaune: "bg-croute text-charbon [--origine-fond:var(--color-charbon)] [--origine-texte:#fff]",
  noire: "bg-charbon text-white [--origine-fond:var(--color-tomate)] [--origine-texte:#fff]",
};

const TAILLES: Record<Taille, string> = {
  sm: "h-10 px-4 text-sm gap-2",
  md: "h-12 px-5 text-base gap-2",
  lg: "h-14 px-7 text-lg gap-3",
};

type Commun = { variante?: Variante; taille?: Taille; className?: string; children: ReactNode };

export function classesBouton({ variante = "principale", taille = "md", className = "" }: Omit<Commun, "children">) {
  return [
    "origine inline-flex shrink-0 items-center justify-center rounded-bouton font-semibold whitespace-nowrap select-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTES[variante],
    TAILLES[taille],
    className,
  ].join(" ");
}

export function Button({ variante, taille, className, ...props }: Commun & ComponentPropsWithoutRef<"button">) {
  return <button type="button" className={classesBouton({ variante, taille, className })} {...props} />;
}

/** Même rendu qu'un bouton, pour les liens (ancres, tel:, wa.me). */
export function LienBouton({ variante, taille, className, ...props }: Commun & ComponentPropsWithoutRef<"a">) {
  return <a className={classesBouton({ variante, taille, className })} {...props} />;
}
