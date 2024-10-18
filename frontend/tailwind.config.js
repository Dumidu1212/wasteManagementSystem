// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6EE7B7', // Light green
          DEFAULT: '#10B981', // Default green
          dark: '#047857' // Dark green
        },
        secondary: {
          light: '#D1FAE5',
          DEFAULT: '#34D399',
          dark: '#059669'
        },
        background: {
          DEFAULT: '#F0FFF4', // Light background
          dark: '#E6FFFA' // Darker background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif']
      }
    },
  },
  plugins: [],
};
