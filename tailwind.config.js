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
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ],
        geist: [
          'Geist',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ],
        mono: [
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ]
      },

      // Typography Scale
      fontSize: {
        'hero-title': ['32px', {
          lineHeight: '1.1',
          letterSpacing: '-1.04px',
          fontWeight: '600'
        }],
        'hero-title-md': ['52px', {
          lineHeight: '54.6px',
          letterSpacing: '-1.04px',
          fontWeight: '600'
        }],
        'section-title': ['32px', {
          lineHeight: '33.6px',
          letterSpacing: '-0.64px',
          fontWeight: '600'
        }],
        'card-title': ['20px', {
          lineHeight: '33.6px',
          letterSpacing: '0',
          fontWeight: '600'
        }],
        'card-title-compact': ['20px', {
          lineHeight: '20px',
          letterSpacing: '0',
          fontWeight: '600'
        }],
        'body-large': ['18px', {
          lineHeight: '26px',
          letterSpacing: '0',
          fontWeight: '400'
        }],
        'body': ['16px', {
          lineHeight: '22.4px',
          letterSpacing: '0',
          fontWeight: '400'
        }],
        'body-compact': ['16px', {
          lineHeight: '16px',
          letterSpacing: '0',
          fontWeight: '400'
        }],
        'body-small': ['16px', {
          lineHeight: '19.4px',
          letterSpacing: '0',
          fontWeight: '400'
        }],
        'label': ['16px', {
          lineHeight: '19.4px',
          letterSpacing: '0',
          fontWeight: '500'
        }],
        'caption': ['14px', {
          lineHeight: 'normal',
          letterSpacing: '0',
          fontWeight: '500'
        }],
        'stats': ['24px', {
          lineHeight: 'normal',
          letterSpacing: '0',
          fontWeight: '500'
        }]
      },

      // Color System
      colors: {
        // Base colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // Chart colors
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },

        // Brand colors
        brand: {
          primary: '#FEAA01',
          secondary: '#FF68CF',
          accent: '#FF4FCB',
          pink: {
            light: '#F37DCD',
            medium: '#E340AF',
            dark: '#E02BA6',
            darker: '#8A2D6B',
            glow: '#FFB6E6',
            soft: '#F07DCB'
          },
          gradient: {
            start: '#FF68CF',
            end: '#FEAA01'
          }
        },

        // UI colors
        ui: {
          text: {
            primary: '#787b91',
            secondary: '#797B92',
            muted: '#5D5664',
            accent: '#6E6E7A',
            navbar: '#797B92'
          },
          bg: {
            dark: '#121323',
            darker: '#151626',
            card: '#191a2c',
            input: '#1C1D2D'
          },
          border: {
            light: '#ffffff1a',
            transparent: '#ffffff14'
          }
        },

        // Animation colors
        animation: {
          cyan: '#44d2f6',
          gold: '#D2B319',
          orange: '#fe6633',
          purple: '#9545fd',
          blue: '#3527ca',
          green: '#31e585',
          black: '#000000'
        }
      },

      // Animations
      animation: {
        'spin-slow': 'spin 8s linear infinite'
      },

      // Border radius
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },

      // Responsive spacing variables
      spacing: {
        'hero-container-width': 'var(--hero-container-width)',
        'hero-container-height': 'var(--hero-container-height)',
        'hero-image-size': 'var(--hero-image-size)',
        'hero-gradient-width': 'var(--hero-gradient-width)',
        'hero-bars-width': 'var(--hero-bars-width)',
        'hero-bars-height': 'var(--hero-bars-height)',
        'hero-bar-width': 'var(--hero-bar-width)',
        'hero-bar-gap': 'var(--hero-bar-gap)',
        'hero-motion-top': 'var(--hero-motion-top)',
        'hero-motion-left': 'var(--hero-motion-left)',
        'satellite-bottom': 'var(--satellite-bottom)',
        'satellite-left': 'var(--satellite-left)',
        'hero-container-top': 'var(--hero-container-top)',
        'hero-container-right': 'var(--hero-container-right)',
        'main-content-left': 'var(--main-content-left)',
        'main-content-top': 'var(--main-content-top)',
        'main-content-text-size': 'var(--main-content-text-size)',
        'dynamic-margin-bottom': 'var(--dynamic-margin-bottom)'
      },

      // Background gradients
      backgroundImage: {
        'gradient-brand': 'linear-gradient(62deg, rgb(255,255,255) 0%, #FEAA01 100%)',
        'gradient-brand-reverse': 'linear-gradient(62deg, #FEAA01 0%, rgb(255,255,255) 100%)',
        'gradient-pink': 'linear-gradient(90deg, #FEAA01 0%, #FFB6E6 100%)',
        'gradient-orb-light': 'radial-gradient(circle,rgb(248, 220, 239) 0%, #E340AF 100%)',
        'gradient-orb-medium': 'radial-gradient(circle, #F37DCD 0%, #E340AF 100%)',
        'gradient-orb-dark': 'radial-gradient(circle, #E02BA6 0%, #FEAA01 50%, #8A2D6B 100%)',
        'gradient-glow': 'radial-gradient(circle, rgba(255, 105, 210, 0.3) 0%, rgba(255,79,203,0) 70%)',
        'gradient-bars': 'linear-gradient(0deg,rgba(255,75,198,0) 0%, #2E2E2E 10%,rgba(255,75,198,0) 70%)',
        'gradient-hero': 'linear-gradient(180deg, #2E2E2E 0%,rgba(235,66,181,0) 85%)',
        'gradient-dots': 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 1px, transparent 1px), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 1px, transparent 1px), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06) 1px, transparent 1px)'
      },

      // Box shadows
      boxShadow: {
        'brand-glow': '0 0 40px rgba(255,104,207,1), 0 0 60px rgba(255,104,207,0.4)',
        'brand-glow-small': '0 0 24px 8px #FF4FCB',
        'brand-glow-medium': '0 0 48px 16px #FF4FCB',
        'brand-glow-large': '0 0 24px 8px #FF4FCB'
      },

      // Filters
      filter: {
        'brand-drop-shadow': 'drop-shadow(0 0 8px #FEAA01)'
      }
    }
  },

  darkMode: ["class", 'class'],
  
  plugins: [
    heroui(), 
    require("tailwindcss-animate"),
    
    // Custom utilities and components
    function({ addBase, addComponents, addUtilities }) {
      // CSS Variables
      addBase({
        ':root': {
          // Base theme variables
          '--background': '0 0% 100%',
          '--foreground': '240 10% 3.9%',
          '--card': '0 0% 100%',
          '--card-foreground': '240 10% 3.9%',
          '--popover': '0 0% 100%',
          '--popover-foreground': '240 10% 3.9%',
          '--primary': '240 5.9% 10%',
          '--primary-foreground': '0 0% 98%',
          '--secondary': '240 4.8% 95.9%',
          '--secondary-foreground': '240 5.9% 10%',
          '--muted': '240 4.8% 95.9%',
          '--muted-foreground': '240 3.8% 46.1%',
          '--accent': '240 4.8% 95.9%',
          '--accent-foreground': '240 5.9% 10%',
          '--destructive': '0 84.2% 60.2%',
          '--destructive-foreground': '0 0% 98%',
          '--border': '240 5.9% 90%',
          '--input': '240 5.9% 90%',
          '--ring': '240 10% 3.9%',
          '--chart-1': '12 76% 61%',
          '--chart-2': '173 58% 39%',
          '--chart-3': '197 37% 24%',
          '--chart-4': '43 74% 66%',
          '--chart-5': '27 87% 67%',
          '--radius': '0.5rem',
          
          // Responsive variables
          '--hero-container-width': '400px',
          '--hero-container-height': '507px',
          '--hero-image-size': '240px',
          '--hero-motion-top': '30px',
          '--hero-motion-left': '8px',
          '--hero-gradient-width': '260px',
          '--hero-bars-width': '210px',
          '--hero-bars-height': '380px',
          '--hero-bar-width': '55px',
          '--hero-bar-gap': '4px',
          '--satellite-bottom': '-15px',
          '--satellite-left': '-40%',
          '--hero-container-top': '25%',
          '--hero-container-right': '4%',
          '--main-content-left': '10px',
          '--main-content-top': '30px',
          '--main-content-text-size': '32px',
          '--dynamic-margin-bottom': '16px'
        },
        
        '.dark': {
          '--background': '240 10% 3.9%',
          '--foreground': '0 0% 98%',
          '--card': '240 10% 3.9%',
          '--card-foreground': '0 0% 98%',
          '--popover': '240 10% 3.9%',
          '--popover-foreground': '0 0% 98%',
          '--primary': '0 0% 98%',
          '--primary-foreground': '240 5.9% 10%',
          '--secondary': '240 3.7% 15.9%',
          '--secondary-foreground': '0 0% 98%',
          '--muted': '240 3.7% 15.9%',
          '--muted-foreground': '240 5% 64.9%',
          '--accent': '240 3.7% 15.9%',
          '--accent-foreground': '0 0% 98%',
          '--destructive': '0 62.8% 30.6%',
          '--destructive-foreground': '0 0% 98%',
          '--border': '240 3.7% 15.9%',
          '--input': '240 3.7% 15.9%',
          '--ring': '240 4.9% 83.9%',
          '--chart-1': '220 70% 50%',
          '--chart-2': '160 60% 45%',
          '--chart-3': '30 80% 55%',
          '--chart-4': '280 65% 60%',
          '--chart-5': '340 75% 55%'
        },
        
        '*': {
          '@apply border-border': {}
        },
        
        'body': {
          '@apply bg-background text-foreground': {}
        }
      })

      // Responsive breakpoints
      addBase({
        '@media (min-width: 500px)': {
          ':root': {
            '--satellite-bottom': '-15px',
            '--satellite-left': '-10px',
            '--hero-container-top': '25%',
            '--hero-container-right': '10%'
          }
        },
        '@media (min-width: 680px)': {
          ':root': {
            '--satellite-bottom': '-15px',
            '--satellite-left': '0px',
            '--hero-container-top': '24%',
            '--hero-container-right': '18%'
          }
        },
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
            '--hero-container-width': '487px',
            '--hero-container-height': '507px',
            '--hero-image-size': '350px',
            '--hero-motion-top': '25px',
            '--hero-motion-left': '-45px',
            '--hero-gradient-width': '370px',
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

        // Animation colors
        '.animation-cyan': { 'color': '#44d2f6' },
        '.animation-gold': { 'color': '#D2B319' },
        '.animation-orange': { 'color': '#fe6633' },
        '.animation-purple': { 'color': '#9545fd' },
        '.animation-blue': { 'color': '#3527ca' },
        '.animation-green': { 'color': '#31e585' },
        '.animation-black': { 'color': '#000000' },

        // UI colors
        '.text-ui-primary': { 'color': '#787b91' },
        '.text-ui-secondary': { 'color': '#797B92' },
        '.text-ui-muted': { 'color': '#5D5664' },
        '.text-ui-accent': { 'color': '#6E6E7A' },
        '.bg-ui-dark': { 'background-color': '#121323' },
        '.bg-ui-darker': { 'background-color': '#151626' },
        '.bg-ui-card': { 'background-color': '#191a2c' },
        '.bg-ui-input': { 'background-color': '#1C1D2D' },
        '.border-ui-light': { 'border-color': '#ffffff1a' },
        '.border-ui-transparent': { 'border-color': '#ffffff14' },

        // Brand colors
        '.text-brand-primary': { 'color': '#FEAA01' },
        '.text-brand-secondary': { 'color': '#FF68CF' },
        '.text-brand-accent': { 'color': '#FF4FCB' },
        '.bg-brand-primary': { 'background-color': '#FEAA01' },
        '.bg-brand-secondary': { 'background-color': '#FF68CF' },
        '.bg-brand-accent': { 'background-color': '#FF4FCB' },
        '.border-brand-primary': { 'border-color': '#FEAA01' },
        '.border-brand-secondary': { 'border-color': '#FF68CF' },
        '.border-brand-accent': { 'border-color': '#FF4FCB' },

        // Brand pink variants
        '.text-brand-pink-light': { 'color': '#F37DCD' },
        '.text-brand-pink-medium': { 'color': '#E340AF' },
        '.text-brand-pink-dark': { 'color': '#E02BA6' },
        '.text-brand-pink-darker': { 'color': '#8A2D6B' },
        '.text-brand-pink-glow': { 'color': '#FFB6E6' },
        '.text-brand-pink-soft': { 'color': '#F07DCB' },
        '.bg-brand-pink-light': { 'background-color': '#F37DCD' },
        '.bg-brand-pink-medium': { 'background-color': '#E340AF' },
        '.bg-brand-pink-dark': { 'background-color': '#E02BA6' },
        '.bg-brand-pink-darker': { 'background-color': '#8A2D6B' },
        '.bg-brand-pink-glow': { 'background-color': '#FFB6E6' },
        '.bg-brand-pink-soft': { 'background-color': '#F07DCB' },

        // Effects
        '.filter-brand-drop-shadow': {
          'filter': 'drop-shadow(0 0 8px #FEAA01)'
        },
        '.shadow-brand-glow': {
          'box-shadow': '0 0 40px rgba(255,104,207,1), 0 0 60px rgba(255,104,207,0.4)'
        },
        '.shadow-brand-glow-small': {
          'box-shadow': '0 0 24px 8px #FF4FCB'
        },
        '.shadow-brand-glow-medium': {
          'box-shadow': '0 0 48px 16px #FF4FCB'
        },
        '.shadow-brand-glow-large': {
          'box-shadow': '0 0 24px 8px #FF4FCB'
        }
      })
    }
  ]
}

module.exports = config;