/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#eefaf3',
          100: '#d7f2e2',
          200: '#b0e4c8',
          300: '#7ccfa9',
          400: '#45b285',
          500: '#22966b',
          600: '#157a56',
          700: '#116147',
          800: '#0f4d3a',
          900: '#0b3a2c',
          950: '#06251c',
        },
        cream: '#FBF7EF',
        charcoal: '#1F2421',
        gold: {
          400: '#E8A94A',
          500: '#DB9A3A',
          600: '#C4832A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(15, 77, 58, 0.06)',
        card: '0 4px 20px rgba(15, 77, 58, 0.08)',
        lift: '0 12px 30px rgba(15, 77, 58, 0.14)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.55 } },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out',
        pulseSoft: 'pulseSoft 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
