/** @type {import('tailwindcss').Config} */
module.exports = {  
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        court: {
          DEFAULT: '#16342B', 
          deep: '#0E241D', 
        },
        line: '#D7FF4F', 
        paper: '#F7F5EF', 
        ink: '#10201A', 
        mist: '#8FA69B', 
        clay: '#DC4B3E', 
      },
    },
  },
  plugins: [],
};