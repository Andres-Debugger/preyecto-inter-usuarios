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
        cream: {
          50: "#faf8f5",
          100: "#f5f0ea",
          200: "#ede4d8",
          300: "#e0d3c1",
          400: "#d4c4ab",
          500: "#c9b696",
          600: "#b89e78",
          700: "#a0825e",
          800: "#856b4e",
          900: "#6d5740",
        },
        charcoal: {
          50: "#f6f5f4",
          100: "#e8e6e3",
          200: "#d1cdc8",
          300: "#b5afa7",
          400: "#988e84",
          500: "#84786c",
          600: "#6e635a",
          700: "#5a514a",
          800: "#4d4540",
          900: "#433d39",
          950: "#2a2522",
        },
        gold: {
          50: "#fdf9ef",
          100: "#faf0d3",
          200: "#f4dfa5",
          300: "#edc96d",
          400: "#e6b33f",
          500: "#dfa025",
          600: "#c77e1b",
          700: "#a65c18",
          800: "#87491b",
          900: "#6f3c19",
        },
      },
      fontFamily: {
        serif: [
          "Playfair Display",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      letterSpacing: {
        ultra: "0.25em",
        super: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
