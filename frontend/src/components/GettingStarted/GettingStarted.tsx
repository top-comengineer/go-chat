import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import produce, { Draft } from 'immer';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import axiosInstance from '../../axios';
import errors from '../../errors';
import GettingStartedContext from './GettingStartedContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import VerifyForm from './VerifyForm';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      height: '100%',
      flexDirection: 'column'
    },
    paper: {
      padding: '48px 40px 36px',
      width: 450,
      margin: '0 auto',
      overflow: 'hidden',
      position: 'relative',
      maxWidth: '95%'
    },
    success: {
      borderRadius: 4,
      border: `2px solid #239623`,
      background: '#c9ffd7',
      padding: 8,
      width: 450,
      margin: '0 auto 10px',
      textAlign: 'center',
      maxWidth: '95%'
    },
    error: {
      borderRadius: 4,
      border: `2px solid ${theme.palette.error.main}`,
      background: 'rgb(255, 174, 183)',
      padding: 8,
      width: 450,
      margin: '0 auto 10px',
      textAlign: 'center',
      maxWidth: '95%'
    }
  });

function GettingStarted(props: GettingStartedProps) {
  let preserveMessage: boolean = false;

  const loadFromURL = () => {
    const { email, code, message, success } = queryString.parse(
      props.location.search
    );
    setState({
      ...state,
      email: email || '',
      code: code || '',
      message: message || '',
      success: Boolean(success)
    });
  };

  useEffect(
    () => {
      loadFromURL();
    },
    [props.location.search]
  );

  const reset = () => {
    setState({
      ...defaultState,
      email: state.email,
      message: preserveMessage ? state.message : '',
      success: preserveMessage ? state.success : true
    });

    if (preserveMessage) {
      preserveMessage = false;
    }
  };

  const handleChange = (field: string) => e => {
    setState(
      produce(state, draft => {
        draft[field] = e.target.value;

        switch (field) {
          case 'name':
            return validateName(draft);
          case 'email':
            return validateEmail(draft);
          case 'password':
            return validatePassword(draft);
        }
      })
    );
  };

  const handleBlur = (field: string) => e => {
    setState(
      produce(state, draft => {
        draft.touched[field] = true;

        switch (field) {
          case 'name':
            return validateName(draft);
          case 'email':
            return validateEmail(draft);
          case 'password':
            return validatePassword(draft);
        }
      })
    );
  };

  const validateName = (draft: Draft<IGettingStartedState>) => {
    if (!draft.touched.name) return;

    if (draft.name.length === 0) {
      draft.errors.name = errors.AccountValidationError.name.required;
      return;
    }

    if (!/^[a-zA-Z]+$/.test(draft.name)) {
      draft.errors.name = errors.AccountValidationError.name.alpha;
      return;
    }

    draft.errors.name = '';
  };

  const validateEmail = (draft: Draft<IGettingStartedState>) => {
    if (!draft.touched.email) return;

    if (draft.email.length === 0) {
      draft.errors.email = errors.AccountValidationError.email.required;
      return;
    }

    draft.errors.email = '';
  };

  const validatePassword = (draft: Draft<IGettingStartedState>) => {
    if (!draft.touched.password) return;

    if (draft.password.length === 0) {
      draft.errors.password = errors.AccountValidationError.password.required;
      return;
    }
    if (draft.password.length < 8) {
      draft.errors.password = errors.AccountValidationError.password.min;
      return;
    }

    if (draft.password.length > 30) {
      draft.errors.password = errors.AccountValidationError.password.max;
    }

    draft.errors.password = '';
  };

  const login = () => {
    const { email, password } = state;

    let hasError = false;
    setState(
      produce(state, draft => {
        draft.touched.email = true;
        validateEmail(draft);
        draft.touched.password = true;
        validatePassword(draft);

        if (draft.errors.email || draft.errors.password) {
          hasError = true;
        } else {
          draft.loading = true;
        }
      })
    );

    if (hasError) return;

    axiosInstance
      .post(`/users/sign-in`, { email, password })
      .then(response => {
        setState({
          ...state,
          loading: false
        });
        props.setToken(response.data.data.idToken);
        props.history.push('/');
      })
      .catch(e => {
        setState({
          ...state,
          loading: false,
          errors: parseError(e.response.data.data) as any
        });
      });
  };

  const verify = () => {
    setState({
      ...state,
      loading: true
    });

    axiosInstance
      .get(`/users/confirm?email=${state.email}&code=${state.code}`)
      .then(() => {
        setState({
          ...state,
          loading: false,
          message: 'Verification successful',
          success: true
        });
        goTo('/login');
      })
      .catch(e =>
        setState({
          ...state,
          loading: false,
          errors: parseError(e.response.data.data) as any
        })
      );
  };

  const register = () => {
    const { name, email, password } = state;

    let hasError = false;
    setState(
      produce(state, draft => {
        draft.touched.name = true;
        validateName(draft);
        draft.touched.email = true;
        validateEmail(draft);
        draft.touched.password = true;
        validatePassword(draft);

        if (draft.errors.name || draft.errors.email || draft.errors.password) {
          hasError = true;
        } else {
          draft.loading = true;
        }
      })
    );

    if (hasError) return;

    axiosInstance
      .post('/users/sign-up', { name, email, password })
      .then(response => {
        setState({
          ...state,
          loading: false,
          message: 'Registration successful',
          success: true
        });
        goTo('/verify');
      })
      .catch(e =>
        setState({
          ...state,
          loading: false,
          errors: parseError(e.response.data.data) as any
        })
      );
  };

  const goTo = (endpoint: string) => {
    preserveMessage = true;
    props.history.push(`${props.match.path}${endpoint}`);
  };

  const parseError = (errorCodesMap: { [field: string]: string }) => {
    const errMsg = {};
    if (errorCodesMap) {
      Object.keys(errorCodesMap).forEach(k => {
        errMsg[k] = errors.AccountValidationError[k][errorCodesMap[k]];
      });
    }
    return errMsg;
  };

  const defaultState: IGettingStartedState = {
    name: '',
    email: '',
    password: '',
    loading: false,
    success: true,
    message: '',
    code: '',
    touched: {
      name: false,
      email: false,
      password: false,
      code: false
    },
    errors: {
      name: '',
      email: '',
      password: '',
      code: ''
    }
  };

  const [state, setState] = useState(defaultState);

  const value = {
    ...state,
    handleChange,
    handleBlur,
    login,
    verify,
    register,
    reset
  };

  const {
    classes,
    match: {
      path,
      params: { page }
    }
  } = props;

  return (
    <div className={classes.root}>
      {state.message && (
        <div
          className={classnames({
            [classes.success]: state.success,
            [classes.error]: !state.success
          })}
        >
          <Typography color="inherit">{state.message}</Typography>
        </div>
      )}
      <Paper className={classes.paper}>
        <GettingStartedContext.Provider value={value}>
          <Switch>
            <Route path={`${path}/login`} component={LoginForm} />
            <Route path={`${path}/register`} component={RegisterForm} />
            <Route path={`${path}/verify`} component={VerifyForm} />
          </Switch>
        </GettingStartedContext.Provider>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(withRouter(GettingStarted));

type GettingStartedProps = IGettingStartedDispatchProps &
  WithStyles<typeof styles> &
  RouteComponentProps<{ page: string }>;

interface IGettingStartedState {
  name: string;
  email: string;
  password: string;
  code: string;
  message: string;
  success: boolean;
  loading: boolean;
  touched: {
    name: boolean;
    email: boolean;
    password: boolean;
    code: boolean;
  };
  errors: {
    name: string;
    email: string;
    password: string;
    code: string;
  };
}

export interface IGettingStartedDispatchProps {
  setToken: (token: string) => {};
}
