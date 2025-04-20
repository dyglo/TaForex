module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#111111', light: '#222222', dark: '#000000' }, // switched to heavy dark (black)
        surface: {
          DEFAULT: '#ffffff', // white for light mode
          dark: '#18181b', // almost black for dark mode
          card: '#f8fafc', // card bg for light mode
          cardDark: '#18181b', // card bg for dark mode
        },
        accent: { DEFAULT: '#00c3ff', light: '#66eaff', dark: '#009fcc' },
        neutral: {
          900: '#0f172a', 800: '#1e293b', 700: '#334155',
          600: '#475569', 500: '#64748b', 400: '#94a3b8',
          300: '#cbd5e1', 200: '#e2e8f0', 100: '#f1f5f9'
        }
      },
      fontFamily: {
        sans: ['Inter','system-ui','-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','Helvetica Neue','Arial','sans-serif'],
        mono: ['Fira Code','ui-monospace','SFMono-Regular']
      },
      fontSize: {
        h1: ['2.5rem',{lineHeight:'1.2'}],
        h2: ['2rem',{lineHeight:'1.3'}],
        h3: ['1.75rem',{lineHeight:'1.4'}],
        h4: ['1.5rem',{lineHeight:'1.5'}],
        h5: ['1.25rem',{lineHeight:'1.6'}],
        body: ['1rem',{lineHeight:'1.7'}],
        small: ['0.875rem',{lineHeight:'1.7'}]
      },
      spacing: { 72:'18rem',84:'21rem',96:'24rem' }
    }
  },
  plugins: [ require('@tailwindcss/typography') ],
};
