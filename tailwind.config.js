/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Black & Gold System
        'bg-primary': '#0E0E0E',
        'bg-surface': '#181818',
        'bg-hover': '#1F1F1F',
        'text-primary': '#F0EDE3',
        'text-muted': '#AFAFAF',
        'text-dark': '#666666',
        'gold': {
          primary: '#D4AF37',
          soft: '#CBAF6C',
          deep: '#A37E2C',
          subtle: '#3D3528',
        },
        'film': {
          navy: '#2C3E50',
          rust: '#8B4513',
          tan: '#D2B48C',
          slate: '#708090',
        },
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Inter', 'SF Pro Display', 'sans-serif'],
      },
      fontWeight: {
        'ultralight': '100',
        'light': '200',
        'normal': '300',
        'medium': '400',
        'semibold': '500',
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem', 
        'md': '2rem',
        'lg': '3rem',
        'xl': '5rem',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': 'center bottom'
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};