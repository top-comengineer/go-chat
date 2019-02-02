import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme';
import { Color } from 'csstype';

export default (type: any) => {
  return createMuiTheme({
    palette: {
      type: type as 'light' | 'dark',
      primary: {
        main: '#d2445e'
      },
      secondary: {
        main: '#15ac02'
      },
      text: {
        primary: type === 'light' ? '#363f45' : '#ddd',
        secondary: type === 'light' ? '#525e66' : '#ccc'
      },
      error: {
        main: '#df041f'
      },
      background: {
        default: type === 'light' ? '#eaeaea' : '#1d1d1d'
      }
    },
    customColors: {
      paperTop: type === 'light' ? '#dcdcdc' : '#585858',
      scrollThumb: type === 'light' ? 'rgba(0, 0, 0, 0.2)' : '#7d7d7d'
    },
    transitions: {
      duration: {
        leavingScreen: 200,
        enteringScreen: 200
      }
    },
    typography: {
      useNextVariants: true
    },
    zIndex: {
      drawer: 1099
    }
  });
};

/* tslint:disable */
interface ICustomTheme {
  customColors: {
    paperTop: Color;
    scrollThumb: Color;
  };
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme extends ICustomTheme {}
  interface ThemeOptions extends ICustomTheme {}
}
/* tslint:enable */
