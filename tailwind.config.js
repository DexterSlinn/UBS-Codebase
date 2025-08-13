/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ubs-red': '#ec0016',
        'ubs-black': '#000000',
        'ubs-gray': '#f5f5f5',
        'ubs-dark-gray': '#333333',
      },
      fontFamily: {
        'frutiger': ['Frutiger', 'Arial', 'sans-serif'],
        'sans': ['Frutiger', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}