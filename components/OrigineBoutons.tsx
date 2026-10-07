"use client";

import { useEffect } from "react";

/** Diamètre du disque qui couvre tout le bouton depuis le point (x, y). */
function diametre(l: number, h: number, x: number, y: number) {
  return Math.ceil(2 * Math.max(Math.hypot(x, y), Math.hypot(l - x, y), Math.hypot(x, h - y), Math.hypot(l - x, h - y)));
}

function poser(el: HTMLElement, x: number, y: number) {
  const r = el.getBoundingClientRect();
  el.style.setProperty("--ox", `${x}px`);
  el.style.setProperty("--oy", `${y}px`);
  el.style.setProperty("--od", `${diametre(r.width, r.height, x, y)}px`);
}

/**
 * Point de départ du survol « origine » (classe .origine) : là où le curseur entre dans le bouton,
 * au centre pour le clavier. Un seul écouteur délégué pour toute la page.
 */
export default function OrigineBoutons() {
  useEffect(() => {
    const entree = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(".origine");
      if (!el || el.contains(e.relatedTarget as Node | null)) return; // déplacement à l'intérieur du bouton
      const r = el.getBoundingClientRect();
      poser(el, e.clientX - r.left, e.clientY - r.top);
    };
    const focus = (e: FocusEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(".origine");
      if (!el || !el.matches(":focus-visible")) return;
      const r = el.getBoundingClientRect();
      poser(el, r.width / 2, r.height / 2);
    };
    document.addEventListener("pointerover", entree);
    document.addEventListener("focusin", focus);
    return () => {
      document.removeEventListener("pointerover", entree);
      document.removeEventListener("focusin", focus);
    };
  }, []);
  return null;
}
