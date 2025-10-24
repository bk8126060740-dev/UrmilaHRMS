export class GroupData {
    id: number = 0;
    groupName: string = "";
    description: string = "";
}

export class UserGroupModel {
    id: number = 0;
    userId: number = 0;
    userName: string = "";
    groupId: number = 0;
    groupName: string = "";
}

export class ScreenPermissionsGroupWise {
    screenId: number = 0;
    screenName: string = "";
    isPermission: boolean = false;
}

export class Permission {
    id: number = 0;
    permissionName: string = "";
    permissionType: string = "";
    description: string = "";
}

export class SubMenuData {
    mainMenuId: number = 0;
    menuName: string = "";
    subMenus: SubMenu[] = [];
}

export class SubMenu {
    groupScreenId: number = 0;
    subMenuId: number = 0;
    subMenuName: string = "";
    isMenu: boolean = false;
    menuPermissions: MenuPermission[] = [];
}

export class MenuPermission {
    permissionId: number = 0;
    permissionType: string = "";
    isPermission: boolean = false;
}


export class SaveData {
    groupScreenId: number = 0;
    screen: SaveScreen[] = [];
}

export class SaveScreen {
    id: number = 0;
    permission: SavePermission[] = [];
}

export class SavePermission {
    id: number = 0;
    isPermission: boolean = false;
}
