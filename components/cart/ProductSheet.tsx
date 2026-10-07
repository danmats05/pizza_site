"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  accepteNote,
  detailPerso,
  detailTaille,
  NOTE_MAX,
  persoInitiale,
  persoPour,
  type GroupePerso,
  type Perso,
} from "@/data/personnalisation";
import type { Produit } from "@/data/types";
import { photo } from "@/lib/images";
import { prixF } from "@/lib/prix";
import { useInterface, type ProduitOuvert } from "@/store/interface";
import { trouverProduit, usePanier } from "@/store/panier";
import Fenetre from "@/components/ui/Fenetre";
import PrixAnime from "@/components/ui/PrixAnime";
import { IconeCoche, IconeFermer, IconePlus } from "@/components/ui/Icones";

/** Fenêtre de personnalisation : ouverte depuis une carte (ajout) ou depuis le panier (modification). */
export default function ProductSheet() {
  const ouvert = useInterface((e) => e.produitOuvert);
  const fermer = useInterface((e) => e.fermerProduit);
  // Garde le dernier produit affiché pendant l'animation de fermeture.
  const [affiche, setAffiche] = useState<ProduitOuvert | null>(null);
  if (ouvert && ouvert !== affiche) setAffiche(ouvert);

  const produit = affiche ? trouverProduit(affiche.id) : undefined;

  return (
    <Fenetre
      ouverte={!!ouvert}
      onFermer={fermer}
      titre={produit ? `Personnaliser ${produit.nom}` : "Personnaliser"}
      variante="fiche"
    >
      {produit && affiche && (
        <Contenu
          key={`${affiche.id}-${affiche.cle ?? "nouveau"}`}
          produit={produit}
          ouvert={affiche}
          onFermer={fermer}
        />
      )}
    </Fenetre>
  );
}

function Contenu({ produit, ouvert, onFermer }: { produit: Produit; ouvert: ProduitOuvert; onFermer: () => void }) {
  const ligne = usePanier((e) => (ouvert.cle ? e.lignes.find((l) => l.cle === ouvert.cle) : undefined));
  const ajouter = usePanier((e) => e.ajouter);
  const remplacer = usePanier((e) => e.remplacer);
  const ouvrirPanier = useInterface((e) => e.ouvrirPanier);
  const modification = !!ouvert.cle;

  const [option, setOption] = useState(
    ligne?.option ?? ouvert.option ?? (produit.type === "options" ? produit.options.defaut : undefined),
  );
  const [choix, setChoix] = useState<string[]>(
    ligne?.choix ?? ouvert.choix ?? produit.choix?.map((c) => c.liste[0]) ?? [],
  );
  const [perso, setPerso] = useState<Perso>(ligne?.perso ?? persoInitiale(produit));
  const [qte, setQte] = useState(ligne?.qte ?? 1);
  const [fait, setFait] = useState(false);

  useEffect(() => {
    if (!fait) return;
    const id = setTimeout(onFermer, 650);
    return () => clearTimeout(id);
  }, [fait, onFermer]);

  const groupes = persoPour(produit);
  const base = produit.type === "unique" ? produit.prix : produit.options.liste.find((o) => o.id === option)!.prix;
  const { extra } = detailPerso(produit, perso);
  const unitaire = base + extra;

  const valider = () => {
    const c = choix.length ? choix : undefined;
    if (modification && ouvert.cle) remplacer(ouvert.cle, { id: produit.id, option, choix: c, perso, qte });
    else ajouter(produit.id, option, c, perso, qte);
    setFait(true);
    if (modification) ouvrirPanier();
  };

  return (
    <>
      <button
        type="button"
        onClick={onFermer}
        aria-label="Fermer"
        className="absolute top-3 right-3 z-20 grid size-11 place-items-center rounded-full bg-white shadow-douce-sm transition-colors hover:bg-pate"
      >
        <IconeFermer className="size-5" />
      </button>

      {/* Mobile : toute la fiche défile d'un bloc. Desktop : photo fixe à gauche, options qui défilent à droite. */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:grid md:grid-cols-[0.9fr_1.1fr] md:overflow-clip">
        {/* Photo et description */}
        <div className="flex flex-col items-center bg-white px-6 pt-6 pb-4 md:justify-center md:py-10">
          {produit.img && (
            <div className="relative aspect-[4/3] w-full max-w-[16rem] md:max-w-sm">
              <Image
                src={photo(produit.img)}
                alt={produit.nom}
                fill
                sizes="(min-width: 768px) 380px, 260px"
                className="object-contain"
              />
            </div>
          )}
          <h2 className="titre mt-3 text-center text-3xl leading-[1.05] md:text-4xl">{produit.nom}</h2>
          {produit.desc && <p className="mt-2 max-w-sm text-center leading-snug text-charbon/70">{produit.desc}</p>}
        </div>

        {/* Options, qui défilent */}
        <div className="px-5 pt-5 pb-6 md:min-h-0 md:overflow-y-auto md:overscroll-contain md:px-7 md:pt-14">
          <div className="cascade flex flex-col gap-7 [--d:150ms]">
            {produit.type === "options" && (
              <Section titre={produit.options.titre} aide="Un seul choix">
                <div className="cascade grid grid-cols-2 gap-2 sm:grid-cols-3 [--d:200ms]">
                  {produit.options.liste.map((o) => (
                    <CarteChoix
                      key={o.id}
                      type="radio"
                      nom={`option-${produit.id}`}
                      actif={option === o.id}
                      onChange={() => setOption(o.id)}
                      label={o.label}
                      detail={prixF(o.prix)}
                      sousDetail={tailleCourte(produit, o.id)}
                    />
                  ))}
                </div>
              </Section>
            )}

            {produit.choix?.map((c, i) => (
              <Section key={c.titre} titre={c.titre} aide="Un seul choix">
                <div className="cascade flex flex-wrap gap-2 [--d:250ms]">
                  {c.liste.map((x) => (
                    <Pastille
                      key={x}
                      type="radio"
                      nom={`choix-${i}`}
                      actif={choix[i] === x}
                      onChange={() => setChoix((v) => v.map((y, j) => (j === i ? x : y)))}
                      label={x}
                    />
                  ))}
                </div>
              </Section>
            ))}

            {groupes.map((g) => (
              <Groupe key={g.id} groupe={g} perso={perso} setPerso={setPerso} />
            ))}

            {accepteNote(produit) && (
              <Section titre="Une précision ?" aide="Facultatif">
                <textarea
                  value={perso.note ?? ""}
                  maxLength={NOTE_MAX}
                  rows={2}
                  onChange={(e) => setPerso((p) => ({ ...p, note: e.target.value }))}
                  placeholder="Ex. : sans oignons, bien cuite…"
                  aria-label="Précision pour la cuisine"
                  className="w-full resize-none rounded-2xl bg-white px-4 py-3 text-base ring-1 ring-charbon/10 ring-inset placeholder:text-charbon/40 focus:ring-2 focus:ring-charbon/30 focus:outline-none"
                />
                <p className="mt-1 text-right text-xs text-charbon/45">
                  {(perso.note ?? "").length}/{NOTE_MAX}
                </p>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Pied : quantité + bouton, toujours visible */}
      <div className="marge-securite-bas flex items-center gap-3 border-t border-charbon/10 bg-white px-5 pt-4 md:px-7">
        <Quantite valeur={qte} onChange={setQte} nom={produit.nom} />
        <button
          type="button"
          onClick={valider}
          disabled={!produit.enStock || fait}
          className={`origine flex h-14 min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl px-4 text-base font-bold sm:px-5 sm:text-lg text-white [--origine-fond:var(--color-charbon)] [--origine-texte:#fff] disabled:cursor-not-allowed ${
            fait ? "bg-basilic-fonce" : "bg-tomate"
          }`}
        >
          {fait ? (
            <span className="mx-auto inline-flex items-center gap-2">
              <IconeCoche className="size-5" /> {modification ? "Panier mis à jour" : "Ajouté au panier"}
            </span>
          ) : (
            <>
              <span className="truncate">
                {!produit.enStock ? (
                  "Indisponible"
                ) : modification ? (
                  "Mettre à jour"
                ) : (
                  <>
                    Ajouter<span className="hidden sm:inline"> au panier</span>
                  </>
                )}
              </span>
              <span className="shrink-0 rounded-lg bg-white/15 px-2.5 py-1 text-base whitespace-nowrap">
                <PrixAnime apparition={false} montant={unitaire * qte} />
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}

function Section({ titre, aide, children }: { titre: string; aide: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 flex w-full items-baseline justify-between gap-3">
        <span className="titre text-xl">{titre}</span>
        <span className="text-sm font-semibold text-charbon/50">{aide}</span>
      </legend>
      {children}
    </fieldset>
  );
}

function Groupe({
  groupe: g,
  perso,
  setPerso,
}: {
  groupe: GroupePerso;
  perso: Perso;
  setPerso: React.Dispatch<React.SetStateAction<Perso>>;
}) {
  if (g.type === "unique") {
    return (
      <Section titre={g.titre} aide={g.aide}>
        <div className="cascade grid grid-cols-3 gap-2 [--d:250ms]">
          {g.options.map((o) => (
            <CarteChoix
              key={o.id}
              type="radio"
              nom={g.id}
              actif={perso.pate === o.id}
              onChange={() => setPerso((p) => ({ ...p, pate: o.id }))}
              label={o.label}
              detail={o.prix ? `+${prixF(o.prix)}` : o.aide}
            />
          ))}
        </div>
      </Section>
    );
  }
  const cle = g.id as "supplements" | "sauces";
  const choisis = perso[cle] ?? [];
  const plein = g.max !== undefined && choisis.length >= g.max;
  return (
    <Section
      titre={g.titre}
      aide={`${g.aide}${choisis.length ? ` · ${choisis.length} choisi${choisis.length > 1 ? "s" : ""}` : ""}`}
    >
      <div className="cascade flex flex-wrap gap-2 [--d:250ms]">
        {g.options.map((o) => {
          const actif = choisis.includes(o.id);
          return (
            <Pastille
              key={o.id}
              type="checkbox"
              actif={actif}
              desactive={!actif && plein}
              onChange={() =>
                setPerso((p) => {
                  const liste = p[cle] ?? [];
                  return { ...p, [cle]: actif ? liste.filter((x) => x !== o.id) : [...liste, o.id] };
                })
              }
              label={o.label}
              detail={o.prix ? `+${prixF(o.prix)}` : undefined}
            />
          );
        })}
      </div>
    </Section>
  );
}

/** Détail court d'une taille de pizza pour la case de choix : « 33 cm · 2 personnes ». */
function tailleCourte(produit: Produit, option: string) {
  const t = detailTaille(produit, option);
  return t ? `${t.diametre.replace(" de diamètre", "")} · ${t.portions}` : undefined;
}

/** Grande case de choix (taille, pâte) : bouton radio stylé. */
function CarteChoix({
  type,
  nom,
  actif,
  onChange,
  label,
  detail,
  sousDetail,
}: {
  type: "radio";
  nom: string;
  actif: boolean;
  onChange: () => void;
  label: string;
  detail?: string;
  sousDetail?: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer flex-col rounded-2xl px-4 py-3 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-croute ${
        actif ? "bg-charbon text-white" : "bg-white ring-1 ring-charbon/10 ring-inset hover:ring-charbon/30"
      }`}
    >
      <input type={type} name={nom} checked={actif} onChange={onChange} className="sr-only" />
      <span className="font-bold">{label}</span>
      {detail && <span className={`text-sm ${actif ? "text-white/70" : "text-charbon/55"}`}>{detail}</span>}
      {sousDetail && (
        <span
          className={`mt-1.5 border-t pt-1.5 text-xs leading-tight ${actif ? "border-white/15 text-white/65" : "border-charbon/8 text-charbon/50"}`}
        >
          {sousDetail}
        </span>
      )}
    </label>
  );
}

/** Pastille cochable (suppléments, sauces, parfums). */
function Pastille({
  type,
  nom,
  actif,
  desactive,
  onChange,
  label,
  detail,
}: {
  type: "radio" | "checkbox";
  nom?: string;
  actif: boolean;
  desactive?: boolean;
  onChange: () => void;
  label: string;
  detail?: string;
}) {
  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full py-2 pr-4 pl-2.5 font-semibold transition-colors has-focus-visible:outline-3 has-focus-visible:outline-croute ${
        actif ? "bg-charbon text-white" : "bg-white ring-1 ring-charbon/10 ring-inset hover:ring-charbon/30"
      } ${desactive ? "cursor-not-allowed opacity-40" : ""}`}
    >
      <input type={type} name={nom} checked={actif} disabled={desactive} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={`grid size-5 place-items-center rounded-full transition-colors ${actif ? "bg-croute text-charbon" : "ring-1 ring-charbon/25 ring-inset"}`}
      >
        {actif &&
          (type === "checkbox" ? (
            <IconeCoche className="size-3.5" strokeWidth={3} />
          ) : (
            <span className="size-2 rounded-full bg-charbon" />
          ))}
      </span>
      {label}
      {detail && <span className={`text-sm ${actif ? "text-white/70" : "text-charbon/50"}`}>{detail}</span>}
    </label>
  );
}

export function Quantite({
  valeur,
  onChange,
  nom,
  petit,
}: {
  valeur: number;
  onChange: (n: number) => void;
  nom: string;
  petit?: boolean;
}) {
  const taille = petit ? "size-9" : "size-12";
  return (
    <div
      className={`flex shrink-0 items-center rounded-full bg-farine ring-1 ring-charbon/10 ring-inset ${petit ? "" : "p-1"}`}
    >
      <button
        type="button"
        aria-label={`Retirer un ${nom}`}
        disabled={valeur <= 1}
        onClick={() => onChange(valeur - 1)}
        className={`grid ${taille} place-items-center rounded-full text-xl font-bold transition-colors hover:bg-white disabled:opacity-30`}
      >
        −
      </button>
      <span
        aria-live="polite"
        className={`min-w-7 text-center font-bold tabular-nums ${petit ? "text-base" : "text-lg"}`}
      >
        <span className="sr-only">Quantité : </span>
        {valeur}
      </span>
      <button
        type="button"
        aria-label={`Ajouter un ${nom}`}
        disabled={valeur >= 20}
        onClick={() => onChange(valeur + 1)}
        className={`grid ${taille} place-items-center rounded-full transition-colors hover:bg-white disabled:opacity-30`}
      >
        <IconePlus className={petit ? "size-4" : "size-5"} strokeWidth={2.6} />
      </button>
    </div>
  );
}
