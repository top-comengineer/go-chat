import { createStyles, Theme } from '@material-ui/core/styles';

export default (theme: Theme) =>
  createStyles({
    wrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    logo: {
      marginBottom: 40
    },
    row: {
      marginBottom: 40,
      width: '100%'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }
  });
