import {
  ActionsObservable,
  combineEpics,
  StateObservable
} from 'redux-observable';
import { from, of } from 'rxjs';
import axios from '../axios';

import {
  addToContactFailure,
  addToContactSuccess,
  ContactAction,
  ContactActionTypes,
  findUserFailure,
  findUserSuccess,
  IaddToContactAction,
  IFindUserAction,
  ILoadContactsAction,
  loadContacts,
  loadContactsFailure,
  loadContactsSuccess
} from '../actions/contactActions';
import { sendMessage } from '../actions/socketActions';
import { IState } from '../reducers';

export const loadContactsEpic = (
  action$: ActionsObservable<ContactAction>,
  state$: StateObservable<IState>
) =>
  action$
    .ofType(ContactActionTypes.LOAD_CONTACTS)
    .mergeMap((action: ILoadContactsAction) =>
      from(axios.get('/users/contacts'))
        .map(response => loadContactsSuccess(response.data.data))
        .catch(() => of(loadContactsFailure()))
    );

export const findUserEpic = (
  action$: ActionsObservable<ContactAction>,
  state$: StateObservable<IState>
) =>
  action$
    .ofType(ContactActionTypes.FIND_USER)
    .debounceTime(1000)
    .mergeMap((action: IFindUserAction) =>
      from(axios.get(`/users/search?email=${action.payload.email}`))
        .map(response => findUserSuccess(response.data.data))
        .catch(() => of(findUserFailure()))
    );

export const addToContactEpic = (
  action$: ActionsObservable<ContactAction>,
  state$: StateObservable<IState>
) =>
  action$
    .ofType(ContactActionTypes.ADD_TO_CONTACT)
    .debounceTime(1000)
    .mergeMap((action: IaddToContactAction) =>
      from(axios.get(`/users/add?id=${action.payload.id}`))
        .mergeMap(response => [
          addToContactSuccess(action.payload.id),
          loadContacts(),
          sendMessage({
            type: ContactActionTypes.LOAD_CONTACTS,
            payload: {
              message: {
                to: action.payload.id,
                from: state$.value.auth.user['cognito:username'],
                message: {}
              }
            }
          })
        ])
        .catch(() => of(addToContactFailure(action.payload.id)))
    );

export default combineEpics(loadContactsEpic, findUserEpic, addToContactEpic);
