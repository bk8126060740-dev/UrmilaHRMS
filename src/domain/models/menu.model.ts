
export class MenuDaum {
  id: number = 0;
  label: string = "";
  link: string = "";
  order: number = 0;
  parentMenuId: number = 0;
  text: string = "";
  class: string = "";
  subMenus: SubMenu[] = [];
  permissionId: number = 0;
  permissions: Permission[] = [];
  isActive: boolean = false;
  screenId: number = 0;
  isDeleted: boolean = false;
  isMenu: boolean = false;
  isOpen: boolean = false;
}

export class SubMenu {
  id: number = 0;
  label: string = "";
  link: string = "";
  order: number = 0;
  parentMenuId: number = 0;
  text: string = "";
  class: string = "";
  subMenus: SubMenu[] = [];
  permissionId: any
  permissions: Permission[] = [];
  isActive: boolean = false;
  screenId: any;
  isDeleted: boolean = false;
  isMenu: boolean = false;

}

export class Permission {
  id: number = 0;
  permissionName: string = "";
  type: string = "";
  description: string = "";
}
