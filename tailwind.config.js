/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./pages/**/*.{html,js}","./assets/js/*.js"],
  theme: {
    extend: {
      minWidth: {
        '1/2': 'calc(( 100% - 1rem ) / 2)',
        '1/3': 'calc(( 100% - 2rem ) / 3)',
        '1/4' : 'calc(( 100% - 4rem ) / 4)',
      },
      colors: {
        main:'#3fb871',
        active: '#36a66d',
        vimeo: '#1AB7EA',
        tumblr: '#36465D'
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '540px',
          md: '720px',
          lg: '960px',
          xl: '1140px',
          '2xl': '1140px',
        },
      },
    },
  },
  plugins: [],
}
