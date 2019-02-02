import produce from 'immer';

import { SidebarAction, SidebarActionTypes } from '../actions/sidebarActions';

export const initialSidebarState: ISidebarState = {
  open: true
};

export default function sidebarReducer(
  state: ISidebarState = initialSidebarState,
  action: SidebarAction
): ISidebarState {
  return produce(state, draft => {
    switch (action.type) {
      case SidebarActionTypes.TOGGLE_SIDEBAR:
        draft.open = !draft.open;
        break;

      default:
        break;
    }
  });
}

export interface ISidebarState {
  open: boolean;
}
