import { connect } from 'react-redux';
import { setToken } from '../actions/authActions';
import GettingStarted, {
  IGettingStartedDispatchProps
} from '../components/GettingStarted/GettingStarted';
import { IState } from '../reducers';

function mapStateToProps(state: IState) {
  return {};
}

const mapDispatchToProps: IGettingStartedDispatchProps = {
  setToken
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GettingStarted);
