'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, alpha } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';
type ThemeColor = 'blue' | 'purple' | 'green' | 'teal' | 'indigo' | 'amber' | 'red' | 'pink' | 'orange' | 'cyan' | 'deepPurple' | 'lime';
type FontFamily = 'inter' | 'roboto' | 'poppins' | 'montserrat' | 'opensans' | 'underdog';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  fontFamily: FontFamily;
  toggleTheme: () => void;
  changeThemeColor: (color: ThemeColor) => void;
  changeFontFamily: (font: FontFamily) => void;
}

const themeColors = {
  blue: {
    light: { 
      primary: '#1976d2', 
      secondary: '#f50057',
      background: '#f5f7fa',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#bbdefb',
      accent2: '#64b5f6',
      accent3: '#1976d2'
    },
    dark: { 
      primary: '#90caf9', 
      secondary: '#f48fb1',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#0d47a1',
      accent2: '#1565c0',
      accent3: '#1976d2'
    },
  },
  purple: {
    light: { 
      primary: '#7b1fa2', 
      secondary: '#00bcd4',
      background: '#f8f6fc',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#e1bee7',
      accent2: '#ba68c8',
      accent3: '#8e24aa'
    },
    dark: { 
      primary: '#ba68c8', 
      secondary: '#80deea',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#4a148c',
      accent2: '#6a1b9a',
      accent3: '#7b1fa2'
    },
  },
  green: {
    light: { 
      primary: '#2e7d32', 
      secondary: '#ff5722',
      background: '#f1f8e9',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#c8e6c9',
      accent2: '#81c784',
      accent3: '#43a047'
    },
    dark: { 
      primary: '#81c784', 
      secondary: '#ff8a65',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#1b5e20',
      accent2: '#2e7d32',
      accent3: '#388e3c'
    },
  },
  teal: {
    light: { 
      primary: '#00796b', 
      secondary: '#ec407a',
      background: '#e0f2f1',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#b2dfdb',
      accent2: '#4db6ac',
      accent3: '#00897b'
    },
    dark: { 
      primary: '#4db6ac', 
      secondary: '#f48fb1',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#004d40',
      accent2: '#00695c',
      accent3: '#00796b'
    },
  },
  indigo: {
    light: { 
      primary: '#3f51b5', 
      secondary: '#ff4081',
      background: '#e8eaf6',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#c5cae9',
      accent2: '#7986cb',
      accent3: '#3949ab'
    },
    dark: { 
      primary: '#7986cb', 
      secondary: '#ff80ab',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#1a237e',
      accent2: '#283593',
      accent3: '#303f9f'
    },
  },
  amber: {
    light: { 
      primary: '#ff8f00', 
      secondary: '#448aff',
      background: '#fff8e1',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#ffecb3',
      accent2: '#ffd54f',
      accent3: '#ffc107'
    },
    dark: { 
      primary: '#ffd54f', 
      secondary: '#82b1ff',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#ff6f00',
      accent2: '#ff8f00',
      accent3: '#ffa000'
    },
  },
  red: {
    light: { 
      primary: '#d32f2f', 
      secondary: '#2196f3',
      background: '#ffebee',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#ffcdd2',
      accent2: '#e57373',
      accent3: '#f44336'
    },
    dark: { 
      primary: '#ef5350', 
      secondary: '#64b5f6',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#b71c1c',
      accent2: '#c62828',
      accent3: '#d32f2f'
    },
  },
  pink: {
    light: { 
      primary: '#c2185b', 
      secondary: '#00bcd4',
      background: '#fce4ec',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#f8bbd0',
      accent2: '#f48fb1',
      accent3: '#ec407a'
    },
    dark: { 
      primary: '#f48fb1', 
      secondary: '#80deea',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#880e4f',
      accent2: '#ad1457',
      accent3: '#c2185b'
    },
  },
  orange: {
    light: { 
      primary: '#ef6c00', 
      secondary: '#03a9f4',
      background: '#fff3e0',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#ffe0b2',
      accent2: '#ffb74d',
      accent3: '#ff9800'
    },
    dark: { 
      primary: '#ffb74d', 
      secondary: '#4fc3f7',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#e65100',
      accent2: '#ef6c00',
      accent3: '#f57c00'
    },
  },
  cyan: {
    light: { 
      primary: '#0097a7', 
      secondary: '#f50057',
      background: '#e0f7fa',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#b2ebf2',
      accent2: '#4dd0e1',
      accent3: '#00bcd4'
    },
    dark: { 
      primary: '#4dd0e1', 
      secondary: '#f48fb1',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#006064',
      accent2: '#00838f',
      accent3: '#0097a7'
    },
  },
  deepPurple: {
    light: { 
      primary: '#512da8', 
      secondary: '#ff4081',
      background: '#ede7f6',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#d1c4e9',
      accent2: '#9575cd',
      accent3: '#673ab7'
    },
    dark: { 
      primary: '#9575cd', 
      secondary: '#ff80ab',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#311b92',
      accent2: '#4527a0',
      accent3: '#512da8'
    },
  },
  lime: {
    light: { 
      primary: '#afb42b', 
      secondary: '#7e57c2',
      background: '#f9fbe7',
      paper: '#ffffff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#f0f4c3',
      accent2: '#dce775',
      accent3: '#cddc39'
    },
    dark: { 
      primary: '#dce775', 
      secondary: '#b39ddb',
      background: '#121212',
      paper: '#1e1e1e',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#e57373',
      info: '#64b5f6',
      accent1: '#827717',
      accent2: '#9e9d24',
      accent3: '#afb42b'
    },
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Component to load Underdog font from Google Fonts
function UnderdogFontLoader() {
  useEffect(() => {
    // Add preconnect links
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectGoogle);

    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectGstatic);

    // Add font stylesheet
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Underdog&display=swap';
    document.head.appendChild(fontLink);

    // Cleanup function
    return () => {
      document.head.removeChild(preconnectGoogle);
      document.head.removeChild(preconnectGstatic);
      document.head.removeChild(fontLink);
    };
  }, []);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [color, setColor] = useState<ThemeColor>('blue');
  const [fontFamily, setFontFamily] = useState<FontFamily>('inter');

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('themeMode') as ThemeMode;
      const savedColor = localStorage.getItem('themeColor') as ThemeColor;
      const savedFont = localStorage.getItem('fontFamily') as FontFamily;
      
      if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
        setMode(savedMode);
      }
      
      if (savedColor && themeColors[savedColor] && Object.keys(themeColors).includes(savedColor)) {
        setColor(savedColor);
      }
      
      if (savedFont && ['inter', 'roboto', 'poppins', 'montserrat', 'opensans'].includes(savedFont)) {
        setFontFamily(savedFont);
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
      // Reset to defaults if there's an error
      setMode('light');
      setColor('blue');
      setFontFamily('inter');
    }
  }, []);

  // Ensure we have valid values before creating the theme
  const safeMode = mode === 'light' || mode === 'dark' ? mode : 'light';
  const safeColor = themeColors[color] ? color : 'blue';
  const safeFontFamily = ['inter', 'roboto', 'poppins', 'montserrat', 'opensans', 'underdog'].includes(fontFamily) ? fontFamily : 'inter';
  
  // Font family mapping
  const fontFamilyMap = {
    inter: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    roboto: '"Roboto", "Helvetica", "Arial", sans-serif',
    poppins: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    montserrat: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    opensans: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    underdog: '"Underdog", cursive'
  };

  const theme = createTheme({
    palette: {
      mode: safeMode,
      primary: {
        main: themeColors[safeColor][safeMode].primary,
        light: themeColors[safeColor][safeMode].accent2,
        dark: themeColors[safeColor][safeMode].accent3,
      },
      secondary: {
        main: themeColors[safeColor][safeMode].secondary,
      },
      background: {
        default: themeColors[safeColor][safeMode].background,
        paper: themeColors[safeColor][safeMode].paper,
      },
      success: {
        main: themeColors[safeColor][safeMode].success,
      },
      warning: {
        main: themeColors[safeColor][safeMode].warning,
      },
      error: {
        main: themeColors[safeColor][safeMode].error,
      },
      info: {
        main: themeColors[safeColor][safeMode].info,
      },
      // Custom palette extensions
      accent1: {
        main: themeColors[safeColor][safeMode].accent1,
      },
      accent2: {
        main: themeColors[safeColor][safeMode].accent2,
      },
      accent3: {
        main: themeColors[safeColor][safeMode].accent3,
      },
    } as any,
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: safeMode === 'light' 
              ? '0 2px 4px rgba(0,0,0,0.08)' 
              : '0 2px 4px rgba(0,0,0,0.15)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: safeMode === 'light' 
              ? 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05))' 
              : 'linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15))',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: safeMode === 'light' 
              ? '0 2px 8px rgba(0,0,0,0.06)' 
              : '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: safeMode === 'light' 
                ? '0 4px 12px rgba(0,0,0,0.1)' 
                : '0 4px 12px rgba(0,0,0,0.3)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: fontFamilyMap[safeFontFamily],
      h1: {
        fontWeight: 600,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 500,
      },
    },
  });

  const toggleTheme = () => {
    const newMode = safeMode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const changeThemeColor = (newColor: ThemeColor) => {
    setColor(newColor);
    localStorage.setItem('themeColor', newColor);
  };
  
  const changeFontFamily = (newFont: FontFamily) => {
    setFontFamily(newFont);
    localStorage.setItem('fontFamily', newFont);
  };

  return (
    <ThemeContext.Provider value={{ mode: safeMode, color: safeColor, fontFamily: safeFontFamily, toggleTheme, changeThemeColor, changeFontFamily }}>
      <UnderdogFontLoader />
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
