import produce from 'immer';

import { AuthAction, AuthActionTypes } from '../actions/authActions';
import { ApiStatus, IUserInfo } from '../models';

export const initialAuthState: IAuthState = {
  authenticated: false,
  token: localStorage.getItem('goChatToken') || '',
  user: {},
  loadingStatus: ApiStatus.IN_PROGRESS
};

export default function authReducer(
  state: IAuthState = initialAuthState,
  action: AuthAction
): IAuthState {
  return produce(state, draft => {
    switch (action.type) {
      case AuthActionTypes.SET_TOKEN:
        localStorage.setItem('goChatToken', action.payload.token);
        draft.token = action.payload.token;
        break;

      case AuthActionTypes.CHECK_AUTH:
        draft.loadingStatus = ApiStatus.IN_PROGRESS;
        break;

      case AuthActionTypes.CHECK_AUTH_SUCCESS:
        draft.loadingStatus = ApiStatus.SUCCESS;
        draft.user = action.payload.user;
        draft.authenticated = true;
        break;

      case AuthActionTypes.CHECK_AUTH_FAILURE:
        draft.loadingStatus = ApiStatus.FAILURE;
        draft.authenticated = false;
        draft.user = {};
        draft.token = '';
        localStorage.removeItem('goChatToken');
        break;

      case AuthActionTypes.LOGOUT:
        draft.user = {};
        draft.token = '';
        draft.authenticated = false;
        localStorage.removeItem('goChatToken');
        break;

      default:
        break;
    }
  });
}

export interface IAuthState {
  authenticated: boolean;
  token: string;
  user: Partial<IUserInfo>;
  loadingStatus: ApiStatus;
}
