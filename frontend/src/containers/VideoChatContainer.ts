import { connect } from 'react-redux';
import { acceptedVideoCall, endCall } from '../actions/contactActions';
import { sendMessage } from '../actions/socketActions';
import VideoChat, {
  IVideoChatDispatchProps,
  IVideoChatStateProps
} from '../components/Chat/VideoChat';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IVideoChatStateProps {
  return {
    rtc: state.contacts.rtc,
    userId: state.auth.user['cognito:username'],
    contact: state.contacts.contactDetails[state.contacts.rtc.recipient]
  };
}

const mapDispatchToProps: IVideoChatDispatchProps = {
  sendSocketMessage: sendMessage,
  acceptedVideoCall,
  endCall
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoChat);
