// Updated color utility function to use DaisyUI's OKLCH format
export const getThemeColor = (colorName: string): string => {
  if (typeof window === 'undefined') return '#000000';
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue(`--color-${colorName}`).trim() || '#000000';
};

export const Colors = {
  primary: getThemeColor('primary'),
  secondary: getThemeColor('secondary'),
  accent: getThemeColor('accent'),
  neutral: getThemeColor('neutral'),
  success: getThemeColor('success'),
  warning: getThemeColor('warning'),
  error: getThemeColor('error'),
  info: getThemeColor('info'),
  base: getThemeColor('base-content'),
};
