import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PermissionService } from '../../../../../../domain/services/permission.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import { GroupData, MenuPermission, Permission, SaveData, SavePermission, SaveScreen, ScreenPermissionsGroupWise, SubMenu, SubMenuData, UserGroupModel } from '../../../../../../domain/models/permission.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import swal from "sweetalert";
import { HttpParams } from '@angular/common/http';
import { EmployeeService } from '../../../../../../domain/services/employee.service';
import { EmployeeDropdown, UserDropdown } from '../../../../../../domain/models/project.model';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './user-permission.component.scss'
})
export class UserPermissionComponent implements OnInit {
  groupForm!: FormGroup;

  groupList: GroupData[] = [];
  permissionList: Permission[] = [];
  screenPermissionsList: ScreenPermissionsGroupWise[] = [];
  selectedGroup: number = 0;
  selectedGroupName: String = "";
  selectedMenuName: String = "";
  selectedMenu: number = 0;
  isSelectedMenu: boolean = false;
  subMenuList: SubMenu[] = [];
  menuPermissions: MenuPermission[] = [];
  saveData: SaveData = new SaveData();
  employeeDropdownData: EmployeeDropdown[] = [];
  employeeId: number = 0;
  assignedGroup: UserGroupModel[] = [];
  type: number = 0;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  @ViewChild('groupModel', { static: false }) public groupModel:
    | ModalDirective
    | undefined;


  constructor(
    private permissionService: PermissionService,
    private toaster: ToasterService,
    private fb: FormBuilder,
    private employeeServices: EmployeeService
  ) { }

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      id: [0],
      groupName: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.getGroup();
    this.getEmpDropdownData();
    this.getPermission();
  }

  getEmpDropdownData() {
    this.employeeServices
      .getEmployee<UserDropdown[]>(AppConstant.GET_EMPLOYEEDROPDOWN).subscribe({
        next: (data) => {
          this.employeeDropdownData = data.data;
          if (this.employeeDropdownData.length > 0) {
            if (this.employeeId == 0) {
              this.employeeId = this.employeeDropdownData[0].id;
              this.getUserWiseGroup();
            }
          }
        }
      });
  }

  onEmployeChanges(event: any) {
    this.employeeId = event.id;
    this.getUserWiseGroup();
  }

  async getUserWiseGroup() {
    if (this.employeeId)
      await this.permissionService.getAPI<UserGroupModel[]>(`${AppConstant.USER_GROUP}${this.employeeId}`).subscribe({
        next: (response: any) => {
          if (response.status == 200 && response.success) {
            this.assignedGroup = response.data;
            this.getGroup();
          } else {
            this.assignedGroup = [];
          }
        },
      });
  }

  async getGroup() {
    await this.permissionService.getAPI<GroupData[]>(AppConstant.POST_GROUP).subscribe({
      next: (response) => {
        this.groupList = response.data;
        if (this.groupList.length > 0) {
          this.selectedGroup = this.groupList[0].id;
          this.selectedGroupName = this.groupList[0].groupName;
          this.getScreenPermissionsGroupWise();
          this.groupList = this.groupList.filter(element => {
            return !this.assignedGroup.some(elementdata => elementdata.groupId === element.id);
          });
        }
      }
    });
  }

  async save() {
    if (this.type === 0) {
      this.toaster.warningToaster("Please select a valid group");
      return;
    }

    const data = new UserGroupModel();
    data.userId = this.employeeId;
    data.groupId = this.selectedGroup;

    const body = {
      userId: data.userId,
      groupIds: [data.groupId],
    };

    this.permissionService.postAPI<UserGroupModel[]>(AppConstant.POST_ASSIGN_USER, body).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.success) {
          this.toaster.successToaster(response.message);
        } else {
          this.toaster.warningToaster("Error: " + response.message);
        }
      }
    });
  }

  groupClick(groupData: any) {
    this.type = 1
    this.selectedGroup = groupData.id;
    this.selectedGroupName = groupData.groupName;
    this.getScreenPermissionsGroupWise();
  }

  assignedgroupClick(groupData: any) {
    this.type = 0;
    this.selectedGroup = groupData.id;
    this.selectedGroupName = groupData.groupName;
    this.getScreenPermissionsGroupWise();
  }

  editGroup(groupData: GroupData) {
    this.groupModel?.show();
    this.groupForm.patchValue({
      groupName: groupData.groupName,
      description: groupData.description,
      id: groupData.id
    });
  }

  postGroup() {
    if (this.groupForm.valid) {
      let body = this.groupForm.value;

      if (body.id == 0 || body.id == null) {
        this.permissionService.postAPI<GroupData>(AppConstant.POST_GROUP, body).subscribe({
          next: (response) => {
            if (response.status == 200 && response.success) {
              this.closeModel();
              this.getGroup();
              this.toaster.successToaster(response.message);
            } else {
              this.toaster.successToaster(response.message);
            }
          }
        })
      } else {
        this.permissionService.putAPI<GroupData>(AppConstant.POST_GROUP + "/" + body.id, body).subscribe({
          next: (response) => {
            if (response.status == 200 && response.success) {
              this.closeModel();
              this.getGroup();

              this.toaster.successToaster(response.message);
            } else {
              this.toaster.successToaster(response.message);
            }
          }
        })
      }

    }
  }

  onDeleteGroup(groupData: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.permissionService.deleteAPI<GroupData>(AppConstant.POST_GROUP + "/" + groupData.id).subscribe({
          next: (response) => {
            if (response.status == 200 && response.success) {
              this.closeModel();
              this.getGroup();

              this.toaster.successToaster(response.message);
            } else {
              this.toaster.successToaster(response.message);
            }
          }
        })
      } else {
        swal("Cancelled", "Your record is safe :)", "error");
      }
    });

  }

  closeModel() {
    this.groupModel?.hide();
    this.formDirective.resetForm();

  }

  async getScreenPermissionsGroupWise() {
    let param = new HttpParams()
      .set('GroupId', this.selectedGroup);
    await this.permissionService.getAPI<ScreenPermissionsGroupWise[]>(AppConstant.GET_GROUP_SCREENS, param).subscribe({
      next: (response) => {
        this.screenPermissionsList = response.data;
        if (this.screenPermissionsList.length > 0) {
          this.selectedMenu = this.screenPermissionsList[0].screenId;
          this.selectedMenuName = this.screenPermissionsList[0].screenName;
          this.isSelectedMenu = this.screenPermissionsList[0].isPermission;
          this.getScreenPermissions();
        }
      }
    });

  }

  getScreenSubMenuList(screen: ScreenPermissionsGroupWise) {
    this.selectedMenu = screen.screenId;
    this.selectedMenuName = screen.screenName;
    this.isSelectedMenu = screen.isPermission;
    this.getScreenPermissions();
  }

  async getScreenPermissions() {
    let params = new HttpParams()
      .set("GroupId", this.selectedGroup)
      .set("MainMenuId", this.selectedMenu);
    await this.permissionService.getAPI<SubMenuData>(AppConstant.GET_SUBSCREEN_PERMISION, params).subscribe({
      next: (response) => {
        this.subMenuList = response.data.subMenus;
      }
    })
  }

  isCheckboxChecked(menuPermissions: MenuPermission[], permissionId: any): boolean {
    let hasPermission: boolean = false;
    menuPermissions.forEach(element => {
      if (element.permissionId === permissionId) {
        hasPermission = true
      }
    });
    return hasPermission
  }

  onCheckBoxChange(screen: SubMenu, permissionTemp: Permission, event: any, i: number) {


    if (event.checked) {

      this.subMenuList[i].menuPermissions.push({
        permissionId: permissionTemp.id,
        permissionType: permissionTemp.permissionType,
        isPermission: event.checked
      })

    } else {
      const hasPermissionId1 = this.subMenuList.some(subMenu =>
        subMenu.menuPermissions.some(permission => permission.permissionId === permission.permissionId)
      );
      if (hasPermissionId1) {
        //   ...subMenu,

        this.subMenuList.forEach(subMenu => {
          subMenu.menuPermissions = subMenu.menuPermissions.filter(
            permission => permission.permissionId !== permissionTemp.id
          );
        });
      }
    }


  }
  onSwitchChange(screen: ScreenPermissionsGroupWise, event: any) {
    let body = {
      "groupId": this.selectedGroup,
      "mainScreenId": screen.screenId,
      "isActive": screen.isPermission
    }
    this.permissionService.postAPI<ScreenPermissionsGroupWise>(AppConstant.POST_PERMISSION_MAIN_MENU, body).subscribe({
      next: (response) => {
        if (response.status == 200 && response.success) {
          this.toaster.successToaster(response.message);
        } else {
          this.toaster.successToaster(response.message);
        }
      }
    })
  }

  async getPermission() {
    await this.permissionService.getAPI<Permission[]>(AppConstant.GET_PERMISSION).subscribe({
      next: (response) => {
        this.permissionList = response.data;
      }
    })
  }

  async submitPermission() {
    this.saveData = new SaveData();

    let saveScreen: SaveScreen = new SaveScreen();
    this.subMenuList.forEach(element => {
      let savePermission: SavePermission = new SavePermission();
      saveScreen.id = element.subMenuId;
      element.menuPermissions.forEach(per => {
        savePermission.id = per.permissionId;
        savePermission.isPermission = per.isPermission;
        saveScreen.permission.push(savePermission);
        savePermission = new SavePermission();
      });

      this.saveData.screen.push(saveScreen);
      saveScreen = new SaveScreen();

    });
    this.saveData.groupScreenId = this.subMenuList[0].groupScreenId


    await this.permissionService.postAPI<Permission>(AppConstant.SAVE_PERMISSION, this.saveData).subscribe({
      next: (response) => {
        this.saveData = new SaveData();
        if (response.status == 200 && response.success) {
          this.toaster.successToaster(response.message);
          this.getGroup();
          this.getPermission();
        } else {
          this.toaster.successToaster(response.message);
        }
      }
    })
  }

  assingEmployee() {

  }
}

