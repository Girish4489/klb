import localFont from 'next/font/local';

// Initialize each font variant separately at module level
const robotoThin = localFont({
  src: '../../../../public/fonts/Roboto/Roboto-Thin.ttf',
  weight: '100',
  variable: '--font-roboto-thin',
});

const robotoThinItalic = localFont({
  src: '../../../../public/fonts/Roboto/Roboto-ThinItalic.ttf',
  weight: '100',
  style: 'italic',
  variable: '--font-roboto-thin-italic',
});

const robotoLight = localFont({
  src: '../../../../public/fonts/Roboto/Roboto-Light.ttf',
  weight: '300',
  variable: '--font-roboto-light',
});

const robotoRegular = localFont({
  src: '../../../../public/fonts/Roboto/Roboto-Regular.ttf',
  weight: '400',
  variable: '--font-roboto-regular',
});

const robotoMedium = localFont({
  src: '../../../../public/fonts/Roboto/Roboto-Medium.ttf',
  weight: '500',
  variable: '--font-roboto-medium',
});

const robotoBold = localFont({
  src: '../../../../public/fonts/Roboto/Roboto-Bold.ttf',
  weight: '700',
  variable: '--font-roboto-bold',
});

const robotoBlack = localFont({
  src: '../../../../public/fonts/Roboto/Roboto-Black.ttf',
  weight: '900',
  variable: '--font-roboto-black',
});

// Export the initialized fonts object
export const roboto = {
  thin: robotoThin,
  thinItalic: robotoThinItalic,
  light: robotoLight,
  regular: robotoRegular,
  medium: robotoMedium,
  bold: robotoBold,
  black: robotoBlack,
} as const;

// Weight mapping for convenience
export const fontWeightMap = {
  100: 'thin',
  300: 'light',
  400: 'regular',
  500: 'medium',
  700: 'bold',
  900: 'black',
} as const;

export type FontWeight = keyof typeof fontWeightMap;
