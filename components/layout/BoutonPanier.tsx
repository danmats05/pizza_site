"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMonte } from "@/lib/monte";
import { nombreArticles, usePanier } from "@/store/panier";
import { useInterface } from "@/store/interface";
import { IconePanier } from "@/components/ui/Icones";

/** Bouton panier du header. C'est aussi la cible de l'animation « produit qui vole ». */
export default function BoutonPanier() {
  const monte = useMonte();
  const n = usePanier((e) => nombreArticles(e.lignes));
  const ouvrirPanier = useInterface((e) => e.ouvrirPanier);
  const bouton = useRef<HTMLButtonElement>(null);
  const precedent = useRef<number | null>(null);

  const compte = monte ? n : 0;

  // Petit rebond quand le nombre d'articles augmente (pas au premier affichage).
  useEffect(() => {
    if (!monte) return;
    if (precedent.current !== null && n > precedent.current && bouton.current) {
      const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduit) {
        gsap.fromTo(bouton.current, { scale: 1 }, { scale: 1.15, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out", delay: 0.55 });
      }
    }
    precedent.current = n;
  }, [n, monte]);

  return (
    <button
      ref={bouton}
      type="button"
      data-panier-cible
      onClick={ouvrirPanier}
      className="origine inline-flex h-12 items-center gap-2 rounded-xl border-2 border-white bg-white px-3 font-bold text-encre [--origine-fond:var(--color-charbon)] [--origine-texte:#fff] sm:px-4"
    >
      <IconePanier className="size-5" />
      <span className="hidden sm:inline">Panier</span>
      <span
        aria-live="polite"
        className="inline-flex min-w-7 items-center justify-center rounded-lg bg-croute px-1.5 py-0.5 text-sm tabular-nums"
      >
        <span className="sr-only">Panier : </span>
        {compte}
        <span className="sr-only"> {compte > 1 ? "articles" : "article"}</span>
      </span>
    </button>
  );
}
