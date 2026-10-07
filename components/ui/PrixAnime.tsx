"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prixF } from "@/lib/prix";

const reduit = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Prix animé :
 * - à sa première apparition à l'écran, il monte depuis le bas (révélé par un masque) ;
 * - quand le montant change, les chiffres défilent de l'ancien au nouveau, avec un léger rebond.
 * Le texte est mis à jour directement dans le DOM pendant l'animation (pas de re-rendu React à chaque image).
 */
export default function PrixAnime({
  montant,
  className = "",
  apparition = true,
}: {
  montant: number;
  className?: string;
  /** false : pas d'animation d'entrée (prix déjà à l'écran, ex. panier, fiche produit). */
  apparition?: boolean;
}) {
  const masque = useRef<HTMLSpanElement>(null);
  const texte = useRef<HTMLSpanElement>(null);
  const affiche = useRef(montant); // montant actuellement affiché (peut être en cours d'animation)

  // Apparition : une seule fois, quand le prix entre dans l'écran.
  useEffect(() => {
    const el = texte.current!;
    const boite = masque.current!;
    // Le masque ne sert qu'à la révélation : ensuite il laisse déborder (rebond des changements de prix).
    const libererMasque = () => (boite.style.overflow = "visible");
    if (reduit() || !apparition) {
      libererMasque();
      return;
    }
    gsap.set(el, { yPercent: 110 });
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        gsap.to(el, { yPercent: 0, duration: 0.6, ease: "power3.out", onComplete: libererMasque });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(boite);
    return () => {
      obs.disconnect();
      gsap.set(el, { clearProps: "transform" });
    };
  }, [apparition]);

  // Changement de montant : défilement des chiffres + rebond.
  useEffect(() => {
    const el = texte.current!;
    if (affiche.current === montant) return;
    if (reduit()) {
      affiche.current = montant;
      el.textContent = prixF(montant);
      return;
    }
    const compteur = { v: affiche.current };
    const anim = gsap.to(compteur, {
      v: montant,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => {
        affiche.current = Math.round(compteur.v);
        el.textContent = prixF(Math.round(compteur.v / 50) * 50);
      },
      onComplete: () => {
        affiche.current = montant;
        el.textContent = prixF(montant);
      },
    });
    const rebond = gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 0.45, ease: "back.out(3)", transformOrigin: "left center" });
    return () => {
      anim.kill();
      rebond.kill();
    };
  }, [montant]);

  return (
    <span ref={masque} className={`inline-block overflow-hidden align-bottom ${className}`}>
      <span ref={texte} className="inline-block tabular-nums" aria-hidden="true">
        {prixF(montant)}
      </span>
      {/* Valeur finale pour les lecteurs d'écran (le texte animé est masqué pour eux) */}
      <span className="sr-only">{prixF(montant)}</span>
    </span>
  );
}
