"use client";

// Point d'entrée unique de GSAP : les plugins sont enregistrés une seule fois ici.
// Les composants importent gsap, ScrollTrigger et useGSAP depuis ce fichier.
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
}

export { gsap, Flip, ScrollTrigger, useGSAP };
