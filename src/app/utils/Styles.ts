import 'daisyui/dist/full.css';
import 'tailwindcss/tailwind.css';

export const getComputedStyleValue = (className: string, property: string): string => {
  if (typeof window === 'undefined') {
    // Return fallback colors for server-side rendering
    const fallbackColors = {
      'bg-success': '#36D399',
      'bg-secondary': '#D926AA',
      'bg-error': '#FF5724',
      'bg-warning': '#FBBD23',
      'bg-primary': '#570DF8',
    };
    return fallbackColors[className as keyof typeof fallbackColors] || '#000000';
  }

  const element = document.createElement('div');
  element.className = className;
  document.body.appendChild(element);
  const color = window.getComputedStyle(element).getPropertyValue(property);
  document.body.removeChild(element);
  return color;
};
