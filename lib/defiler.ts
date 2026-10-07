"use client";

import { useCallback, useEffect } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";
import { afficherHeaderPendantNavigation } from "@/store/interface";

/** Bloque le défilement de la page tant que `actif` est vrai (menu mobile, panier). */
export function useBloquerScroll(actif: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!actif) return;
    lenis?.stop();
    const html = document.documentElement;
    const avant = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      lenis?.start();
      html.style.overflow = avant;
    };
  }, [actif, lenis]);
}

/**
 * Hauteur des barres collées en haut, en px : header, plus les onglets si la cible est dans le menu
 * (ils ne sont collés que là). Une section arrive pile sous ces barres : rien de la précédente ne dépasse.
 */
export function decalageHaut(cible?: Element | null) {
  const header = document.querySelector<HTMLElement>("[data-header]")?.offsetHeight ?? 0;
  const dansLeMenu = !cible || !!cible.closest("#menu");
  const onglets = dansLeMenu ? (document.querySelector<HTMLElement>("[data-onglets]")?.offsetHeight ?? 0) : 0;
  return header + onglets;
}

/**
 * Fondu d'apparition après une navigation : les premiers éléments de la cible
 * (marqués data-arrivee, sinon ses enfants directs) passent de transparents à visibles, sans mouvement.
 */
function fonduArrivee(cible: HTMLElement) {
  const marques = cible.querySelectorAll<HTMLElement>("[data-arrivee]");
  // Seulement les éléments affichés (les cartes masquées par les filtres restent dans la page).
  const elements = [...(marques.length ? marques : cible.children)].filter((e) => e.getClientRects().length > 0).slice(0, 10);
  gsap.fromTo(
    elements,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.35, stagger: 0.02, ease: "power1.out", overwrite: true, clearProps: "opacity,visibility" },
  );
}

/**
 * Va directement à une ancre (sans glissement), en tenant compte des barres collées,
 * puis fait apparaître le contenu en fondu. `onFin` est appelé une fois arrivé.
 */
export function useDefilerVers() {
  const lenis = useLenis();
  return useCallback(
    (cible: string, onFin?: () => void) => {
      const el = document.getElementById(cible.replace(/^#/, ""));
      if (!el) return;
      afficherHeaderPendantNavigation();
      // Position calculée en px : avec un élément, Lenis retrancherait en plus scroll-margin et scroll-padding.
      const top = cible === "#haut" ? 0 : Math.max(0, el.getBoundingClientRect().top + window.scrollY - decalageHaut(el));
      if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
      else window.scrollTo({ top });
      // Pas de fondu si le visiteur demande moins d'animations (Lenis est alors désactivé).
      if (lenis && cible !== "#haut") fonduArrivee(el);
      onFin?.();
    },
    [lenis],
  );
}
