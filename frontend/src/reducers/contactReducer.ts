import produce from 'immer';

import { ContactAction, ContactActionTypes } from '../actions/contactActions';
import { ApiStatus, ISearchResult } from '../models';

export const initialContactState: IContactState = {
  loadingStatus: ApiStatus.IN_PROGRESS,
  contactDetails: {},
  requests: {},
  contacts: [],
  selectedContact: '',
  messages: {},
  rtc: {
    inProgress: false,
    incoming: false,
    outgoing: false,
    accepted: false,
    recipient: '',
    offer: undefined,
    candidates: []
  },
  searchResults: [],
  searchStatus: ApiStatus.SUCCESS
};

export default function contactReducer(
  state: IContactState = initialContactState,
  action: ContactAction
): IContactState {
  return produce(state, draft => {
    switch (action.type) {
      case ContactActionTypes.LOAD_CONTACTS:
        draft.loadingStatus = ApiStatus.IN_PROGRESS;
        draft.contactDetails = {};
        draft.requests = {};
        draft.contacts = [];
        break;

      case ContactActionTypes.LOAD_CONTACTS_FAILURE:
        draft.loadingStatus = ApiStatus.FAILURE;
        break;

      case ContactActionTypes.LOAD_CONTACTS_SUCCESS:
        draft.loadingStatus = ApiStatus.SUCCESS;
        draft.contacts = action.payload.contacts.user.contacts || [];
        draft.requests = action.payload.contacts.user.requests || {};
        (action.payload.contacts.contactDetails || []).forEach(
          contactDetail => {
            draft.contactDetails[contactDetail.id] = contactDetail;
          }
        );
        break;

      case ContactActionTypes.START_CONVERSATION:
        draft.selectedContact = action.payload.id;
        break;

      case ContactActionTypes.SEND_MESSAGE:
        if (!draft.messages[action.payload.message.to]) {
          draft.messages[action.payload.message.to] = [];
        }
        draft.messages[action.payload.message.to].push(
          action.payload.message.message
        );
        break;

      case ContactActionTypes.RECEIVE_MESSAGE:
        if (!draft.messages[action.payload.message.from]) {
          draft.messages[action.payload.message.from] = [];
        }
        draft.messages[action.payload.message.from].push(
          action.payload.message.message
        );
        break;

      case ContactActionTypes.START_VIDEO_CALL:
        draft.rtc.inProgress = true;
        draft.rtc.incoming = false;
        draft.rtc.outgoing = true;
        draft.rtc.accepted = false;
        draft.rtc.recipient = draft.selectedContact;
        break;

      case ContactActionTypes.RECEIVE_VIDEO_CALL:
        draft.rtc.offer = action.payload.message.message.message;
        draft.rtc.recipient = action.payload.message.from;
        break;

      case ContactActionTypes.RECEIVE_ICE_CANDIDATES:
        draft.rtc.candidates.push(action.payload.message.message.message);
        if (action.payload.message.message.message === null) {
          draft.rtc.inProgress = true;
          draft.rtc.incoming = true;
          draft.rtc.outgoing = false;
          draft.rtc.accepted = false;
        }
        break;

      case ContactActionTypes.ACCEPT_VIDEO_CALL:
        draft.rtc.accepted = true;
        draft.rtc.offer = action.payload.message.message.message;
        break;

      case ContactActionTypes.ACCEPTED_VIDEO_CALL:
        draft.rtc.accepted = true;
        break;

      case ContactActionTypes.END_CALL:
        draft.rtc.inProgress = false;
        draft.rtc.incoming = false;
        draft.rtc.outgoing = false;
        draft.rtc.accepted = false;
        break;

      case ContactActionTypes.FIND_USER:
        draft.searchResults = [];
        draft.searchStatus = ApiStatus.IN_PROGRESS;
        break;

      case ContactActionTypes.FIND_USER_SUCCESS:
        draft.searchResults = action.payload.searchResults || [];
        draft.searchResults.forEach(r => {
          if (state.contacts && state.contacts.indexOf(r.id) !== -1) {
            r.inContact = true;
          }
        });
        draft.searchStatus = ApiStatus.SUCCESS;
        break;

      case ContactActionTypes.FIND_USER_FAILURE:
        draft.searchStatus = ApiStatus.SUCCESS;
        break;

      case ContactActionTypes.ADD_TO_CONTACT:
        draft.searchResults.forEach(r => {
          if (r.id === action.payload.id) {
            r.loading = true;
          }
        });
        break;

      case ContactActionTypes.ADD_TO_CONTACT_SUCCESS:
        draft.searchResults = [];
        break;

      case ContactActionTypes.ADD_TO_CONTACT_FAILURE:
        draft.searchResults.forEach(r => {
          if (r.id === action.payload.id) {
            r.loading = false;
          }
        });
        break;
    }
  });
}

export interface IContactState {
  contactDetails: { [key: string]: IContactDetail };
  contacts: string[];
  requests: { [key: string]: boolean };
  loadingStatus: ApiStatus;
  selectedContact: string;
  messages: { [key: string]: IMessage[] };
  rtc: IRTCState;
  searchResults: ISearchResult[];
  searchStatus: ApiStatus;
}

export interface IRTCState {
  inProgress: boolean;
  incoming: boolean;
  outgoing: boolean;
  offer: any;
  candidates: any[];
  recipient: string;
  accepted: boolean;
}

export interface IContactDetail {
  id: string;
  email: string;
  name: string;
}

export interface IMessage {
  message: string;
  incoming: boolean;
}
