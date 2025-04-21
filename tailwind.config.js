module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/context/**/*.{js,jsx,ts,tsx}',
    './src/hooks/**/*.{js,jsx,ts,tsx}',
    './src/lib/**/*.{js,jsx,ts,tsx}',
    './src/utils/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      xs: '375px', // Extra small devices (phones)
      sm: '640px', // Small devices (tablets)
      md: '768px', // Medium devices (landscape tablets)
      lg: '1024px', // Large devices (laptops/desktops)
      xl: '1280px', // Extra large devices
      '2xl': '1536px', // 2X large devices
    },
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        accent: '#e74c3c',
      },
    },
  },
  plugins: [],
};
