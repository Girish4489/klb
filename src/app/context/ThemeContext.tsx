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
}

const ThemeContext = createContext<ThemeContextInterface | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  const contextValue: ThemeContextInterface = {
    themes,
    currentTheme: theme,
    setTheme,
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
