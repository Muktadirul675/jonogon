import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': '#121212',
        'background-secondary': '#1E1E1E',
        'text-secondary': '#B0BEC5',
        'text-primary': '#E0E0E0',
        'accent': '#BB86FC',
        'border': '#333333',
      },
    },
  },
  plugins: [],
};
export default config;


// module.exports = {
//   darkMode: 'class', // Enable dark mode class strategy
//   theme: {
//     extend: {
//       colors: {
//         'background-primary': '#121212',
//         'background-secondary': '#1E1E1E',
//         'text-primary': '#E0E0E0',
//         'accent': '#BB86FC',
//         'border': '#333333',
//       },
//     },
//   },
//   plugins: [],
// }
