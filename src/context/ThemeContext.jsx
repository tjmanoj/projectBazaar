import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { blue, orange } from '@mui/material/colors';

const ThemeContext = createContext();

export function useThemeContext() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: blue[600],
          },
          secondary: {
            main: orange[500],
          },
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
