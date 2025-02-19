import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#a7263c",
        brand: {
          100: "#f4d7dc",
          200: "#e8b0b9",
          300: "#d38895",
          400: "#c06172",
          500: "#a7263c", // sua cor base
          600: "#861f30",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
