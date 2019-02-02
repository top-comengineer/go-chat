import { IMessage } from './reducers/contactReducer';

export enum ApiStatus {
  IN_PROGRESS = 'loading',
  SUCCESS = 'success',
  FAILURE = 'failure'
}

export interface IUserInfo {
  aud: string;
  'cognito:username': string;
  email: string;
  email_verified: string;
  event_id: string;
  exp: string;
  iat: string;
  iss: string;
  name: string;
  sub: string;
  token_user: string;
}

export interface IMessageWithInfo {
  to: string;
  from: string;
  message: IMessage;
}

export interface ISearchResult {
  id: string;
  name: string;
  email: string;
  inContact?: boolean;
  loading: boolean;
}
