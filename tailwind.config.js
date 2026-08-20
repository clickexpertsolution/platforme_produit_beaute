/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: {
          DEFAULT: '20px',
          md: '44px'
        },
        screens: {
          '2xl': '1320px'
        }
      },
      extend: {
        fontFamily: {
          // Handoff : Archivo (UI), Instrument Serif (display), IBM Plex Mono (data/meta)
          sans: ['var(--font-archivo)', 'Archivo', 'Helvetica', 'Arial', 'sans-serif'],
          display: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
          mono: ['var(--font-plex-mono)', 'IBM Plex Mono', 'monospace']
        },
        maxWidth: {
          dz: '1320px'
        },
        boxShadow: {
          // Ombres exactes du handoff
          'dz-card': '0 1px 2px rgba(20,22,26,0.04), 0 10px 30px rgba(20,22,26,0.05)',
          'dz-card-hover': '0 4px 10px rgba(20,22,26,0.06), 0 26px 54px rgba(20,22,26,0.09)',
          'dz-search': '0 1px 2px rgba(20,22,26,0.05), 0 14px 34px rgba(20,22,26,0.07)',
          'dz-header': '0 1px 0 rgba(20,22,26,0.06)',
          // Filets internes : des inset shadows de 1px, jamais des border
          'dz-rule-t': 'inset 0 1px 0 #DFDCD5',
          'dz-rule-b': 'inset 0 -1px 0 #EFEDE9',
          'dz-rule-t-card': 'inset 0 1px 0 #EDEBE6',
          'dz-rule-legal': 'inset 0 1px 0 #E7E4DD',
          'dz-rule-x': 'inset 1px 0 0 #DFDCD5, inset -1px 0 0 #DFDCD5',
          'dz-chip': 'inset 0 0 0 1px #DEDBD4',
          'dz-chip-accent': 'inset 0 0 0 1px #1F4E6B',
          'dz-lang': 'inset 0 -1px 0 #C8C4BB'
        },
        transitionDuration: {
          // .2s chips/liens · .25s boutons · .3s soulèvement de carte
          200: '200ms',
          250: '250ms',
          300: '300ms'
        },
        colors: {
          // --- Palette du handoff (préfixe dz- pour ne pas heurter shadcn) ---
          dz: {
            bg: '#F6F5F2',
            surface: '#FFFFFF',
            'surface-2': '#F4F3F0',
            sand: '#EAE5DB',
            ink: '#14161A',
            text: '#5A5E66',
            'text-2': '#7A7E85',
            'text-3': '#8D8F93',
            'text-4': '#A6A8AC',
            nav: '#4A4E55',
            accent: '#1F4E6B',
            'accent-hover': '#12303F',
            'accent-bg': '#EFF3F5',
            rule: '#DFDCD5',
            'rule-card': '#EFEDE9',
            'rule-card-2': '#EDEBE6',
            chip: '#DEDBD4',
            'sand-text': '#5F5A51',
            'sand-text-2': '#7A7469',
            'sand-eyebrow': '#8A8071',
            'on-dark': '#F6F5F2',
            'on-dark-muted': '#A8A9AD'
          },
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))'
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))'
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))'
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))'
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))'
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))'
          },
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))'
          },
          chart: {
            '1': 'hsl(var(--chart-1))',
            '2': 'hsl(var(--chart-2))',
            '3': 'hsl(var(--chart-3))',
            '4': 'hsl(var(--chart-4))',
            '5': 'hsl(var(--chart-5))'
          },
          sidebar: {
            DEFAULT: 'hsl(var(--sidebar-background))',
            foreground: 'hsl(var(--sidebar-foreground))',
            primary: 'hsl(var(--sidebar-primary))',
            'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
            accent: 'hsl(var(--sidebar-accent))',
            'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
            border: 'hsl(var(--sidebar-border))',
            ring: 'hsl(var(--sidebar-ring))'
          }
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
          // Rayons du handoff
          'dz-brand': '16px',
          'dz-guide': '18px',
          'dz-card': '20px',
          'dz-lead': '22px',
          'dz-cta': '24px',
          'dz-pill': '100px',
          'dz-arch': '8px 8px 200px 200px'
        },
        keyframes: {
          'accordion-down': {
            from: {
              height: '0'
            },
            to: {
              height: 'var(--radix-accordion-content-height)'
            }
          },
          'accordion-up': {
            from: {
              height: 'var(--radix-accordion-content-height)'
            },
            to: {
              height: '0'
            }
          }
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out'
        }
      }
    },
    plugins: [require("tailwindcss-animate")],
  }