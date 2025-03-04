/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    colors: {
      green: {
        50: '#f0fdf4',
        100: '#e0f8e7',
        200: '#d1f3df',
        300: '#a3e9c0',
        400: '#6ddb96',
        500: '#3cc16b',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
  },
},
    },
  },
  plugins: [require('daisyui')],
}

