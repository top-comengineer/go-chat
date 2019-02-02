import { IMessageWithInfo, ISearchResult } from '../models';
import { IContactDetail, IMessage } from '../reducers/contactReducer';

export enum ContactActionTypes {
  LOAD_CONTACTS = 'contacts/loadContacts',
  LOAD_CONTACTS_SUCCESS = 'contacts/loadContactsSuccess',
  LOAD_CONTACTS_FAILURE = 'contacts/loadContactsFailure',
  START_CONVERSATION = 'contacts/startConversation',
  SEND_MESSAGE = 'contacts/sendMessage',
  RECEIVE_MESSAGE = 'contacts/receiveMessage',
  START_VIDEO_CALL = 'contacts/startVideoCall',
  RECEIVE_VIDEO_CALL = 'contacts/receiveVideoCall',
  RECEIVE_ICE_CANDIDATES = 'contacts/receiveIceCandidates',
  ACCEPT_VIDEO_CALL = 'contacts/acceptVideoCall',
  ACCEPTED_VIDEO_CALL = 'contacts/acceptedVideoCall',
  END_CALL = 'contacts/endCall',
  FIND_USER = 'contacts/findUser',
  FIND_USER_SUCCESS = 'contacts/findUserSuccess',
  FIND_USER_FAILURE = 'contacts/findUserFailure',
  ADD_TO_CONTACT = 'contacts/addToContact',
  ADD_TO_CONTACT_SUCCESS = 'contacts/addToContactSuccess',
  ADD_TO_CONTACT_FAILURE = 'contacts/addToContactFailure'
}

export function loadContacts(): ILoadContactsAction {
  return { type: ContactActionTypes.LOAD_CONTACTS };
}

export function loadContactsSuccess(contacts: any): ILoadContactsSuccessAction {
  return {
    type: ContactActionTypes.LOAD_CONTACTS_SUCCESS,
    payload: { contacts }
  };
}

export function loadContactsFailure(): ILoadContactsFailureAction {
  return { type: ContactActionTypes.LOAD_CONTACTS_FAILURE };
}

export function startConversation(id: string): IStartConversationAction {
  return {
    type: ContactActionTypes.START_CONVERSATION,
    payload: {
      id
    }
  };
}

export function sendMessage(message: IMessageWithInfo): ISendMessageAction {
  return {
    type: ContactActionTypes.SEND_MESSAGE,
    payload: {
      message
    }
  };
}

export function startVideoCall(): IStartVideoCallAction {
  return {
    type: ContactActionTypes.START_VIDEO_CALL
  };
}

export function endCall(): IEndCallAction {
  return {
    type: ContactActionTypes.END_CALL
  };
}

export function acceptedVideoCall(): IAcceptedVideoCallAction {
  return {
    type: ContactActionTypes.ACCEPTED_VIDEO_CALL
  };
}

export function findUser(email: string): IFindUserAction {
  return {
    type: ContactActionTypes.FIND_USER,
    payload: {
      email
    }
  };
}

export function findUserSuccess(
  searchResults: ISearchResult[]
): IFindUserSuccessAction {
  return {
    type: ContactActionTypes.FIND_USER_SUCCESS,
    payload: {
      searchResults
    }
  };
}

export function findUserFailure(): IFindUserFailureAction {
  return {
    type: ContactActionTypes.FIND_USER_FAILURE
  };
}

export function addToContact(id: string): IaddToContactAction {
  return {
    type: ContactActionTypes.ADD_TO_CONTACT,
    payload: {
      id
    }
  };
}

export function addToContactSuccess(id: string): IaddToContactSuccessAction {
  return {
    type: ContactActionTypes.ADD_TO_CONTACT_SUCCESS,
    payload: {
      id
    }
  };
}

export function addToContactFailure(id: string): IaddToContactFailureAction {
  return {
    type: ContactActionTypes.ADD_TO_CONTACT_FAILURE,
    payload: {
      id
    }
  };
}

export interface ILoadContactsAction {
  type: ContactActionTypes.LOAD_CONTACTS;
}

export interface ILoadContactsSuccessAction {
  type: ContactActionTypes.LOAD_CONTACTS_SUCCESS;
  payload: {
    contacts: any;
  };
}

export interface ILoadContactsFailureAction {
  type: ContactActionTypes.LOAD_CONTACTS_FAILURE;
}

export interface IStartConversationAction {
  type: ContactActionTypes.START_CONVERSATION;
  payload: {
    id: string;
  };
}

export interface ISendMessageAction {
  type: ContactActionTypes.SEND_MESSAGE;
  payload: {
    message: IMessageWithInfo;
  };
}

export interface IReceiveMessageAction {
  type: ContactActionTypes.RECEIVE_MESSAGE;
  payload: {
    message: IMessageWithInfo;
  };
}

export interface IStartVideoCallAction {
  type: ContactActionTypes.START_VIDEO_CALL;
}

export interface IReceiveVideoCallAction {
  type: ContactActionTypes.RECEIVE_VIDEO_CALL;
  payload: {
    message: IMessageWithInfo;
  };
}

export interface IReceiveIceCandidatesAction {
  type: ContactActionTypes.RECEIVE_ICE_CANDIDATES;
  payload: {
    message: IMessageWithInfo;
  };
}

export interface IAcceptVideoCallAction {
  type: ContactActionTypes.ACCEPT_VIDEO_CALL;
  payload: {
    message: IMessageWithInfo;
  };
}

export interface IAcceptedVideoCallAction {
  type: ContactActionTypes.ACCEPTED_VIDEO_CALL;
}

export interface IEndCallAction {
  type: ContactActionTypes.END_CALL;
}

export interface IFindUserAction {
  type: ContactActionTypes.FIND_USER;
  payload: {
    email: string;
  };
}

export interface IFindUserSuccessAction {
  type: ContactActionTypes.FIND_USER_SUCCESS;
  payload: {
    searchResults: ISearchResult[];
  };
}

export interface IFindUserFailureAction {
  type: ContactActionTypes.FIND_USER_FAILURE;
}

export interface IaddToContactAction {
  type: ContactActionTypes.ADD_TO_CONTACT;
  payload: {
    id: string;
  };
}

export interface IaddToContactSuccessAction {
  type: ContactActionTypes.ADD_TO_CONTACT_SUCCESS;
  payload: {
    id: string;
  };
}

export interface IaddToContactFailureAction {
  type: ContactActionTypes.ADD_TO_CONTACT_FAILURE;
  payload: {
    id: string;
  };
}

export type ContactAction =
  | ILoadContactsAction
  | ILoadContactsSuccessAction
  | ILoadContactsFailureAction
  | IStartConversationAction
  | ISendMessageAction
  | IReceiveMessageAction
  | IStartVideoCallAction
  | IReceiveVideoCallAction
  | IReceiveIceCandidatesAction
  | IAcceptVideoCallAction
  | IAcceptedVideoCallAction
  | IEndCallAction
  | IFindUserAction
  | IFindUserSuccessAction
  | IFindUserFailureAction
  | IaddToContactAction
  | IaddToContactSuccessAction
  | IaddToContactFailureAction;
