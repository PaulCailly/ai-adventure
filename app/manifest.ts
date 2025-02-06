import { type MetadataRoute } from "next";

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: "Taverne",
    short_name: "Taverne",
    description: "Là où l'aventure commence",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
