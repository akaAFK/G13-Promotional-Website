/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ash: '#0f0f11',
        panel: '#171719',
        crimson: '#8b0000',
        ember: '#e45b2b',
        brass: '#c5a46d',
        bone: '#e8e0d0'
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        ember: '0 0 42px rgba(228,91,43,.16)'
      }
    }
  },
  plugins: []
};
