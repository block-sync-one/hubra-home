import { heroui } from "@heroui/theme"


/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Font Families
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
      },

      // Typography Scale
      fontSize: {

      },

      // Color System
      colors: {
        // Base colors
        'card': '#121323',
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
      },

      // Background gradients
      backgroundImage: {
        'gradient-brand': 'linear-gradient(62deg, rgb(255,255,255) 0%, #FEAA01 100%)',
        'gradient-bars': 'linear-gradient(0deg,rgba(255,75,198,0) 0%, #2E2E2E 10%,rgba(255,75,198,0) 70%)',
      },
    }
  },

  darkMode: ["class", 'class'],

  plugins: [
    heroui(),
    require("tailwindcss-animate"),

    // Custom utilities and components
    function ({ addBase, addComponents, addUtilities }) {

      // Responsive breakpoints
      addBase({
        '@media (min-width: 768px)': {
          ':root': {
            '--dynamic-margin-bottom': '28px',
            '--hero-container-top': '28%',
            '--hero-container-right': '-3%',
            '--main-content-left': '10px',
            '--main-content-top': '50px'
          }
        },
        '@media (min-width: 964px)': {
          ':root': {
            '--hero-bars-width': '350px',
            '--hero-bars-height': '500px',
            '--hero-bar-width': '100px',
            '--hero-bar-gap': '8px',
            '--satellite-bottom': '0',
            '--satellite-left': '0',
            '--hero-container-top': '24%',
            '--hero-container-right': '-3%',
            '--main-content-left': '10px',
            '--main-content-top': '50px',
            '--dynamic-margin-bottom': '34px'
          }
        },
        '@media (min-width: 1024px)': {
          ':root': {
            '--dynamic-margin-bottom': '40px',
            '--hero-container-right': '-3%',
            '--main-content-left': '40px',
            '--main-content-top': '100px',
          }
        },
        '@media (min-width: 1260px)': {
          ':root': {
            '--dynamic-margin-bottom': '40px',
            '--hero-container-right': '10%',
            '--main-content-left': '100px',
            '--main-content-top': '200px',
          }
        }
      })

      // Component utilities
      addComponents({
        // Text gradients
        '.text-gradient-brand': {
          'background': 'linear-gradient(62deg, rgb(255,255,255) 0%, #FEAA01 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text'
        },
        '.text-gradient-brand-mobile': {
          'background': 'linear-gradient(62deg, rgb(255,255,255) 0%, #FEAA01 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text'
        },

        // Layout utilities
        '.hero-container': {
          'width': 'var(--hero-container-width)',
          'height': 'var(--hero-container-height)',
          'right': 'var(--hero-container-right)',
          'top': 'var(--hero-container-top)'
        },
        '.hero-image': {
          'width': 'var(--hero-image-size)',
          'height': 'var(--hero-image-size)'
        },
        '.hero-bar': {
          'width': 'var(--hero-bar-width)'
        },
        '.satellite-position': {
          'bottom': '0px',
          'left': 'var(--satellite-left)'
        },
        '.main-content-position': {
          'left': 'var(--main-content-left)',
          'top': 'var(--main-content-top)'
        },
        '.dynamic-margin-bottom': {
          'margin-bottom': 'var(--dynamic-margin-bottom)'
        },

        // Background gradients
        // '.bg-gradient-bar': {
        //   'background': 'linear-gradient(180deg, #FEAA0100 12%, #FEAA0110 100%)',
        // },
        // '.bg-gradient-bar-tab': {
        //   'background': 'linear-gradient(180deg, #FEAA0100 0%, #FEAA0110 100%)',
        // },
      })
    }
  ]
}

module.exports = config;