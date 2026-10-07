"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMouvementReduit } from "@/lib/mouvement";

/**
 * Scroll fluide Lenis, synchronisé avec ScrollTrigger.
 * Lenis est monté en mode `root` à côté du contenu : l'activer ou le couper
 * (mouvement réduit) ne remonte pas la page. Son instance reste accessible
 * partout via `useLenis()` (ex. `lenis.stop()` à l'ouverture du panier).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const mouvementReduit = useMouvementReduit();
  const lenisRef = useRef<LenisRef>(null);

  // Chaque défilement Lenis met à jour les positions ScrollTrigger.
  useLenis(() => ScrollTrigger.update());

  // Lenis avance au rythme du ticker GSAP (autoRaf: false).
  useEffect(() => {
    if (mouvementReduit) return;

    const avancer = (temps: number) => lenisRef.current?.lenis?.raf(temps * 1000);
    gsap.ticker.add(avancer);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(avancer);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [mouvementReduit]);

  return (
    <>
      {!mouvementReduit && (
        <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1 }} />
      )}
      {children}
    </>
  );
}
