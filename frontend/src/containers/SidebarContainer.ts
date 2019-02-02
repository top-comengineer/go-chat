import { connect } from 'react-redux';

import {
  addToContact,
  findUser,
  startConversation
} from '../actions/contactActions';
import { toggleSidebar } from '../actions/sidebarActions';
import Sidebar, {
  ISidebarDispatchProps,
  ISidebarStateProps
} from '../components/Sidebar/Sidebar';
import { IState } from '../reducers';

function mapStateToProps(state: IState): ISidebarStateProps {
  return {
    contacts: state.contacts.contacts.map(
      c => state.contacts.contactDetails[c]
    ),
    open: state.sidebar.open,
    searchStatus: state.contacts.searchStatus,
    searchResults: state.contacts.searchResults
  };
}

const mapDispatchToProps: ISidebarDispatchProps = {
  startConversation,
  toggleSidebar,
  findUser,
  addToContact
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
