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
      // Font Families
      fontFamily: {
        sans: ["Geist", "Inter", "sans-serif"],
      },

      // Typography Scale
      fontSize: {},

      // Color System
      colors: {
        // Base colors
        card: "#1b1c2e",
        tableHeader: "252537",
        base: "#FFFFFF",
        background: "#0d0e21",
        foreground: "#FFFFFF",
        primary: {
          25: "#FCFBF6",
          50: "#FFFFE7",
          100: "#FEFFC1",
          200: "#FEDF89",
          300: "#FEC84B",
          400: "#FDB122",
          500: "#FEAA01",
          600: "#DB6904",
          700: "#B64707",
          800: "#94370C",
          900: "#792E0E",
          950: "#461502",
          DEFAULT: "#FEAA01",
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

      // Background gradients
      backgroundImage: {
        "gradient-brand": "linear-gradient(62deg, rgb(255,255,255) 0%, #FEAA01 100%)",
        "gradient-bars": "linear-gradient(0deg,rgba(255,75,198,0) 0%, #2E2E2E 10%,rgba(255,75,198,0) 70%)",
      },
    },
  },

  darkMode: ["class", "class"],

  plugins: [
    heroui(),
    require("tailwindcss-animate"),

    // Custom utilities and components
    function ({ addBase, addComponents, addUtilities }) {
      // Responsive breakpoints
      addBase({
        "@media (min-width: 768px)": {
          ":root": {
            "--dynamic-margin-bottom": "28px",
            "--hero-container-top": "28%",
            "--hero-container-right": "-3%",
            "--main-content-left": "10px",
            "--main-content-top": "50px",
          },
        },
        "@media (min-width: 964px)": {
          ":root": {
            "--hero-bars-width": "350px",
            "--hero-bars-height": "500px",
            "--hero-bar-width": "100px",
            "--hero-bar-gap": "8px",
            "--satellite-bottom": "0",
            "--satellite-left": "0",
            "--hero-container-top": "24%",
            "--hero-container-right": "-3%",
            "--main-content-left": "10px",
            "--main-content-top": "50px",
            "--dynamic-margin-bottom": "34px",
          },
        },
        "@media (min-width: 1024px)": {
          ":root": {
            "--dynamic-margin-bottom": "40px",
            "--hero-container-right": "-3%",
            "--main-content-left": "40px",
            "--main-content-top": "100px",
          },
        },
        "@media (min-width: 1260px)": {
          ":root": {
            "--dynamic-margin-bottom": "40px",
            "--hero-container-right": "10%",
            "--main-content-left": "100px",
            "--main-content-top": "200px",
          },
        },
      });

      // Component utilities
      addComponents({
        // Text gradients
        ".text-gradient-brand": {
          "background": "linear-gradient(62deg, rgb(255,255,255) 0%, #FEAA01 100%)",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },
        ".text-gradient-brand-mobile": {
          "background": "linear-gradient(62deg, rgb(255,255,255) 0%, #FEAA01 100%)",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },

        // Layout utilities
        ".hero-container": {
          width: "var(--hero-container-width)",
          height: "var(--hero-container-height)",
          right: "var(--hero-container-right)",
          top: "var(--hero-container-top)",
        },
        ".hero-image": {
          width: "var(--hero-image-size)",
          height: "var(--hero-image-size)",
        },
        ".hero-bar": {
          width: "var(--hero-bar-width)",
        },
        ".satellite-position": {
          bottom: "0px",
          left: "var(--satellite-left)",
        },
        ".main-content-position": {
          left: "var(--main-content-left)",
          top: "var(--main-content-top)",
        },
        ".dynamic-margin-bottom": {
          "margin-bottom": "var(--dynamic-margin-bottom)",
        },

        // Background gradients
        // '.bg-gradient-bar': {
        //   'background': 'linear-gradient(180deg, #FEAA0100 12%, #FEAA0110 100%)',
        // },
        // '.bg-gradient-bar-tab': {
        //   'background': 'linear-gradient(180deg, #FEAA0100 0%, #FEAA0110 100%)',
        // },
      });
    },
  ],
};

module.exports = config;
