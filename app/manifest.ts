import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BeAFox - Finanzbildungs-Ökosystem",
    short_name: "BeAFox",
    description:
      "Das erste unabhängige, spielerische Lern-App für Finanzbildung junger Menschen.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff6b35",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
