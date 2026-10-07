"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useBloquerScroll } from "@/lib/defiler";

/**
 * Fenêtre modale basée sur <dialog> (focus piégé, Échap, arrière-plan inerte, retour du focus à la fermeture).
 * - « tiroir » : panneau collé à droite (plein écran sur mobile) ;
 * - « fiche » : fenêtre centrée sur desktop, feuille qui monte du bas sur mobile.
 * Entrée et sortie animées avec GSAP (sauf mouvement réduit).
 */
export default function Fenetre({
  ouverte,
  onFermer,
  titre,
  variante,
  children,
}: {
  ouverte: boolean;
  onFermer: () => void;
  titre: string;
  variante: "tiroir" | "fiche";
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panneau = useRef<HTMLDivElement>(null);
  const fermeture = useRef(false);

  useBloquerScroll(ouverte);

  useEffect(() => {
    const d = dialog.current!;
    const p = panneau.current!;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const depart =
      variante === "tiroir" ? { xPercent: 100 } : mobile ? { yPercent: 100 } : { y: 30, scale: 0.97, autoAlpha: 0 };

    if (ouverte && !d.open) {
      fermeture.current = false;
      d.showModal();
      if (!reduit) {
        gsap.fromTo(p, depart, { xPercent: 0, yPercent: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: "power3.out" });
        gsap.fromTo(d, { "--voile": 0 }, { "--voile": 1, duration: 0.35, ease: "power1.out" });
      }
    } else if (!ouverte && d.open && !fermeture.current) {
      fermeture.current = true;
      if (reduit) {
        d.close();
        return;
      }
      gsap.to(d, { "--voile": 0, duration: 0.25 });
      gsap.to(p, { ...depart, duration: 0.3, ease: "power2.in", onComplete: () => d.close() });
    }
  }, [ouverte, variante]);

  const placement =
    variante === "tiroir"
      ? "ml-auto h-dvh w-full max-w-[30rem] md:h-[calc(100dvh-1.5rem)] md:rounded-[28px]"
      : "mt-auto h-[92dvh] w-full rounded-t-[28px] md:m-auto md:h-auto md:max-h-[88dvh] md:max-w-4xl md:rounded-[28px]";

  return (
    <dialog
      ref={dialog}
      aria-label={titre}
      onCancel={(e) => {
        e.preventDefault(); // Échap : on passe par onFermer pour animer la sortie
        onFermer();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) onFermer(); // clic sur le voile
      }}
      className="fixed inset-0 m-0 flex h-dvh max-h-none w-full max-w-none items-stretch bg-transparent p-0 [--voile:1] backdrop:bg-black/50 backdrop:opacity-(--voile) not-open:hidden md:p-3"
    >
      <div
        ref={panneau}
        data-lenis-prevent
        className={`relative flex flex-col overflow-clip bg-farine text-charbon shadow-douce-lg ${placement}`}
      >
        {children}
      </div>
    </dialog>
  );
}
