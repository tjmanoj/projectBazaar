import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, alpha, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#5046E5',
            light: '#6B62FF',
            dark: '#4238B0',
          },
          secondary: {
            main: '#00C4B4',
            light: '#00E6D6',
            dark: '#00A396',
          },
          background: {
            default: mode === 'light' ? '#FFFFFF' : '#121212',
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            subtle: mode === 'light' ? '#F5F5F7' : '#2A2A2A',
          },
          text: {
            primary: mode === 'light' ? '#1A1A1A' : '#FFFFFF',
            secondary: mode === 'light' ? '#666666' : '#A0A0A0',
          }
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '4rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            '@media (max-width:600px)': {
              fontSize: '2.5rem',
            },
          },
          h2: {
            fontSize: '3rem',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            '@media (max-width:600px)': {
              fontSize: '2rem',
            },
          },
          h3: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.4,
            '@media (max-width:600px)': {
              fontSize: '1.5rem',
            },
          },
          body1: {
            fontSize: '1.125rem',
            lineHeight: 1.6,
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              },
              contained: ({ theme }) => ({
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }),
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light' 
                  ? '0 4px 20px rgba(0, 0, 0, 0.08)'
                  : '0 4px 20px rgba(0, 0, 0, 0.5)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(8px)',
                backgroundColor: mode === 'light' 
                  ? 'rgba(255, 255, 255, 0.8)'
                  : 'rgba(18, 18, 18, 0.8)',
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

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
