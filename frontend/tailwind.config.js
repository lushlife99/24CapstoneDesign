/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "node_modules/flowbite-react/lib/esm/**/*.js",
  ],


  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],

      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
  ],
};
