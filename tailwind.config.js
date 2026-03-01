const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Inter", "sans-serif"],
      },
      colors: {
        card: "#1b1c2e",
        bgPlaceholder: "#565764",
        tableHeader: "252537",
        base: "#FFFFFF",
        background: "#0d0e21",
        foreground: "#FFFFFF",
        primary: {
          25: "#FDF9F0",
          50: "#FFF4E0",
          100: "#FFE9C1",
          200: "#FFD382",
          300: "#FFBD4F",
          400: "#E6A520",
          500: "#DAA520",
          600: "#C4941C",
          700: "#AE8318",
          800: "#987214",
          900: "#826110",
          950: "#55400B",
          DEFAULT: "#DAA520",
          foreground: "#FFFFFF",
        },
        success: {
          950: "#0E1F2E",
          900: "#0E303A",
          800: "#105153",
          700: "#2ED3B7",
          600: "#149585",
          500: "#15B79E",
          400: "#2ED387",
          300: "#5FEDD0",
          200: "#99F6E0",
          100: "#CCFBEF",
          50: "#F0FDF9",
          25: "#F0FDF9",
          DEFAULT: "#2ED387",
          foreground: "#FFFFFF",
        },
        error: {
          950: "#251328",
          900: "#3B172F",
          800: "#6A203E",
          700: "#992B4B",
          600: "#C8345A",
          500: "#F63D68",
          400: "#FD6F8E",
          300: "#FEA3B4",
          200: "#FECCD6",
          100: "#FFE4E8",
          50: "#FFF1F3",
          25: "#FFF1F3",
          DEFAULT: "#FD6F8E",
          foreground: "#FFFFFF",
        },
        gray: {
          1000: "#0D0E21",
          950: "#191A2C",
          900: "#262738",
          850: "#31324A",
          800: "#3D3E4D",
          700: "#565764",
          600: "#6E6E7A",
          500: "#868790",
          400: "#6E6E7A",
          300: "#B7B7BD",
          200: "#CFCFD3",
          100: "#E7E7E9",
          50: "#F3F3F4",
          30: "rgba(255, 255, 255, 0.03)",
          DEFAULT: "#3D3E4D",
          foreground: "#FFFFFF",
        },
      },
      keyframes: {
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(calc(-100% - var(--gap)))" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "marquee": "marquee var(--duration) infinite linear",
        "marquee-reverse": "marquee-reverse var(--duration) infinite linear",
      },
    },
  },

  darkMode: "class",

  plugins: [
    heroui({
      addCommonColors: true,
      defaultTheme: "dark",
    }),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),

    function ({ addComponents }) {
      addComponents({
        ".satellite-position": {
          bottom: "0px",
          left: "0",
        },
      });
    },
  ],
};

module.exports = config;
