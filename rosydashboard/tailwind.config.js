/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Asegúrate de que Tailwind procese los archivos React
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF69B4', // Rosa
        secondary: '#00BFFF', // Azul celeste
        accent: '#FFD700', // Dorado
      },
    },
  },
  plugins: [],
}
