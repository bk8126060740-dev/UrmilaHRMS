import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { PermissionService } from '../../../../../../domain/services/permission.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import { GroupData, MenuPermission, Permission, SaveData, SavePermission, SaveScreen, ScreenPermissionsGroupWise, SubMenu, SubMenuData } from '../../../../../../domain/models/permission.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { group } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import swal from "sweetalert";
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './permission.component.scss',
})
export class PermissionComponent implements OnInit {
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
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);


  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  @ViewChild('groupModel', { static: false }) public groupModel:
    | ModalDirective
    | undefined;


  constructor(
    private permissionService: PermissionService,
    private toaster: ToasterService,
    private fb: FormBuilder, private route: Router
  ) { }

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      id: [0],
      groupName: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.getGroup();
    this.getPermission();
  }

  addGroup() {
    this.groupForm.patchValue({
      id: 0
    });
    this.groupModel?.show();
    this.formDirective.resetForm();

  }


  async getGroup() {
    await this.permissionService.getAPI<GroupData[]>(AppConstant.POST_GROUP).subscribe({
      next: (response) => {
        this.groupList = response.data;
        if (this.groupList.length > 0) {
          this.selectedGroup = this.groupList[0].id;
          this.selectedGroupName = this.groupList[0].groupName;
          this.getScreenPermissionsGroupWise();
        }
      }
    });
  }


  groupClick(groupData: GroupData) {
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

  onDeleteGroup(groupData: GroupData) {
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

    }
    else {
      this.subMenuList[i].menuPermissions = this.subMenuList[i].menuPermissions.filter(
        permission => permission.permissionId !== permissionTemp.id
      );
    }
    console.log("Updated Response:", JSON.stringify(this.subMenuList, null, 2));
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
    //
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


    if (this.saveData.groupScreenId != 0 && this.saveData.groupScreenId != null) {
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
    } else {
      this.toaster.warningToaster('Please select screen to assign permission');
    }
  }

  assingEmployee() {
    this.route.navigate(['/permission/user']);
  }
}

