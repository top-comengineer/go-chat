import React from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import ChatContainer from '../../containers/ChatContainer';
import ContactContainer from '../../containers/ContactContainer';
import SidebarContainer from '../../containers/SidebarContainer';
import SocketContainer from '../../containers/SocketContainer';
import VideoChatContainer from '../../containers/VideoChatContainer';
import { ApiStatus } from '../../models';
import { IAuthState } from '../../reducers/authReducer';

const styles = (theme: Theme) =>
  createStyles({
    content: {
      height: '100%',
      display: 'flex'
    }
  });

class Home extends React.Component<HomeProps> {
  componentDidMount() {
    this.props.checkAuth();
  }

  send = () => {
    this.props.sendMessage({
      action: 'TEST',
      payload: 'hello world'
    });
  };

  render() {
    const { classes, auth } = this.props;

    if (auth.loadingStatus === ApiStatus.IN_PROGRESS) {
      return <CircularProgress />;
    }

    if (auth.loadingStatus === ApiStatus.FAILURE || !auth.authenticated) {
      return null;
    }

    return (
      <SocketContainer>
        <ContactContainer>
          <SidebarContainer />
          <div className={classes.content}>
            <ChatContainer />
            <VideoChatContainer />
          </div>
        </ContactContainer>
      </SocketContainer>
    );
  }
}

export default withStyles(styles)(Home);

export interface IHomeStateProps {
  auth: IAuthState;
}

export interface IHomeDispatchProps {
  checkAuth: () => {};
  sendMessage: (d: any) => {};
}

type HomeProps = IHomeStateProps &
  IHomeDispatchProps &
  WithStyles<typeof styles>;
