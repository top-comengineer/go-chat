import { connect } from 'react-redux';
import { loadContacts } from '../actions/contactActions';
import { sendMessage } from '../actions/socketActions';
import Contacts, {
  IContactDispatchProps,
  IContactStateProps
} from '../components/Contacts/Contacts';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IContactStateProps {
  return {
    loadingStatus: state.contacts.loadingStatus
  };
}

const mapDispatchToProps: IContactDispatchProps = {
  loadContacts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contacts);
