/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        myriadpro: ['myriadpro', 'sans-serif']
      },

      dropShadow: {
        'lg': '0 0 2px rgba(0, 0, 0, 1)',
      },

      screens: {
        'sm': { raw: '(min-width: 640px) and (min-height: 700px)' },
      },
    },
  },
  plugins: [],
}
