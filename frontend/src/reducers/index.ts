import { connectRouter, LocationChangeAction } from 'connected-react-router';
import { createBrowserHistory, LocationState } from 'history';
import { Reducer } from 'react';
import { combineReducers } from 'redux';
import authReducer, { IAuthState, initialAuthState } from './authReducer';
import contactReducer, {
  IContactState,
  initialContactState
} from './contactReducer';
import sidebarReducer, {
  initialSidebarState,
  ISidebarState
} from './sidebarReducer';
import socketReducer, {
  initialSocketState,
  ISocketState
} from './socketReducer';
import themeReducer, { initialThemeState, IThemeState } from './themeReducer';

export const history = createBrowserHistory();

export interface IState {
  theme: IThemeState;
  router: Reducer<LocationState, LocationChangeAction>;
  auth: IAuthState;
  socket: ISocketState;
  contacts: IContactState;
  sidebar: ISidebarState;
}

export const initialState = {
  theme: initialThemeState,
  auth: initialAuthState,
  socket: initialSocketState,
  contacts: initialContactState,
  sidebar: initialSidebarState
};

export default combineReducers({
  theme: themeReducer,
  router: connectRouter(history),
  auth: authReducer,
  socket: socketReducer,
  contacts: contactReducer,
  sidebar: sidebarReducer
});
