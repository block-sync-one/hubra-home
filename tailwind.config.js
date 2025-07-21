import {heroui} from "@heroui/theme"

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
        sans: [
          'Inter',
        ],
        mono: [
          'Geist'
        ]
      },

      // Typography Scale
      fontSize: {

      },

      // Color System
      colors: {
        // Base colors
        'card': '#121323',
        primary: {
          25:"#FCFBF6",
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
        'gradient-brand-reverse': 'linear-gradient(62deg, #FEAA01 0%, rgb(255,255,255) 100%)',
        'gradient-pink': 'linear-gradient(90deg, #FEAA01 0%, #FFB6E6 100%)',
       
        'gradient-glow': 'radial-gradient(circle, rgba(255, 105, 210, 0.3) 0%, rgba(255,79,203,0) 70%)',
        'gradient-bars': 'linear-gradient(0deg,rgba(255,75,198,0) 0%, #2E2E2E 10%,rgba(255,75,198,0) 70%)',
        'gradient-hero': 'linear-gradient(180deg, #2E2E2E 0%,rgba(235,66,181,0) 85%)',
        'gradient-dots': 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 1px, transparent 1px), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 1px, transparent 1px), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06) 1px, transparent 1px)'
      },


    }
  },

  darkMode: ["class", 'class'],
  
  plugins: [
    heroui(), 
    require("tailwindcss-animate"),
    
    // Custom utilities and components
    function({ addBase, addComponents, addUtilities }) {

      // Responsive breakpoints
      addBase({
  

        '@media (min-width: 768px)': {
          ':root': {
            '--dynamic-margin-bottom': '28px',
            '--hero-container-top': '28%',
            '--hero-container-right': '-3%',
            '--main-content-text-size': '52px',
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
            '--main-content-text-size': '52px',
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
            '--main-content-text-size': '52px'
          }
        },
        '@media (min-width: 1260px)': {
          ':root': {
            '--dynamic-margin-bottom': '40px',
            '--hero-container-right': '10%',
            '--main-content-left': '100px',
            '--main-content-top': '200px',
            '--main-content-text-size': '52px'
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
          'background': 'linear-gradient(62deg, rgb(255,255,255) 0%, #E379C1 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text'
        },
        '.text-gradient-brand-reverse': {
          'background': 'linear-gradient(62deg, #FEAA01 0%, rgb(255,255,255) 100%)',
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
        '.hero-gradient': {
          'width': 'var(--hero-gradient-width)'
        },
        '.hero-bars': {
          'width': 'var(--hero-bars-width)',
          'height': 'var(--hero-bars-height)',
          'gap': 'var(--hero-bar-gap)'
        },
        '.hero-bar': {
          'width': 'var(--hero-bar-width)'
        },
        '.hero-motion': {
          'top': 'var(--hero-motion-top)',
          'left': 'var(--hero-motion-left)'
        },
        '.satellite-position': {
          'bottom': 'var(--satellite-bottom)',
          'left': 'var(--satellite-left)'
        },
        '.main-content-position': {
          'left': 'var(--main-content-left)',
          'top': 'var(--main-content-top)'
        },
        '.main-content-text': {
          'font-size': 'var(--main-content-text-size)'
        },
        '.dynamic-margin-bottom': {
          'margin-bottom': 'var(--dynamic-margin-bottom)'
        },

        // Background gradients
        '.glow-orb-light': {
          'background': 'radial-gradient(circle,rgb(248, 220, 239) 0%, #E340AF 100%)'
        },
        '.glow-orb-medium': {
          'background': 'radial-gradient(circle, #F37DCD 0%, #E340AF 100%)'
        },
        '.glow-orb-dark': {
          'background': 'radial-gradient(circle, #E02BA6 0%, #FEAA01 50%, #8A2D6B 100%)'
        },
        '.glow-orb-glow-light': {
          'background': 'rgba(255, 145, 220, 0.5)'
        },
        '.glow-orb-glow-medium': {
          'background': 'rgba(243, 125, 205, 0.3)'
        },
        '.glow-orb-glow-dark': {
          'background': 'rgba(224, 43, 166, 0.2)'
        },
        '.bg-gradient-hero': {
          'background': 'linear-gradient(180deg,rgba(235,66,181,1) 0%,rgba(235,66,181,0) 85%)'
        },
        '.bg-gradient-bars': {
          'background': 'linear-gradient(0deg,rgba(255,75,198,0) 0%,rgba(184,71,148,1) 10%,rgba(255,75,198,0) 70%)'
        },
        '.bg-gradient-glow': {
          'background': 'radial-gradient(circle, rgba(255, 105, 210, 0.3) 0%, rgba(255,79,203,0) 70%)'
        },
        '.bg-gradient-dots': {
          'background': 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 1px, transparent 1px), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 1px, transparent 1px), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06) 1px, transparent 1px)'
        },

        // SVG gradients
        '.svg-gradient-brand': {
          'stop-color': '#FF68CF'
        },
        '.svg-gradient-accent': {
          'stop-color': '#FF4FCB'
        },
        '.svg-gradient-primary': {
          'stop-color': '#FEAA01'
        },
        '.svg-gradient-pink-soft': {
          'stop-color': '#F07DCB'
        },




       

      })
    }
  ]
}

module.exports = config;