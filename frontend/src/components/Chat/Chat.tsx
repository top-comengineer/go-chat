import React from 'react';

import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import VideoCall from '@material-ui/icons/VideoCall';
import { ContactActionTypes } from '../../actions/contactActions';
import { IMessageWithInfo } from '../../models';
import {
  IContactDetail,
  IMessage,
  IRTCState
} from '../../reducers/contactReducer';
import Message from './Message';

const styles = (theme: Theme) =>
  createStyles({
    chat: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing.unit
    },
    chatBox: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    },
    messageContainer: {
      overflow: 'auto',
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit
    },
    textBox: {
      flexShrink: 0
    }
  });

class Chat extends React.Component<ChatProps, IChatState> {
  messageContainer: HTMLDivElement;
  myVideo: HTMLVideoElement;
  receivedVideo: HTMLVideoElement;
  peerConnection: RTCPeerConnection;
  state = {
    message: '',
    autoScroll: true
  };

  componentDidUpdate(prevProps: ChatProps) {
    this.state.autoScroll &&
      this.messageContainer &&
      this.messageContainer.scrollTo({
        top: this.messageContainer.clientHeight
      });
  }

  onMessageChange = e => {
    this.setState({
      message: e.target.value
    });
  };

  sendMessage = () => {
    this.props.sendMessage({
      to: this.props.contact.id,
      from: this.props.userId,
      message: {
        message: this.state.message,
        incoming: false
      }
    });

    this.props.sendSocketMessage({
      type: ContactActionTypes.RECEIVE_MESSAGE,
      payload: {
        message: {
          to: this.props.contact.id,
          from: this.props.userId,
          message: {
            message: this.state.message,
            incoming: true
          }
        }
      }
    });

    this.setState({
      message: ''
    });
  };

  render() {
    const { classes, messages } = this.props;

    if (!this.props.contact) {
      return null;
    }

    return (
      <div className={classes.chat}>
        <Paper className={classes.userInfo}>
          <Typography variant="h5">{this.props.contact.name}</Typography>
          <IconButton onClick={this.props.startVideoCall}>
            <VideoCall />
          </IconButton>
        </Paper>
        <div className={classes.chatBox}>
          <div
            className={classes.messageContainer}
            ref={elem => (this.messageContainer = elem)}
          >
            {messages.map((message, i) => (
              <Message message={message} key={i} />
            ))}
          </div>
          <TextField
            className={classes.textBox}
            variant="filled"
            fullWidth
            multiline
            rowsMax="4"
            rows="2"
            onChange={this.onMessageChange}
            value={this.state.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={this.sendMessage}>Send</Button>
                </InputAdornment>
              )
            }}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Chat);

interface IChatState {
  message: string;
  autoScroll: boolean;
}

export interface IChatStateProps {
  userId: string;
  contact: IContactDetail;
  messages: IMessage[];
  rtc: IRTCState;
}

export interface IChatDispatchProps {
  sendMessage: (msg: IMessageWithInfo) => {};
  sendSocketMessage: (msg: any) => {};
  startVideoCall: () => {};
}

type ChatProps = IChatStateProps &
  IChatDispatchProps &
  WithStyles<typeof styles>;
