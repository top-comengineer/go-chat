import React, { useState } from 'react';

// Material-UI Components
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';

// Components/Containers
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import GettingStartedContainer from '../containers/GettingStartedContainer';
import HeaderContainer from '../containers/HeaderContainer';
import HomeContainer from '../containers/HomeContainer';
import { history } from '../reducers';

const styles = (theme: Theme) =>
  createStyles({
    content: {
      padding: theme.spacing.unit,
      paddingTop: 64 + theme.spacing.unit,
      height: '100%',
      width: '100%'
    },
    '@global': {
      '.link': {
        textDecoration: 'none',
        fontWeight: 'bold',
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '*::-webkit-scrollbar-track': {
        background: 'transparent'
      },
      '*::-webkit-scrollbar': {
        width: 6,
        height: 6
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.customColors.scrollThumb
      }
    }
  });

function App(props: AppProps) {
  const { classes } = props;

  return (
    <React.Fragment>
      <HeaderContainer />
      <div className={classes.content}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path="/getting-started"
              component={GettingStartedContainer}
            />
            <Route path="/" component={HomeContainer} />
          </Switch>
        </ConnectedRouter>
      </div>
    </React.Fragment>
  );
}

export default withStyles(styles)(App);

export type AppProps = WithStyles<typeof styles>;
