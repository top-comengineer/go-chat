import { connect } from 'react-redux';
import { checkAuth } from '../actions/authActions';
import { sendMessage } from '../actions/socketActions';
import Home, {
  IHomeDispatchProps,
  IHomeStateProps
} from '../components/Home/Home';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IHomeStateProps {
  return {
    auth: state.auth
  };
}

const mapDispatchToProps: IHomeDispatchProps = {
  checkAuth,
  sendMessage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
