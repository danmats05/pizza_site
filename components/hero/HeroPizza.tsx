// Grande pizza du hero : la vraie photo dans un <svg>, découpée en 8 parts par des clipPath en secteur.
// Chaque part réutilise la même image (<use>). Une seule part (PART_DETACHEE) est animée vers l'extérieur,
// sur l'axe de son angle médian. Les animations sont pilotées par Hero.tsx via les attributs data-*.

const PARTS = 8;
const C = 500; // centre (l'image fait 1000 × 1000)
const R = 520; // rayon des secteurs, un peu plus grand que la pizza pour ne rien rogner
export const PART_DETACHEE = 2;

const rad = (deg: number) => (deg * Math.PI) / 180;
const angleDebut = (i: number) => -90 + (360 / PARTS) * i;
/** Angle médian d'une part, en degrés (0 = vers la droite, sens horaire). */
export const angleMedian = (i: number) => angleDebut(i) + 360 / PARTS / 2;

/** Secteur de la part `i` ; `marge` (en degrés) l'élargit de chaque côté. */
function secteur(i: number, marge = 0) {
  const a0 = rad(angleDebut(i) - marge);
  const a1 = rad(angleDebut(i + 1) + marge);
  const p = (a: number) => `${(C + R * Math.cos(a)).toFixed(2)},${(C + R * Math.sin(a)).toFixed(2)}`;
  return `M${C},${C} L${p(a0)} A${R},${R} 0 0,1 ${p(a1)} Z`;
}

/** Tout le disque sauf la part détachée, en un seul tracé (donc sans couture interne). */
function fond() {
  const a0 = rad(angleDebut(PART_DETACHEE + 1));
  const a1 = rad(angleDebut(PART_DETACHEE + PARTS));
  const p = (a: number) => `${(C + R * Math.cos(a)).toFixed(2)},${(C + R * Math.sin(a)).toFixed(2)}`;
  return `M${C},${C} L${p(a0)} A${R},${R} 0 1,1 ${p(a1)} Z`;
}

export default function HeroPizza({ src, alt }: { src: string; alt: string }) {
  return (
    <svg viewBox="-80 -80 1160 1160" className="size-full overflow-visible" role="img" aria-label={alt}>
      <defs>
        <image id="pizza-photo" href={src} width="1000" height="1000" />
        {Array.from({ length: PARTS }, (_, i) => (
          <clipPath key={i} id={`part-${i}`}>
            <path d={secteur(i)} />
          </clipPath>
        ))}
        <clipPath id="pizza-fond">
          <path d={fond()} />
        </clipPath>
        <clipPath id="part-detachee-large">
          <path d={secteur(PART_DETACHEE, 0.6)} />
        </clipPath>
      </defs>

      <g data-pizza-tourne>
        {/* Photo d'un seul tenant sous les parts : bouche les fines coutures d'anticrénelage entre secteurs */}
        <use href="#pizza-photo" clipPath="url(#pizza-fond)" />
        {Array.from({ length: PARTS }, (_, i) => (
          <g key={i} data-part={i === PART_DETACHEE ? "detachee" : undefined}>
            {/* Part détachée à peine élargie dessous : couvre ses deux coutures avec le fond (pixels identiques au repos) */}
            {i === PART_DETACHEE && <use href="#pizza-photo" clipPath="url(#part-detachee-large)" />}
            <use href="#pizza-photo" clipPath={`url(#part-${i})`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
