/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['VT323', 'monospace'],
        'retro': ['Press Start 2P', 'monospace'],
      },
      colors: {
        pixel: {
          yellow: '#FFD700',
          green: '#32CD32',
          blue: '#1E90FF',
          red: '#FF6347',
          purple: '#DA70D6',
          orange: '#FF8C00',
          pink: '#FF69B4',
          cyan: '#00FFFF',
          lime: '#00FF00',
          magenta: '#FF00FF',
        },
        retro: {
          dark: '#0F0F23',
          darker: '#050517',
          accent: '#00FF41',
          glow: '#39FF14',
        }
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.8)',
        'pixel-hover': '6px 6px 0px 0px rgba(0,0,0,0.8)',
        'glow': '0 0 20px rgba(57, 255, 20, 0.6)',
        'glow-strong': '0 0 30px rgba(57, 255, 20, 0.8)',
      },
      animation: {
        'bounce-pixel': 'bounce 1s infinite',
        'pulse-glow': 'pulse 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [],
}