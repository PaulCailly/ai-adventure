import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Taverne de l'Union",
    short_name: "La Taverne de l'Union",
    description: "Une aventure unique et immersive",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
  };
}
