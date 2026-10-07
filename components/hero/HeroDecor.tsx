// Ombres en fond du hero, propres à chaque pizza (fichiers SVG de public/decors/, recolorés par masque CSS).
// - « motifs » : icônes semées un peu partout, tailles et inclinaisons variées ;
// - « panorama » : une image plein écran posée en bas (skyline).

export type Decor = { motifs: string[] } | { panorama: string };

/** Emplacements des motifs (en % de la section) : taille relative, inclinaison, retournement horizontal (miroir).
 * Disposition fixe, d'aspect aléatoire ; le miroir, réparti irrégulièrement, évite que tous les motifs regardent du même côté. */
const EMPLACEMENTS = [
  { x: 4, y: 14, t: 1.3, r: -18, miroir: true },
  { x: 20, y: 62, t: 0.9, r: 24, miroir: false },
  { x: 9, y: 80, t: 1.6, r: 8, miroir: false },
  { x: 30, y: 24, t: 0.7, r: -34, miroir: true },
  { x: 37, y: 84, t: 1.0, r: -12, miroir: true },
  { x: 54, y: 8, t: 0.8, r: 30, miroir: false },
  { x: 63, y: 78, t: 1.4, r: 16, miroir: true },
  { x: 73, y: 30, t: 1.0, r: -26, miroir: false },
  { x: 86, y: 12, t: 1.5, r: 12, miroir: false },
  { x: 92, y: 56, t: 0.85, r: -40, miroir: true },
  { x: 82, y: 86, t: 1.15, r: 34, miroir: false },
  { x: 46, y: 46, t: 0.65, r: -6, miroir: true },
];

const masque = (src: string, position = "center", taille = "contain") => {
  const m = `url("${src}") ${position} / ${taille} no-repeat`;
  return { mask: m, WebkitMask: m };
};

/** Décor d'une diapositive. `couleur` : teinte des ombres ; `opacite` : faible, ce sont des ombres. */
export default function HeroDecor({
  decor,
  couleur,
  opacite,
}: {
  decor: Decor;
  couleur: string;
  opacite: number;
}) {
  return (
    <div
      data-decor
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Opacité sur un enfant : l'animation d'entrée (GSAP) agit sur le parent sans l'écraser */}
      <div className="absolute inset-0" style={{ opacity: opacite }}>
        {"panorama" in decor ? (
          // Pleine largeur, à ses proportions (≈ 2:1) ; sur mobile, hauteur limitée et cadrage centré.
          <div
            className="absolute inset-x-0 bottom-0 h-[42%] md:h-auto md:aspect-[2/1]"
            style={{
              background: couleur,
              ...masque(decor.panorama, "center bottom", "cover"),
            }}
          />
        ) : (
          EMPLACEMENTS.map((e, i) => (
            <div
              key={i}
              data-motif
              className="absolute aspect-square w-[clamp(5.5rem,13vw,12rem)] -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${e.x}%`,
                top: `${e.y}%`,
                // Échelle négative en X = miroir horizontal ; se combine avec rotate et translate (propriétés CSS distinctes)
                scale: `${e.miroir ? -e.t : e.t} ${e.t}`,
                rotate: `${e.r}deg`,
                background: couleur,
                ...masque(decor.motifs[i % decor.motifs.length]),
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
