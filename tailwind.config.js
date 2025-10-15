// tailwind.config.js
module.exports = {
  future: {},
  theme: {
    extend: {
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9'
      },
      colors: {
        vermillion: {
          50: '#FFF8F9',
          100: '#FFEBEC',
          200: '#FFC7C9',
          300: '#FFA3A6',
          400: '#FF7F83',
          500: '#FB3640',
          600: '#E42E38',
          700: '#C8262F',
          800: '#A71F27',
          900: '#86191F',
        }
      },
      // create a configuration for responsive breakpoints
      screens: {
        'xxs': '320px',
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '960px',
        'xl': '1200px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      // create a configuration for width
      width: {
        'xxs': '320px',
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '960px',
        'xl': '1200px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      // create a configuration for height
      height: {
        'xxs': '16px',
        'xs': '32px',
        'sm': '40px',
        'md': '48px',
        'lg': '56px',
        'xl': '64px',
        '2xl': '72px',
        '3xl': '80px',
        '4xl': '96px',
      },
      // create a configuration for z-index
      zIndex: {
        '1': '1',
        '5': '5',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
      },
      // create a configuration for text size
      fontSize: {
        'md': '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
        '8xl': '6rem',
      },
      // create a configuration for text line height
      lineHeight: {
        '2xl': '1.25',
        '3xl': '1.5',
        '4xl': '1.75',
        '5xl': '2',
        '6xl': '2.25',
        '7xl': '2.5',
        '8xl': '2.75',
      },
      // create a configuration for gap sizes
      gap: {
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
      },
    },
  },
  variants: {},
  plugins: [],
}
