/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        panel: "#f8fafc",
        line: "#d9e1e8",
        brand: "#126b63",
        warn: "#b7791f",
        danger: "#b42318"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(23, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};
