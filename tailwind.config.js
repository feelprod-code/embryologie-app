/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // Force Tailwind to completely ignore mobile landscape widths (often 844px+ on iPhones) 
      // by demanding that screens MUST have a decent height to qualify for anything above a phone.
      'sm': { 'raw': '(min-width: 640px) and (min-height: 500px)' },
      'md': { 'raw': '(min-width: 768px) and (min-height: 500px)' },
      'lg': { 'raw': '(min-width: 1024px) and (min-height: 500px)' },
      'xl': { 'raw': '(min-width: 1280px) and (min-height: 500px)' },
      '2xl': { 'raw': '(min-width: 1536px) and (min-height: 500px)' },
    },
    extend: {
      colors: {
        background: '#FAF6ED', // beige premium TDT (exact icon color)
        card: '#FAF6ED', // beige au lieu de blanc pour éviter les décalages
        primary: '#8B1111', // carmine red (cinematic)
        secondary: '#64748b', // slate-500
        dark: '#1e293b', // slate-800
        accent: '#9f1239', // rose-800 (slightly lighter variation of carmine red)
        ecto: '#3b82f6',
        meso: '#ef4444',
        endo: '#22c55e',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
