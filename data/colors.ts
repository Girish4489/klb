const colorMap = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#808080',
  orange: '#FFA500',
  purple: '#800080',
  brown: '#A52A2A',
  pink: '#FFC0CB',
  lime: '#00FF00',
  navy: '#000080',
  teal: '#008080',
  olive: '#808000',
  maroon: '#800000',
  silver: '#C0C0C0',
  gold: '#FFD700',
  beige: '#F5F5DC',
  navyBlue: '#000080',
  khaki: '#F0E68C',
  ivory: '#FFFFF0',
  peach: '#FFE5B4',
  indigo: '#4B0082',
  violet: '#EE82EE',
  turquoise: '#40E0D0',
  plum: '#DDA0DD',
  azure: '#F0FFFF',
  lavender: '#E6E6FA',
  slate: '#708090',
  charcoal: '#36454F',
  snow: '#FFFAFA',
  eggplant: '#614051',
  emerald: '#50C878',
  crimson: '#DC143C',
  coral: '#FF7F50',
  chocolate: '#D2691E',
  chartreuse: '#7FFF00',
  cerulean: '#007BA7',
  burgundy: '#800020',
  bronze: '#CD7F32',
  aquamarine: '#7FFFD4',
  amethyst: '#9966CC',
  amber: '#FFBF00',
  amaranth: '#E52B50',
  almond: '#EFDECD',
  auburn: '#A52A2A',
  bisque: '#FFE4C4',
  buff: '#F0DC82',
  beryl: '#DE3163',
  bittersweet: '#FE6F5E',
  blush: '#DE5D83',
  brass: '#B5A642',
  cerise: '#DE3163',
  champagne: '#F7E7CE',
  chestnut: '#954535',
  citrine: '#E4D00A',
  cobalt: '#0047AB',
  copper: '#B87333',
  daffodil: '#FFFF31',
  ebony: '#555D50',
  fuchsia: '#FF00FF',
  garnet: '#733635',
  goldenrod: '#DAA520',
  harlequin: '#3FFF00',
  heliotrope: '#DF73FF',
  honeydew: '#F0FFF0',
  jade: '#00A86B',
  jasmine: '#F8DE7E',
  jet: '#343434',
  jonquil: '#F4CA16',
  lemon: '#FFF700',
  lilac: '#C8A2C8',
  mint: '#98FF98',
  moss: '#8A9A5B',
  mustard: '#FFDB58',
  ochre: '#CC7722',
  orchid: '#DA70D6',
  papaya: '#FFEFD5',
  periwinkle: '#CCCCFF',
  persimmon: '#EC5800',
  pine: '#01796F',
  raspberry: '#E30B5D',
  rose: '#FF007F',
  ruby: '#E0115F',
  saffron: '#F4C430',
  salmon: '#FA8072',
  sapphire: '#0F52BA',
  scarlet: '#FF2400',
  sepia: '#704214',
  sienna: '#A0522D',
  sky: '#87CEEB',
  spruce: '#0A5F38',
  steel: '#4682B4',
  tangerine: '#F28500',
  taupe: '#483C32',
  terraCotta: '#E2725B',
  thistle: '#D8BFD8',
  topaz: '#FFC87C',
  ultramarine: '#3F00FF',
  vermilion: '#E34234',
  viridian: '#40826D',
  wheat: '#F5DEB3',
  wisteria: '#C9A0DC',
};

interface RGB {
  r: number;
  g: number;
  b: number;
}

const hexToRgb = (hex: string): RGB => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const sortedColors = Object.entries(colorMap).sort(([, hexA], [, hexB]) => {
  const rgbA = hexToRgb(hexA);
  const rgbB = hexToRgb(hexB);
  return rgbA.r - rgbB.r || rgbA.g - rgbB.g || rgbA.b - rgbB.b;
});

const sortedColorsObject = Object.fromEntries(sortedColors);

export const colors = sortedColorsObject;

export const basicColors = {
  Red: '#FF0000',
  Green: '#00FF00',
  Blue: '#0000FF',
  Yellow: '#FFFF00',
  Black: '#000000',
  White: '#FFFFFF',
  Pink: '#FFC0CB',
  Brown: '#A52A2A',
  Violet: '#EE82EE',
  NavyBlue: '#000080',
  SkyBlue: '#87CEEB',
};

export default colors;
