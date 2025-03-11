import { createTheme } from '@mui/material/styles';

// Light theme
export const themes =
{
    light: createTheme({
        palette: {
            mode: 'light',
            primary: { main: '#1976d2' },
            secondary: { main: '#dc004e' },
            background: { main: '#ffffff' },
            navbar: {
                background1: '#AFB1FFFF',
                background2: '#E8ECFFFF',
                icon_inactive: '#868686FF',
                icon_active: '#000000',
            },
            text: {
                main: '#000000'
            }
        },
        typography: {
            fontFamily: 'Kumbh Sans, Arial, sans-serif', // Your preferred font
        },
    }),
    dark: createTheme({
        palette: {
            mode: 'dark',
            primary: { main: '#90caf9' },
            secondary: { main: '#f48fb1' },
            background: { main: '#222222FF' },
            navbar: {
                background1:  '#07175c',
                background2: '#2d2f9e',
                icon_inactive: '#ffffff',
                icon_active: '#E064FFFF',
            },
            text: {
                main: '#ffffff'
            }
        },
        typography: {
            fontFamily: 'Kumbh Sans, Arial, sans-serif',
        },
    })
}
