'use client';
import { DEFAULT_THEME, Theme, themes } from '@/app/data/themes';
import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';

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
      setTheme((prevTheme) => {
        const newTheme = prevTheme === Theme.Dark ? Theme.Light : Theme.Dark;
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', newTheme);
        }
        return newTheme;
      });
    },
    listenToSystemTheme: () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent): void => {
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

export { themes, type Theme };
export const useTheme = (): ThemeContextInterface => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
