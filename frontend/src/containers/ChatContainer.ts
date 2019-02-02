import { connect } from 'react-redux';
import { sendMessage, startVideoCall } from '../actions/contactActions';
import { sendMessage as sendSocketMessage } from '../actions/socketActions';
import Chat, {
  IChatDispatchProps,
  IChatStateProps
} from '../components/Chat/Chat';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IChatStateProps {
  return {
    userId: state.auth.user['cognito:username'],
    contact: state.contacts.contactDetails[state.contacts.selectedContact],
    messages: state.contacts.messages[state.contacts.selectedContact] || [],
    rtc: state.contacts.rtc
  };
}

const mapDispatchToProps: IChatDispatchProps = {
  sendMessage,
  sendSocketMessage,
  startVideoCall
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
