'use client';
import { DEFAULT_THEME, Theme, themes } from '@data/themes';
import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { themeChange } from 'theme-change';

interface ThemeContextInterface {
  themes: ReadonlyArray<Theme>;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  listenToSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextInterface | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || DEFAULT_THEME;
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    themeChange(false); // false parameter to disable auto-loading of theme
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const contextValue: ThemeContextInterface = {
    themes,
    currentTheme: theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    },
    toggleTheme: () => {
      const newTheme = theme === Theme.Dark ? Theme.Light : Theme.Dark;
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    },
    listenToSystemTheme: () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent): void => {
        const newTheme = e.matches ? Theme.Dark : Theme.Light;
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    },
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export { themes, type Theme };
export const useTheme = (): ThemeContextInterface => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
