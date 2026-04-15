import React, { useEffect, useState, createContext, useContext } from 'react';
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({ children }: {children: React.ReactNode;}) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('padinig-theme') as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }
    // Fallback to system preference
    if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
    {
      return 'dark';
    }
    return 'light';
  });
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('padinig-theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
  };
  const isDark = theme === 'dark';
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark
      }}>
      
      {children}
    </ThemeContext.Provider>);

}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}