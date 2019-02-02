import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import { toggleSidebar } from '../actions/sidebarActions';
import { toggleTheme } from '../actions/themeActions';
import Header, {
  IHeaderDispatchProps,
  IHeaderStateProps
} from '../components/Header/Header';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IHeaderStateProps {
  return {
    themeType: state.theme.type,
    authenticated: state.auth.authenticated,
    name: state.auth.user.name
  };
}

const mapDispatchToProps: IHeaderDispatchProps = {
  toggleTheme,
  toggleSidebar,
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
