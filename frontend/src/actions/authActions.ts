import { IUserInfo } from '../models';

export enum AuthActionTypes {
  SET_TOKEN = 'auth/setToken',
  CHECK_AUTH = 'auth/checkAuth',
  CHECK_AUTH_SUCCESS = 'auth/checkAuthSuccess',
  CHECK_AUTH_FAILURE = 'auth/checkAuthFailure',
  LOGOUT = 'auth/logout'
}

export function setToken(token: string): ISetTokenAction {
  return {
    type: AuthActionTypes.SET_TOKEN,
    payload: {
      token
    }
  };
}

export function checkAuth(): ICheckAuthAction {
  return { type: AuthActionTypes.CHECK_AUTH };
}

export function checkAuthSuccess(user: IUserInfo): ICheckAuthSuccessAction {
  return {
    type: AuthActionTypes.CHECK_AUTH_SUCCESS,
    payload: {
      user
    }
  };
}

export function checkAuthFailure(): ICheckAuthFailureAction {
  return {
    type: AuthActionTypes.CHECK_AUTH_FAILURE
  };
}

export function logout(): ILogoutAction {
  return {
    type: AuthActionTypes.LOGOUT
  };
}

export interface ISetTokenAction {
  type: AuthActionTypes.SET_TOKEN;
  payload: {
    token: string;
  };
}

export interface ICheckAuthAction {
  type: AuthActionTypes.CHECK_AUTH;
}

export interface ICheckAuthSuccessAction {
  type: AuthActionTypes.CHECK_AUTH_SUCCESS;
  payload: {
    user: IUserInfo;
  };
}

export interface ICheckAuthFailureAction {
  type: AuthActionTypes.CHECK_AUTH_FAILURE;
}

export interface ILogoutAction {
  type: AuthActionTypes.LOGOUT;
}

export type AuthAction =
  | ISetTokenAction
  | ICheckAuthAction
  | ICheckAuthSuccessAction
  | ICheckAuthFailureAction
  | ILogoutAction;
