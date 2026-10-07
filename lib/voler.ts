"use client";

import { gsap } from "@/lib/gsap";

/** Mini-image du produit qui vole jusqu'au bouton panier visible (header ou barre mobile). */
export function volerVersPanier(source: HTMLElement | null, src: string | null) {
  if (!source || !src) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cible = [...document.querySelectorAll<HTMLElement>("[data-panier-cible]")].find(
    (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden",
  );
  if (!cible) return;

  const depart = source.getBoundingClientRect();
  const arrivee = cible.getBoundingClientRect();
  const taille = Math.min(110, depart.width * 0.55);

  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  Object.assign(img.style, {
    position: "fixed",
    left: `${depart.left + depart.width / 2 - taille / 2}px`,
    top: `${depart.top + depart.height / 2 - taille / 2}px`,
    width: `${taille}px`,
    height: `${taille}px`,
    objectFit: "contain",
    zIndex: "100",
    pointerEvents: "none",
    borderRadius: "999px",
  });
  document.body.appendChild(img);

  const dx = arrivee.left + arrivee.width / 2 - (depart.left + depart.width / 2);
  const dy = arrivee.top + arrivee.height / 2 - (depart.top + depart.height / 2);

  gsap
    .timeline({ onComplete: () => img.remove() })
    .to(img, { x: dx, duration: 0.65, ease: "power1.in" }, 0)
    .to(img, { y: dy, duration: 0.65, ease: "back.in(1.6)" }, 0)
    .to(img, { scale: 0.22, rotation: 300, duration: 0.65, ease: "power2.in" }, 0);
}
