export enum SidebarActionTypes {
  TOGGLE_SIDEBAR = 'sidebar/toggleSidebar'
}

export function toggleSidebar(): IToggleSidebar {
  return { type: SidebarActionTypes.TOGGLE_SIDEBAR };
}

export interface IToggleSidebar {
  type: SidebarActionTypes.TOGGLE_SIDEBAR;
}

export type SidebarAction = IToggleSidebar;
