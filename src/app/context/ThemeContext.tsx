// ThemeContext.tsx
'use client';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Cupcake = 'cupcake',
  Bumblebee = 'bumblebee',
  Emerald = 'emerald',
  Corporate = 'corporate',
  Synthwave = 'synthwave',
  Retro = 'retro',
  Cyberpunk = 'cyberpunk',
  Valentine = 'valentine',
  Halloween = 'halloween',
  Garden = 'garden',
  Forest = 'forest',
  Aqua = 'aqua',
  Lofi = 'lofi',
  Pastel = 'pastel',
  Fantasy = 'fantasy',
  Wireframe = 'wireframe',
  Black = 'black',
  Luxury = 'luxury',
  Dracula = 'dracula',
  CMYK = 'cmyk',
  Autumn = 'autumn',
  Business = 'business',
  Acid = 'acid',
  Lemonade = 'lemonade',
  Night = 'night',
  Coffee = 'coffee',
  Winter = 'winter',
  Dim = 'dim',
  Nord = 'nord',
  Sunset = 'sunset',
}

export const themes: ReadonlyArray<Theme> = Object.values(Theme);

const DEFAULT_THEME: Theme = Theme.Dark;

interface ThemeContextInterface {
  themes: ReadonlyArray<Theme>;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  listenToSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextInterface | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? (savedTheme as Theme) : DEFAULT_THEME;
    }
    return DEFAULT_THEME;
  });

  const contextValue: ThemeContextInterface = {
    themes,
    currentTheme: theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
    },
    toggleTheme: () => {
      setTheme((prevTheme) => (prevTheme === Theme.Dark ? Theme.Light : Theme.Dark));
    },
    listenToSystemTheme: () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? Theme.Dark : Theme.Light);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    },
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextInterface => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
