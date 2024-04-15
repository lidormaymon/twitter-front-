import { Height } from '@mui/icons-material';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '1':'1px',
      },
      width:{
        '45':'11.5rem',
        '75':'19rem',
        '82':'22.8rem',
        '95':'24rem',
        '96':'24.5rem',
        '96.5':'25.98rem',
        '97':'26rem',
        '98':'34rem',
        '100':'35rem',
        '102':'36rem',
        '105':'40rem',
        '108':'42rem',
        '109':'43rem',
        '110':'45rem',
        '115':'50rem',
        '120':'55rem',
        '125':'60rem',
        '130':'65rem',
        '140':'70rem',
        '145':'75rem',
        '150':'80rem',
        '96.5%':'96%',
        '97%':'97.2%'
      },
      screens: {
        '3xl': '1600px', // Custom breakpoint for desktop monitors
      },
      spacing: {
        '13':'3.3rem',
        '18':'4.5rem',
        '23':'5rem',
        '29':'7.2rem',
        '31':'7rem',
        '38':'9.5rem',
        '50':'12.5rem',
        '65':'16.5rem',
        '67':'17.4rem',
        '68':'18rem',
        '69':'18.3rem',
        '74':'20rem',
        '98':'26rem',
        '100':'28rem',
        '101':'29rem',
        '102':'30rem',
        '105':'32rem',
        '109':'33.8rem',
        '110':'35rem',
        '112':'37rem',
        '115':'40rem',
        '120':'45rem',
        '125':'50rem',
      },
      margin: {
        '13':'3.2rem',
      },
      height: {
        '106':'33rem',
        '107':'34rem',
        '114':'38rem',
        '115':'40rem',
        '120':'45rem',
        '125':'50rem',

      }
    },
  },
  plugins: [],
}

