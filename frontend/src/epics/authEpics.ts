import {
  ActionsObservable,
  combineEpics,
  StateObservable
} from 'redux-observable';
import { from, of } from 'rxjs';
import axios from '../axios';

import { push } from 'connected-react-router';
import {
  AuthAction,
  AuthActionTypes,
  checkAuthFailure,
  checkAuthSuccess
} from '../actions/authActions';
import { IState } from '../reducers';

export const setTokenEpic = (
  action$: ActionsObservable<AuthAction>,
  state$: StateObservable<IState>
) => action$.ofType(AuthActionTypes.SET_TOKEN).mapTo(push('/'));

export const checkAuthEpic = (
  action$: ActionsObservable<AuthAction>,
  state$: StateObservable<IState>
) =>
  action$.ofType(AuthActionTypes.CHECK_AUTH).mergeMap(() =>
    from(axios.get('/users/token-info'))
      .map(response => checkAuthSuccess(response.data.data))
      .catch(() => of(checkAuthFailure()))
  );

export const checkAuthFailureEpic = (
  action$: ActionsObservable<AuthAction>,
  state$: StateObservable<IState>
) =>
  action$
    .ofType(AuthActionTypes.CHECK_AUTH_FAILURE)
    .mapTo(push('/getting-started/login'));

export const logoutEpic = (
  action$: ActionsObservable<AuthAction>,
  state$: StateObservable<IState>
) =>
  action$.ofType(AuthActionTypes.LOGOUT).mapTo(push('/getting-started/login'));

export default combineEpics(
  setTokenEpic,
  checkAuthEpic,
  checkAuthFailureEpic,
  logoutEpic
);
