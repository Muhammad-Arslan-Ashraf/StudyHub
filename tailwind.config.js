/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#e8c77d',
          light: '#f5d898',
        },
        dark: {
          900: '#0d0d1a',
          800: '#13132a',
          700: '#1a1a35',
          600: '#1e1e38',
          500: '#252545',
        },
        teal: '#5dd6c4',
        violet: '#a78bfa',
      },
    },
  },
  plugins: [],
}
