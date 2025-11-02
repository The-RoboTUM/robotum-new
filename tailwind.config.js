export default {
  important: true, 
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Exo', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: [
          'clamp(3rem, 7vw + 0.5rem, 7.5rem)',
          { lineHeight: '1.1' }
        ],
        hero: [
          'clamp(2.75rem, 5.5vw + 0.5rem, 5.5rem)',
          { lineHeight: '1.1' }
        ],
        h1: [
          'clamp(2.25rem, 4vw + 0.5rem, 4.5rem)',
          { lineHeight: '1.15' }
        ],
        h2: [
          'clamp(2rem, 3vw + 0.5rem, 3.25rem)',
          { lineHeight: '1.2' }
        ],
        text1: [
          'clamp(1.125rem, 1.1vw + 0.25rem, 1.5rem)',
          { lineHeight: '1.6' }
        ],
        text2: [
          'clamp(0.9375rem, 0.6vw + 0.2rem, 1.125rem)',
          { lineHeight: '1.7' }
        ],
      },
      colors: {
        primary: '#000C21',
        secondary: '#1E293B',
        accent: '#3B82F6',
        light: '#F1F5F9',
      },
    },
  },
  plugins: [],
};