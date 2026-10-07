"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/data/config";
import { PRODUITS } from "@/data/produits";
import { detailTaille, persoPour } from "@/data/personnalisation";
import type { Produit } from "@/data/types";
import { ZONES } from "@/data/zones";
import {
  creerCommande,
  fraisLivraison,
  validerLivraison,
  validerPaiement,
  type Commande,
  type Coordonnees,
  type Erreurs,
} from "@/lib/commande";
import { useDefilerVers } from "@/lib/defiler";
import { gsap, useGSAP } from "@/lib/gsap";
import { photo } from "@/lib/images";
import { useMonte } from "@/lib/monte";
import { prixF } from "@/lib/prix";
import { useInterface } from "@/store/interface";
import { detailLigne, nombreArticles, sousTotal, usePanier, type Ligne } from "@/store/panier";
import Fenetre from "@/components/ui/Fenetre";
import PrixAnime from "@/components/ui/PrixAnime";
import {
  IconeChevron,
  IconeFermer,
  IconeFleche,
  IconePaiement,
  IconePanier,
  IconePlus,
} from "@/components/ui/Icones";
import { Quantite } from "./ProductSheet";

type Etape = "panier" | "livraison" | "paiement" | "confirmation";

const ETAPES: { id: Etape; label: string }[] = [
  { id: "panier", label: "Panier" },
  { id: "livraison", label: "Livraison" },
  { id: "paiement", label: "Paiement" },
];

const VIDE: Coordonnees = { nom: "", telephone: "", quartier: "", adresse: "", paiement: "", remarque: "" };

export default function CartDrawer() {
  const ouvert = useInterface((e) => e.panierOuvert);
  const fermer = useInterface((e) => e.fermerPanier);
  const [etape, setEtape] = useState<Etape>("panier");
  const [commande, setCommande] = useState<Commande | null>(null);
  const [coord, setCoord] = useState<Coordonnees>(VIDE);
  const haut = useRef<HTMLDivElement>(null);

  // À la réouverture après une commande, on repart du panier.
  const fermerTout = () => {
    fermer();
    if (etape === "confirmation") setTimeout(() => setEtape("panier"), 400);
  };

  useEffect(() => {
    haut.current?.scrollTo({ top: 0 });
  }, [etape]);

  return (
    <Fenetre ouverte={ouvert} onFermer={fermerTout} titre="Votre panier" variante="tiroir">
      <header className="flex items-center gap-3 bg-white px-5 pt-4 pb-3">
        {etape === "livraison" || etape === "paiement" ? (
          <button
            type="button"
            onClick={() => setEtape(etape === "paiement" ? "livraison" : "panier")}
            className="grid size-10 place-items-center rounded-full hover:bg-pate"
            aria-label={etape === "paiement" ? "Revenir à la livraison" : "Revenir au panier"}
          >
            <IconeFleche className="size-5 rotate-180" />
          </button>
        ) : null}
        <h2 className="titre flex-1 text-2xl">
          {{ panier: "Votre panier", livraison: "Livraison", paiement: "Paiement", confirmation: "Merci !" }[etape]}
        </h2>
        <button
          type="button"
          onClick={fermerTout}
          aria-label="Fermer le panier"
          className="grid size-10 place-items-center rounded-full hover:bg-pate"
        >
          <IconeFermer className="size-5" />
        </button>
      </header>

      {/* Étapes (3 barres ; l'écran de confirmation, après validation, n'en a pas) */}
      {etape !== "confirmation" && (
        <ol className="flex gap-1 bg-white px-5 pb-3" aria-label="Étapes de la commande">
          {ETAPES.map((e, i) => {
            const index = ETAPES.findIndex((x) => x.id === etape);
            return (
              <li key={e.id} className="flex-1" aria-current={e.id === etape ? "step" : undefined}>
                {/* Barre qui se remplit de gauche à droite */}
                <span className="block h-1.5 overflow-hidden rounded-full bg-charbon/10">
                  <span
                    className={`block h-full origin-left rounded-full bg-tomate transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                      i <= index ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </span>
                <span
                  className={`mt-1.5 block text-xs font-semibold ${i <= index ? "text-charbon" : "text-charbon/40"}`}
                >
                  {e.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div ref={haut} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {etape === "panier" && <VuePanier onContinuer={() => setEtape("livraison")} onFermer={fermerTout} />}
        {etape === "livraison" && (
          <VueLivraison coord={coord} setCoord={setCoord} onContinuer={() => setEtape("paiement")} />
        )}
        {etape === "paiement" && (
          <VuePaiement
            coord={coord}
            setCoord={setCoord}
            onModifierLivraison={() => setEtape("livraison")}
            onValider={(c) => {
              setCommande(c);
              setEtape("confirmation");
            }}
          />
        )}
        {etape === "confirmation" && commande && <VueConfirmation commande={commande} onFermer={fermerTout} />}
      </div>
    </Fenetre>
  );
}

/* ---------------------------------------------------------------- Vue 1 : panier */

function VuePanier({ onContinuer, onFermer }: { onContinuer: () => void; onFermer: () => void }) {
  const monte = useMonte();
  const lignes = usePanier((e) => e.lignes);
  const defilerVers = useDefilerVers();
  const st = sousTotal(lignes);
  const n = nombreArticles(lignes);

  if (!monte) return null;

  if (!lignes.length) {
    return (
      <div className="flex flex-col items-center px-8 py-16 text-center">
        <span className="grid size-24 place-items-center rounded-full bg-pate">
          <IconePanier className="size-10" />
        </span>
        <p className="titre mt-6 text-2xl">Votre panier est vide</p>
        <p className="mt-2 text-charbon/65">Choisissez une pizza dans le menu pour commencer.</p>
        <button
          type="button"
          onClick={() => {
            onFermer();
            setTimeout(() => defilerVers("#menu"), 350);
          }}
          className="origine mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-tomate px-6 font-bold text-white [--origine-fond:var(--color-charbon)]"
        >
          Voir le menu <IconeFleche className="size-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <ul className="cascade flex flex-col gap-3 px-4 pt-4">
        {lignes.map((l) => (
          <LignePanier key={l.cle} ligne={l} />
        ))}
      </ul>

      <Suggestion lignes={lignes} />

      <div className="marge-securite-bas sticky bottom-0 mt-auto border-t border-charbon/10 bg-white px-5 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">
            Sous-total · {n} article{n > 1 ? "s" : ""}
          </span>
          <span className="text-2xl font-bold">
            <PrixAnime apparition={false} montant={st} />
          </span>
        </div>
        <p className="mt-1 text-sm text-charbon/60">Les frais de livraison s&apos;ajoutent à l&apos;étape suivante.</p>
        <button
          type="button"
          onClick={onContinuer}
          className="origine mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-tomate text-lg font-bold text-white [--origine-fond:var(--color-charbon)]"
        >
          Continuer <IconeFleche className="size-5" />
        </button>
      </div>
    </div>
  );
}

function LignePanier({ ligne: l }: { ligne: Ligne }) {
  const changerQte = usePanier((e) => e.changerQte);
  const retirer = usePanier((e) => e.retirer);
  const ouvrirProduit = useInterface((e) => e.ouvrirProduit);
  const d = detailLigne(l);
  if (!d) return null;
  const { produit } = d;
  const personnalisable = persoPour(produit).length > 0 || produit.type === "options" || !!produit.choix;

  return (
    <li className="rounded-2xl bg-white p-3 shadow-douce-sm">
      <div className="flex gap-3">
        <div className="relative size-20 shrink-0 rounded-xl bg-farine">
          {produit.imgSm && (
            <Image src={photo(produit.imgSm)} alt="" fill sizes="80px" className="object-contain p-1" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="titre text-lg leading-tight">{produit.nom}</p>
            <p className="shrink-0 font-bold tabular-nums">
              <PrixAnime apparition={false} montant={d.prix * l.qte} />
            </p>
          </div>
          {d.optionLabel && (
            <p className="mt-0.5 text-sm font-semibold text-charbon/70">
              {d.optionLabel}
              {detailTaille(produit, l.option) && (
                <span className="font-normal text-charbon/55">
                  {" "}
                  · {detailTaille(produit, l.option)!.diametre} · {detailTaille(produit, l.option)!.portions}
                </span>
              )}
            </p>
          )}
          {d.details.length > 0 && (
            <dl className="cascade mt-1.5 space-y-0.5 text-sm leading-snug text-charbon/65 [--d:120ms]">
              {d.details.map((x) => (
                <div key={x.titre} className="flex gap-1.5">
                  <dt className="shrink-0 font-semibold text-charbon/80">{x.titre} :</dt>
                  <dd className="min-w-0 break-words">{x.valeur}</dd>
                </div>
              ))}
            </dl>
          )}
          {l.qte > 1 && <p className="mt-1 text-xs text-charbon/50">{prixF(d.prix)} l&apos;unité</p>}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-charbon/8 pt-3">
        <Quantite petit valeur={l.qte} nom={produit.nom} onChange={(n) => changerQte(l.cle, n - l.qte)} />
        <div className="flex gap-1">
          {personnalisable && (
            <button
              type="button"
              onClick={() => ouvrirProduit({ id: l.id, cle: l.cle })}
              className="h-9 rounded-full px-3 text-sm font-semibold underline-offset-4 hover:bg-pate hover:underline"
            >
              Modifier
            </button>
          )}
          <button
            type="button"
            onClick={() => retirer(l.cle)}
            aria-label={`Retirer ${produit.nom} du panier`}
            className="h-9 rounded-full px-3 text-sm font-semibold text-tomate-fonce hover:bg-[#fbe1e0]"
          >
            Retirer
          </button>
        </div>
      </div>
    </li>
  );
}

/** « Une boisson avec ça ? » ou « Un dessert pour finir ? », selon ce qui manque dans le panier. */
function Suggestion({ lignes }: { lignes: Ligne[] }) {
  const ajouter = usePanier((e) => e.ajouter);
  const cats = new Set(lignes.map((l) => detailLigne(l)?.produit.cat));
  const cible = !cats.has("boisson") ? "boisson" : !cats.has("dessert") ? "dessert" : null;
  if (!cible) return null;
  const titre = cible === "boisson" ? "Une boisson avec ça ?" : "Un dessert pour finir ?";
  const produits = PRODUITS.filter((p): p is Produit => p.cat === cible && p.enStock && p.type === "unique").slice(
    0,
    6,
  );

  return (
    <section className="mt-5 px-4" aria-label={titre}>
      <p className="titre mb-3 px-1 text-lg">{titre}</p>
      <ul className="cascade sans-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 [--d:200ms]">
        {produits.map((p) => (
          <li key={p.id} className="w-32 shrink-0 rounded-2xl bg-white p-2.5 shadow-douce-sm">
            <div className="relative aspect-square">
              {p.imgSm && <Image src={photo(p.imgSm)} alt="" fill sizes="120px" className="object-contain" />}
            </div>
            <p className="mt-1.5 truncate text-sm font-semibold">{p.nom}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-bold">{prixF(p.type === "unique" ? p.prix : 0)}</span>
              <button
                type="button"
                aria-label={`Ajouter ${p.nom}`}
                onClick={() => ajouter(p.id)}
                className="enfonce grid size-8 place-items-center rounded-full bg-tomate text-white hover:bg-tomate-fonce"
              >
                <IconePlus className="size-4" strokeWidth={2.6} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------------------------------------------------------- Vue 2 : livraison */

function VueLivraison({
  coord,
  setCoord,
  onContinuer,
}: {
  coord: Coordonnees;
  setCoord: React.Dispatch<React.SetStateAction<Coordonnees>>;
  onContinuer: () => void;
}) {
  const lignes = usePanier((e) => e.lignes);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const formulaire = useRef<HTMLFormElement>(null);
  const st = sousTotal(lignes);
  const livraison = fraisLivraison(coord.quartier);

  const maj =
    (champ: keyof Coordonnees) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setCoord((c) => ({ ...c, [champ]: e.target.value }));
      if (erreurs[champ]) setErreurs((x) => ({ ...x, [champ]: undefined }));
    };

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validerLivraison(coord);
    setErreurs(err);
    const premier = (Object.keys(err) as (keyof Coordonnees)[])[0];
    if (premier) {
      formulaire.current?.querySelector<HTMLElement>(`[name="${premier}"]`)?.focus();
      return;
    }
    onContinuer();
  };

  return (
    <form ref={formulaire} onSubmit={soumettre} noValidate className="flex min-h-full flex-col">
      <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
        <Champ label="Nom" erreur={erreurs.nom} id="nom">
          <input
            name="nom"
            id="nom"
            autoComplete="name"
            value={coord.nom}
            onChange={maj("nom")}
            className={CHAMP}
            aria-invalid={!!erreurs.nom}
            aria-describedby={erreurs.nom ? "nom-erreur" : undefined}
          />
        </Champ>
        <Champ label="Téléphone" erreur={erreurs.telephone} id="telephone" aide="9 chiffres, ex. 77 123 45 67">
          <input
            name="telephone"
            id="telephone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={coord.telephone}
            onChange={maj("telephone")}
            className={CHAMP}
            aria-invalid={!!erreurs.telephone}
            aria-describedby={erreurs.telephone ? "telephone-erreur" : "telephone-aide"}
          />
        </Champ>
        <Champ label="Quartier" erreur={erreurs.quartier} id="quartier">
          {/* Flèche maison : celle du navigateur est collée au bord droit */}
          <div className="relative">
            <select
              name="quartier"
              id="quartier"
              value={coord.quartier}
              onChange={maj("quartier")}
              className={`${CHAMP} appearance-none pr-12`}
              aria-invalid={!!erreurs.quartier}
              aria-describedby={erreurs.quartier ? "quartier-erreur" : undefined}
            >
              <option value="">Choisir…</option>
              {ZONES.map((z) => (
                <option key={z.nom} value={z.nom}>
                  {z.nom} · livraison {prixF(z.frais)}
                </option>
              ))}
            </select>
            <IconeChevron className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-charbon/60" />
          </div>
        </Champ>
        <Champ label="Adresse ou point de repère" id="adresse" facultatif>
          <input
            name="adresse"
            id="adresse"
            autoComplete="street-address"
            value={coord.adresse}
            onChange={maj("adresse")}
            placeholder="Ex. : en face de la pharmacie"
            className={CHAMP}
          />
        </Champ>

        <Champ label="Remarque" id="remarque" facultatif>
          <textarea
            name="remarque"
            id="remarque"
            rows={2}
            value={coord.remarque}
            onChange={maj("remarque")}
            placeholder="Ex. : sonnez au portail bleu"
            className={`${CHAMP} h-auto resize-none py-3`}
          />
        </Champ>
      </div>

      <div className="marge-securite-bas sticky bottom-0 mt-auto border-t border-charbon/10 bg-white px-5 pt-4">
        <dl className="space-y-1">
          <div className="flex justify-between text-charbon/70">
            <dt>Sous-total</dt>
            <dd className="tabular-nums">{prixF(st)}</dd>
          </div>
          <div className="flex justify-between text-charbon/70">
            <dt>Livraison{coord.quartier ? ` (${coord.quartier})` : ""}</dt>
            <dd className="tabular-nums">
              {coord.quartier ? <PrixAnime apparition={false} montant={livraison} /> : "—"}
            </dd>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <dt className="font-semibold">Total</dt>
            <dd className="text-2xl font-bold">
              <PrixAnime apparition={false} montant={st + livraison} />
            </dd>
          </div>
        </dl>
        <button
          type="submit"
          disabled={!lignes.length}
          className="origine mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-tomate text-lg font-bold text-white [--origine-fond:var(--color-charbon)] disabled:opacity-60"
        >
          Continuer vers le paiement <IconeFleche className="size-5" />
        </button>
      </div>
    </form>
  );
}

const CHAMP =
  "h-12 w-full rounded-xl bg-white px-4 text-base ring-1 ring-charbon/15 ring-inset placeholder:text-charbon/35 focus:ring-2 focus:ring-charbon/40 focus:outline-none aria-invalid:ring-2 aria-invalid:ring-tomate-fonce";

function Champ({
  label,
  id,
  erreur,
  aide,
  facultatif,
  children,
}: {
  label: string;
  id: string;
  erreur?: string;
  aide?: string;
  facultatif?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between font-semibold">
        {label}
        {facultatif && <span className="text-sm font-normal text-charbon/45">Facultatif</span>}
      </label>
      {children}
      {erreur ? (
        <p id={`${id}-erreur`} className="mt-1.5 text-sm font-semibold text-tomate-fonce">
          {erreur}
        </p>
      ) : (
        aide && (
          <p id={`${id}-aide`} className="mt-1.5 text-sm text-charbon/50">
            {aide}
          </p>
        )
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Vue 3 : paiement */

function VuePaiement({
  coord,
  setCoord,
  onModifierLivraison,
  onValider,
}: {
  coord: Coordonnees;
  setCoord: React.Dispatch<React.SetStateAction<Coordonnees>>;
  onModifierLivraison: () => void;
  onValider: (c: Commande) => void;
}) {
  const lignes = usePanier((e) => e.lignes);
  const vider = usePanier((e) => e.vider);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [envoi, setEnvoi] = useState(false);
  const groupe = useRef<HTMLFieldSetElement>(null);
  const st = sousTotal(lignes);
  const livraison = fraisLivraison(coord.quartier);
  const n = nombreArticles(lignes);

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validerPaiement(coord);
    setErreurs(err);
    if (err.paiement) {
      groupe.current?.querySelector<HTMLElement>("input")?.focus();
      return;
    }
    setEnvoi(true);
    // Démo : petit délai pour simuler l'envoi.
    setTimeout(() => {
      const commande = creerCommande(lignes, coord);
      vider();
      onValider(commande);
    }, 700);
  };

  return (
    <form onSubmit={soumettre} noValidate className="flex min-h-full flex-col">
      <div className="flex flex-col gap-6 px-5 pt-5 pb-6">
        {/* Rappel de la livraison */}
        <section className="rounded-2xl bg-white p-4 shadow-douce-sm" aria-label="Livraison">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 text-sm leading-relaxed">
              <p className="text-base font-bold">{coord.nom}</p>
              <p className="text-charbon/70">{coord.telephone}</p>
              <p className="text-charbon/70">
                {coord.quartier}
                {coord.adresse ? ` · ${coord.adresse}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={onModifierLivraison}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-pate"
            >
              Modifier
            </button>
          </div>
        </section>

        <fieldset ref={groupe} aria-describedby={erreurs.paiement ? "paiement-erreur" : undefined}>
          <legend className="titre mb-3 text-xl">Comment souhaitez-vous payer ?</legend>
          <div className="flex flex-col gap-2">
            {CONFIG.paiements.map((m) => {
              const actif = coord.paiement === m;
              return (
                <label
                  key={m}
                  className={`flex h-14 cursor-pointer items-center gap-3 rounded-2xl px-4 font-bold transition-colors has-focus-visible:outline-3 has-focus-visible:outline-croute ${
                    actif ? "bg-charbon text-white" : "bg-white ring-1 ring-charbon/10 ring-inset hover:ring-charbon/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paiement"
                    value={m}
                    checked={actif}
                    onChange={(e) => {
                      setCoord((c) => ({ ...c, paiement: e.target.value }));
                      setErreurs({});
                    }}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`grid size-5 shrink-0 place-items-center rounded-full ${actif ? "bg-croute" : "ring-1 ring-charbon/25 ring-inset"}`}
                  >
                    {actif && <span className="size-2 rounded-full bg-charbon" />}
                  </span>
                  <LogoPaiement moyen={m} />
                  <span>
                    {m}
                    {m === "Espèces" && (
                      <span className={`ml-1.5 font-semibold ${actif ? "text-white/65" : "text-charbon/50"}`}>
                        (À la livraison)
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          {erreurs.paiement && (
            <p id="paiement-erreur" className="mt-2 text-sm font-semibold text-tomate-fonce">
              {erreurs.paiement}
            </p>
          )}
        </fieldset>
      </div>

      <div className="marge-securite-bas sticky bottom-0 mt-auto border-t border-charbon/10 bg-white px-5 pt-4">
        <dl className="space-y-1">
          <div className="flex justify-between text-charbon/70">
            <dt>
              Sous-total · {n} article{n > 1 ? "s" : ""}
            </dt>
            <dd className="tabular-nums">{prixF(st)}</dd>
          </div>
          <div className="flex justify-between text-charbon/70">
            <dt>Livraison ({coord.quartier})</dt>
            <dd className="tabular-nums">{prixF(livraison)}</dd>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <dt className="font-semibold">Total à payer</dt>
            <dd className="text-2xl font-bold">
              <PrixAnime apparition={false} montant={st + livraison} />
            </dd>
          </div>
        </dl>
        <button
          type="submit"
          disabled={envoi || !lignes.length}
          className="origine mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-tomate text-lg font-bold text-white [--origine-fond:var(--color-charbon)] disabled:opacity-60"
        >
          {envoi ? "Envoi en cours…" : "Valider la commande"}
        </button>
      </div>
    </form>
  );
}

/** Logo du moyen de paiement : Wave et Orange Money en image, espèces avec l'icône du portefeuille. */
const LOGOS_PAIEMENT: Record<string, string> = {
  Wave: "/images/paiement/wave.png",
  "Orange Money": "/images/paiement/orange-money.png",
};

function LogoPaiement({ moyen }: { moyen: string }) {
  const src = LOGOS_PAIEMENT[moyen];
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-charbon/10"
    >
      {src ? (
        <Image src={src} alt="" width={36} height={36} className="size-full object-cover" />
      ) : (
        <IconePaiement className="size-5 text-charbon" />
      )}
    </span>
  );
}

/* ---------------------------------------------------------------- Vue 4 : confirmation */

function VueConfirmation({ commande: c, onFermer }: { commande: Commande; onFermer: () => void }) {
  const scope = useRef<HTMLDivElement>(null);

  // Coche de validation : le cercle apparaît avec un rebond, la coche se dessine, une onde s'élargit,
  // puis le texte et le récapitulatif arrivent en fondu.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const trait = scope.current!.querySelector<SVGPathElement>("[data-coche-trait]")!;
      const longueur = trait.getTotalLength();
      gsap
        .timeline({ delay: 0.15 })
        .fromTo(
          "[data-coche-cercle]",
          { scale: 0, rotation: -45 },
          { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.2)" },
        )
        .fromTo(
          trait,
          { strokeDasharray: longueur, strokeDashoffset: longueur },
          { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" },
          0.35,
        )
        .fromTo(
          "[data-coche-onde]",
          { scale: 1, autoAlpha: 0.5 },
          { scale: 1.9, autoAlpha: 0, duration: 0.9, ease: "power2.out" },
          0.45,
        )
        .fromTo(
          "[data-conf-fondu]",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" },
          0.55,
        );
    },
    { scope },
  );

  return (
    <div ref={scope} className="px-5 py-8">
      <div className="flex flex-col items-center text-center">
        <span className="relative grid size-20 place-items-center" role="img" aria-label="Commande validée">
          <span
            data-coche-onde
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-basilic-fonce opacity-0"
          />
          <span
            data-coche-cercle
            className="relative grid size-20 place-items-center rounded-full bg-basilic-fonce text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-10"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path data-coche-trait d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
        </span>
        <p data-conf-fondu className="titre mt-5 text-3xl">
          Commande reçue
        </p>
        <p data-conf-fondu className="mt-2 text-charbon/70">
          Merci {c.coordonnees.nom.split(" ")[0]} ! Le livreur vous appelle au{" "}
          {c.coordonnees.telephone.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4")} pour confirmer le délai de
          livraison.
        </p>
        <p data-conf-fondu className="mt-4 rounded-full bg-white px-4 py-1.5 font-bold shadow-douce-sm">
          N° {c.numero}
        </p>
      </div>

      <div data-conf-fondu className="mt-8 rounded-2xl bg-white p-4 shadow-douce-sm">
        <ul className="divide-y divide-charbon/8">
          {c.lignes.map((l, i) => (
            <li key={i} className="flex justify-between gap-3 py-2.5 first:pt-0">
              <div className="min-w-0">
                <p className="font-semibold">
                  {l.qte} × {l.nom}
                  {l.option ? ` (${l.option})` : ""}
                </p>
                {l.details.length > 0 && (
                  <p className="text-sm text-charbon/60">{l.details.map((d) => d.valeur).join(" · ")}</p>
                )}
              </div>
              <span className="shrink-0 font-semibold tabular-nums">{prixF(l.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-charbon/10 pt-3">
          <div className="flex justify-between text-charbon/70">
            <dt>Sous-total</dt>
            <dd>{prixF(c.sousTotal)}</dd>
          </div>
          <div className="flex justify-between text-charbon/70">
            <dt>Livraison ({c.coordonnees.quartier})</dt>
            <dd>{prixF(c.livraison)}</dd>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <dt>Total</dt>
            <dd>{prixF(c.total)}</dd>
          </div>
        </dl>
        <p className="mt-3 border-t border-charbon/10 pt-3 text-sm text-charbon/70">
          Paiement : <span className="font-semibold text-charbon">{c.coordonnees.paiement}</span>
          {c.coordonnees.adresse && (
            <>
              {" "}
              · Adresse : <span className="font-semibold text-charbon">{c.coordonnees.adresse}</span>
            </>
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={onFermer}
        className="origine mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-charbon text-lg font-bold text-white [--origine-fond:var(--color-tomate)]"
      >
        Retour au menu
      </button>
      <p className="mt-4 text-center text-xs text-charbon/45">
        Démonstration : aucune commande n&apos;est réellement envoyée.
      </p>
    </div>
  );
}
