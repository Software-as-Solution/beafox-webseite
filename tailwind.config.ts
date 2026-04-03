import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // BACKGROUND
        backgroundLight: "#1D1B1B",
        background: "#161616",

        // PRIMARY
        primaryRed: "#fb3b1e",
        primaryBlue: "#2a9df4",
        primaryGreen: "#52D81D",
        primaryWhite: "#FFFFFF",
        primaryYellow: "#EFEF16",

        // DARK
        darkOrange: "#b16518",
        darkerGray: "#494949",

        // RANGLISTE
        gold: "#FFD700",
        bronze: "#CD7F32",
        diamond: "#7A6BBA",
        platinum: "#40AD9F",

        // NEUE FARBEN
        lightGray: "#535353",
        primaryOrange: "#eb8a26",
        primaryGray: "#AFAFAF",
        darkGray: "#272727",
        darkWhite: "#D8DADC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        'scroll-left': 'scroll-left 25s linear infinite',
        'scroll-left-slow': 'scroll-left-slow 45s linear infinite',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.3333%)' },
        },
        'scroll-left-slow': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.3333%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
