/**
 * Version des photos produits. À augmenter à chaque fois que les images de public/images/ sont régénérées
 * (détourage, remplacement) : l'adresse change, donc tous les navigateurs reprennent les nouvelles versions
 * au lieu de garder les anciennes en cache (autorisé par `images.localPatterns` dans next.config.ts).
 */
export const VERSION_IMAGES = "4";

/** Adresse d'une photo produit avec sa version (ex. /images/pizza/la-reine.webp?v=2). */
export function photo(src: string): string;
export function photo(src: string | null): string | null;
export function photo(src: string | null) {
  return src ? `${src}?v=${VERSION_IMAGES}` : null;
}
