/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          red: '#E11D2E',
          'red-dark': '#B30F1F',
          'red-light': '#FF2D3F',
          maroon: '#7F1120',
          black: '#0A0A0B',
          'black-2': '#111113',
          'black-3': '#1A1A1D',
        },
        // Glass system
        glass: {
          bg: 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.12)',
          'border-red': 'rgba(225,29,46,0.40)',
        },
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#B8B8C0',
          muted: '#6B6B78',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        bangla: ['Hind Siliguri', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF2D3F 0%, #B30F1F 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #FF4D5F 0%, #D01525 100%)',
        'dark-radial': 'radial-gradient(ellipse at top left, rgba(127,17,32,0.3) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(225,29,46,0.15) 0%, transparent 60%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(225,29,46,0.20)',
        'glass-lg': '0 16px 48px rgba(225,29,46,0.25)',
        'glass-sm': '0 4px 16px rgba(225,29,46,0.15)',
        'red-glow': '0 0 20px rgba(225,29,46,0.50)',
        'red-glow-sm': '0 0 10px rgba(225,29,46,0.35)',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'blob': 'blob 8s ease-in-out infinite',
        'blob-delay': 'blob 10s ease-in-out infinite 2s',
        'spin-slow': 'spin 20s linear infinite',
        'counter-up': 'counterUp 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(225,29,46,0.35)' },
          '50%': { boxShadow: '0 0 25px rgba(225,29,46,0.70)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        'glass': '16px',
      },
    },
  },
  plugins: [],
}
