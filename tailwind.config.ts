import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-out',
      },
      fontFamily: {
        thin: ['var(--font-roboto-thin)'],
        light: ['var(--font-roboto-light)'],
        regular: ['var(--font-roboto-regular)'],
        medium: ['var(--font-roboto-medium)'],
        bold: ['var(--font-roboto-bold)'],
        black: ['var(--font-roboto-black)'],
      },
    },
  },
};
export default config;
