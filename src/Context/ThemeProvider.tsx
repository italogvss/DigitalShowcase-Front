import React, { useState, createContext, useContext, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ptBR as gridBR} from '@mui/x-data-grid/locales';
import { ptBR as pickerBR} from '@mui/x-date-pickers/locales';
import { ptBR as localeBR} from '@mui/material/locale';

interface ThemeContextType {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

declare module "@mui/material/styles" {
  interface Theme {
    customShadows: {
      shadowBox: string;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      shadowBox?: string;
    };
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};

interface ThemeModeProviderProps {
  children: ReactNode;
}

const ThemeModeProvider: React.FC<ThemeModeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#121c29',
      },
      secondary: {
        main: '#ff7600',
        contrastText: 'rgba(255,255,255,0.87)',
      },
      error: {
        main: '#8a121d',
      },
      warning: {
        main: '#c39e09',
      },
      success: {
        main: '#1e9421',
      },
      info: {
        main: '#3c87b1',
      },
      background:{
        paper: '#fff',
        default: '#fff'
      }
    },
    typography: {
      fontFamily: 'Readex Pro',
      fontSize: 14,
      subtitle1:{
        fontWeight: 400,
        fontSize: '0.9rem'
      },
      h1:{
        fontWeight: 600,
        fontSize: '3rem'
      },
      h2:{
        fontWeight: 600,
        fontSize: '2.2rem'
      },
      h3:{
        fontWeight: 600,
        fontSize: '1.8rem'
      },
      h6:{
        fontWeight: 500,
        fontSize: '1.0rem'
      }
    },
    customShadows: {
      shadowBox: `
  0px 3.2px 28.2px -16px rgba(0, 0, 0, 0.042),
  0px 7.8px 57.6px -16px rgba(0, 0, 0, 0.061),
  0px 14.7px 91px -16px rgba(0, 0, 0, 0.075),
  0px 26.1px 135.7px -16px rgba(0, 0, 0, 0.089),
  0px 48.9px 217.4px -16px rgba(0, 0, 0, 0.108),
  0px 117px 500px -16px rgba(0, 0, 0, 0.15)
`
    },   
  },gridBR, pickerBR, localeBR);

  return (
    <ThemeContext.Provider value={{ toggleDarkMode, isDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeModeProvider;
