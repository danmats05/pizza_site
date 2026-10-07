import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      // Photos produits : acceptent un numéro de version quelconque (?v=… , voir lib/images.ts),
      // pour qu'augmenter la version ne demande pas de redémarrer le serveur.
      { pathname: "/images/**" },
      // Toutes les autres images locales, sans paramètre (logo, icônes)
      { pathname: "/**", search: "" },
    ],
  },
};

export default nextConfig;
