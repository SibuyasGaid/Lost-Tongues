/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        amber: { DEFAULT: '#D4A853', dark: '#B8892E' },
        teal: { DEFAULT: '#1A535C', light: '#2D7A85' },
        coral: { DEFAULT: '#E07A5F', dark: '#C4634A' },
        cream: '#FAF3E0',
        charcoal: '#1C1C1E',
        'warm-white': '#F5F0E6',
        'near-black': '#2D2D2D',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        body: ['"Source Sans 3"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
