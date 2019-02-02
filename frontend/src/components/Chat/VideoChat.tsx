import classnames from 'classnames';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Call from '@material-ui/icons/Call';
import CallEnd from '@material-ui/icons/CallEnd';
import { ContactActionTypes } from '../../actions/contactActions';
import { IContactDetail, IRTCState } from '../../reducers/contactReducer';

const styles = (theme: Theme) =>
  createStyles({
    videoContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      zIndex: 1100,
      background: '#000',
      top: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center'
    },
    myVideo: {
      position: 'absolute',
      top: 20,
      left: 20,
      height: '20%',
      width: '20%',
      zIndex: 10
    },
    receivedVideo: {
      position: 'absolute',
      width: '100%',
      height: '100%'
    },
    incomingPaper: {
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1200
    },
    outgoingPaper: {
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1200
    },
    incomingActions: {
      margin: '20px auto 0'
    },
    outgoingActions: {
      margin: '20px auto 0'
    },
    acceptButton: {
      background: 'green',
      marginRight: 25
    },
    declineButton: {
      background: 'red'
    },
    hidden: {
      visibility: 'hidden'
    },
    callActions: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      marginLeft: -20,
      zIndex: 10
    }
  });

class VideoChat extends React.Component<VideoChatProps, IVideoChatState> {
  peerConnection: RTCPeerConnection;
  myVideo: HTMLVideoElement;
  receivedVideo: HTMLVideoElement;
  localStream: MediaStream;
  state = {
    showCallAction: false
  };

  componentDidUpdate(prevProps: VideoChatProps) {
    if (!this.props.rtc.inProgress) {
      return;
    }

    if (this.props.rtc.outgoing && !prevProps.rtc.outgoing) {
      this.startVideoCall();
    }

    if (this.props.rtc.accepted && !prevProps.rtc.accepted) {
      this.handleAnswer();
    }

    if (!this.props.rtc.inProgress && prevProps.rtc.inProgress) {
      this.peerConnection.close();
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream.stop && this.localStream.stop();
    }
  }

  createConnection = () => {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.stunprotocol.org'
        }
      ]
    });
  };

  getStream = () => {
    return navigator.mediaDevices
      .getUserMedia({
        video: true
      })
      .then(stream => {
        this.localStream = stream;
        this.myVideo.srcObject = stream;
        return stream;
      });
  };

  handleNegotiationNeeded = () => {
    this.peerConnection
      .createOffer()
      .then(offer => {
        return this.peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        this.props.sendSocketMessage({
          type: ContactActionTypes.RECEIVE_VIDEO_CALL,
          payload: {
            message: {
              to: this.props.contact.id,
              from: this.props.userId,
              message: {
                message: this.peerConnection.localDescription,
                incoming: true
              }
            }
          }
        });
      });
  };

  startVideoCall = () => {
    this.createConnection();

    this.getStream().then(stream => {
      stream.getTracks().forEach(track => this.peerConnection.addTrack(track));
    });

    this.peerConnection.onicecandidate = iceCandidates => {
      this.props.sendSocketMessage({
        type: ContactActionTypes.RECEIVE_ICE_CANDIDATES,
        payload: {
          message: {
            to: this.props.contact.id,
            from: this.props.userId,
            message: {
              message: iceCandidates.candidate,
              incoming: true
            }
          }
        }
      });
    };

    //   this.peerConnection.oniceconnectionstatechange = ev => { };

    this.peerConnection.ontrack = ev => {
      this.receivedVideo.srcObject = ev.streams[0];
    };

    this.peerConnection.onnegotiationneeded = this.handleNegotiationNeeded;
  };

  handleIncoming = () => {
    this.createConnection();

    const desc = new RTCSessionDescription(this.props.rtc.offer);

    this.peerConnection.ontrack = ev => {
      this.receivedVideo.srcObject = ev.streams[0];
    };

    this.peerConnection
      .setRemoteDescription(desc)
      .then(() => this.getStream())
      .then(stream => {
        stream.getTracks().forEach(t => this.peerConnection.addTrack(t));
      })
      .then(() => {
        return this.peerConnection.createAnswer();
      })
      .then(answer => {
        return this.peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        this.props.sendSocketMessage({
          type: ContactActionTypes.ACCEPT_VIDEO_CALL,
          payload: {
            message: {
              to: this.props.contact.id,
              from: this.props.userId,
              message: {
                message: this.peerConnection.localDescription,
                incoming: true
              }
            }
          }
        });
        this.props.acceptedVideoCall();
      });
  };

  handleAnswer = () => {
    this.peerConnection.setRemoteDescription(this.props.rtc.offer);
  };

  endCall = () => {
    this.props.endCall();
    this.props.sendSocketMessage({
      type: ContactActionTypes.END_CALL,
      payload: {
        message: {
          to: this.props.contact.id,
          from: this.props.userId,
          message: {}
        }
      }
    });
  };

  showCallAction = () => {
    this.setState({
      showCallAction: true
    });
    setTimeout(() => {
      this.setState({
        showCallAction: false
      });
    }, 3000);
  };

  render() {
    const { classes, rtc, contact } = this.props;

    if (!rtc.inProgress) {
      return null;
    }

    return (
      <div className={classes.videoContainer}>
        <video
          autoPlay
          ref={elem => (this.myVideo = elem)}
          className={classnames(classes.myVideo, {
            [classes.hidden]: !rtc.accepted
          })}
        />
        <video
          autoPlay
          ref={elem => (this.receivedVideo = elem)}
          className={classnames(classes.receivedVideo, {
            [classes.hidden]: !rtc.accepted
          })}
          onClick={this.showCallAction}
        />
        {rtc.accepted && this.state.showCallAction && (
          <div className={classes.callActions}>
            <IconButton
              className={classes.declineButton}
              onClick={this.endCall}
            >
              <CallEnd />
            </IconButton>
          </div>
        )}
        {rtc.incoming && !rtc.accepted && (
          <Paper className={classes.incomingPaper}>
            <Typography variant="h5">{contact.name} is calling you</Typography>
            <div className={classes.incomingActions}>
              <IconButton
                className={classes.acceptButton}
                onClick={this.handleIncoming}
              >
                <Call />
              </IconButton>
              <IconButton
                className={classes.declineButton}
                onClick={this.endCall}
              >
                <CallEnd />
              </IconButton>
            </div>
          </Paper>
        )}
        {rtc.outgoing && !rtc.accepted && (
          <Paper className={classes.outgoingPaper}>
            <Typography variant="h5">Calling {contact.name}...</Typography>
            <div className={classes.outgoingActions}>
              <IconButton
                className={classes.declineButton}
                onClick={this.endCall}
              >
                <CallEnd />
              </IconButton>
            </div>
          </Paper>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(VideoChat);

export interface IVideoChatStateProps {
  userId: string;
  contact: IContactDetail;
  rtc: IRTCState;
}

export interface IVideoChatDispatchProps {
  sendSocketMessage: (msg: any) => {};
  acceptedVideoCall: () => {};
  endCall: () => {};
}

interface IVideoChatState {
  showCallAction: boolean;
}

type VideoChatProps = IVideoChatStateProps &
  IVideoChatDispatchProps &
  WithStyles<typeof styles>;
