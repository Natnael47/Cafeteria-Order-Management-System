/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#39db4a",
        secondary: "#f9c23c",
      },
      maxWidth: {
        "5.3xl": "65rem", // Custom value between 64rem (5xl) and 72rem (6xl)
        "6.5xl": "73rem",
      },
    },
  },
  plugins: [],
};
