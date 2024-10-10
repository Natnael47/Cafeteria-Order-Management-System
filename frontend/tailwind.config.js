/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#39db4a",
        SoftCream: "#FFF8DC",
        RichGreen: "#4CAF50",
        WarmOrange: "#FFA500",
      },
    },
  },
  plugins: [],
};
