import {
  Component,
  HostListener,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { AuthenticationService } from "../../../../../domain/services/authentication.service";
import { RecruitmentService } from "../../../../../domain/services/recruitment.service";
import { AppConstant } from "../../../../../common/app-constant";
import { ProjectDropdown } from "../../../../../domain/models/recruitment.model";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { HttpParams } from "@angular/common/http";
import { ToasterService } from "../../../../../common/toaster-service";
import { HeaderDropdownService } from "../../../../../domain/services/header-dropdown.service";
import swal from "sweetalert";
import { LocalStorageService } from "../../../../../common/local-storage.service";
import { SignalRService } from "../../../../../common/signal-R.service";
import { NotificationModel } from "../../../../../domain/models/notification.model";
import { re } from "mathjs";
import { GrantPermissionService } from "../../../../../domain/services/permission/is-granted.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { EmployeeAttendanceService } from "../../../../../domain/services/employeeattendance.service";
import { EmployeeDesignationHistoryService } from "../../../../../domain/services/employeedesignationhistory.service";
import { JwtService } from "../../../../../common/jwtService.service";
import { EmployeeData } from "../../../../../domain/models/attendance.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  isDropdownOpen: boolean = false;
  private isThemeSettingOpen: boolean = false;
  projectDropdownData: ProjectDropdown[] = [];
  selectedProject: number = -1;
  tempSelectedProject: number = -1;
  isPermission: boolean = false;
  isCheckIn: boolean = false;
  isCheckedIn: boolean = false;
  employeeId: number = 0;
  inTime: string = '';
  outTime: string = '';

  userName: string = "";
  name: string = "";
  firstName: string = "";
  profilePic = "";
  asName = "";
  private hubUrl = 'https://yourserver.com/signalr-hub'; 
  notificationData: NotificationModel[] = [];
  baseUrl = AppConstant.BASE_IMAGEURL + "uploads/"
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  showProjectName: boolean = true
  passwordHide: boolean = true;
  newPasswordHide: boolean = true;
  conNewPasswordHide: boolean = true;
  employeeData: EmployeeData = new EmployeeData();
  imageLoadError: boolean = false;

  changePasswordForm!: FormGroup;

  @ViewChild("notificationModel") public notificationModel:
    | ModalDirective
    | undefined;

  @ViewChild("changePasswordModel") public changePasswordModel:
    | ModalDirective
    | undefined;

  constructor(
    private recruitmentService: RecruitmentService,
    private eRef: ElementRef,
    private authenticationService: AuthenticationService,
    private toaster: ToasterService,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService,
    private signalRService: SignalRService,
    private grantPermissionService: GrantPermissionService,
    private router: Router,
    private projectattendanceService: EmployeeDesignationHistoryService,
    private jwtService: JwtService,
    private fb: FormBuilder,
    private employeeAttendanceService: EmployeeAttendanceService,
  ) {
    let theme = this.localStorageService.getItem(AppConstant.APP_THEME) ?? 'skyBlue';
    document.documentElement.setAttribute("theme", theme);

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator]]
    }, { validator: this.passwordMatchValidator });
  }

  onImageError(): void {
    this.employeeData.profilePath = '';
  }

  async getEmployeeProfilePic() {
    this.employeeAttendanceService.getEmployeeAttendanceUpload<EmployeeData>(AppConstant.GET_EMPLOYEE_ID).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.employeeData = response.data;
          this.asName = this.employeeData.fullName;
          this.asName = this.asName.split(' ').map(word => word[0]?.toUpperCase()).join('');
          this.localStorageService.setItem("profilePic", this.employeeData.profilePath);
        } else {
          this.profilePic = this.localStorageService.getItem("profilePic");
        }
      }
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    if (newPassword?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }

  changePassword() {
    if (this.changePasswordForm.valid) {

      let obj = {
        "userId": this.jwtService.getNameIdentifier(),
        "oldPassword": this.changePasswordForm.value.currentPassword,
        "newPassword": this.changePasswordForm.value.newPassword
      }

      this.authenticationService.put(AppConstant.PUT_PASSWORD, obj).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.successToaster(response.message);
            this.closeChangePasswordModel();
          } else {
            this.toaster.errorToaster(response.message);
          }
        }
      })
    }
  }

  ngOnInit(): void {

    this.getEmployeeProfilePic();
    this.signalRService.requestNotificationPermission();
    this.signalRService.startConnection(this.hubUrl);
    this.asName = this.localStorageService.getItem("fullName");
    this.asName = this.asName.split(' ').map(word => word[0]?.toUpperCase()).join('');
    this.signalRService.on('ReceiveMessage', (message: string) => {
      

      if (message != 'You are connected.') {
        this.toaster.successToaster(message);
        this.signalRService.showNotification('Nirghosh App', message);
        this.getNotificationData();
      }

    });

    this.signalRService.on('PayrollProcessed', (message: string) => {
      this.signalRService.showNotification('Nirghosh App', message);
      this.getNotificationData();
    });

    this.signalRService.on('BulkEmployeeProcessed', (message: string) => {
      this.signalRService.showNotification('Nirghosh App', message);
      this.getNotificationData();
    });

    this.signalRService.on('AttendanceProcessed', (message: string) => {
      this.signalRService.showNotification('Nirghosh App', message);
      this.getNotificationData();
    });



    const noProjectNameRoutes = [
      '/client/dashboard',
      '/client/create',
      '/master/attribute',
      '/master/Mstdepartment',
      '/project/dashboard',
      '/project/attribute',
      '/project/create',
      '/onboard/dashboard',
      '/project/attributeCreate',
      '/reporting/dashboard',
      '/paymentin/received',
      '/permission/dashboard',
      '/master/Mstdesignation',
      '/dashboard',
      '/master/bankmaster',
      '/compliance/pfcontribution-report',
      '/compliance/pfdashboard',
      '/compliance/report',
      '/payroll/bank-sheet-report',
      '/payroll/bank-sheet-list'
    ];

    
    this.showProjectName = !noProjectNameRoutes.includes(this.router.url);

    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showProjectName = !noProjectNameRoutes.includes(event.urlAfterRedirects);
      }
    });





    this.getProjectDropdownData();
    this.getNotificationData();
    const storedCheckInStatus = this.localStorageService.getItem('isCheckIn');
    this.isCheckIn = storedCheckInStatus === 'true';
  }

  async showNotificationData() {
    this.notificationModel?.show();
    this.getNotificationData();
  }


  openChangePasswordModel() {
    this.changePasswordModel?.show();
  }

  closeChangePasswordModel() {
    location.reload();
  }


  async getNotificationData() {
    let params = new HttpParams()
      .set('count', 10)
      .set('status', 190)
    this.authenticationService.getNotification(AppConstant.NOTIFICATION, params).subscribe({
      next: (response) => {
        if (response.status === 200 && response.success) {
          this.notificationData = response.data;
        } else {
          this.notificationData = [];
        }
      }
    })

  }

  readMessage(type: number, item: any) {


    let obj;
    if (type === 0) {
      obj = {
        "id": null
      }
    } else {
      obj = {
        "id": item.id
      }
    }
    this.authenticationService.readNotification(AppConstant.NOTIFICATION, obj).subscribe({
      next: (response) => {
        this.getNotificationData();
      }
    })

  }

  checkConnectionState(): void {
    const state = this.signalRService.getConnectionState();

  }

  onProjectChange(event: any) {
    
    swal({
      title: "Are you sure?",
      text: "You are about to switch project. Any unsaved changes will be lost!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete: any) => {
      if (willDelete) {
        this.selectedProject = event.id;
        this.tempSelectedProject = this.selectedProject;

        this.setProject();
      } else {
        this.selectedProject = this.tempSelectedProject;
      }
    });
  }

  setTheme(color: string) {
    this.localStorageService.setItem(AppConstant.APP_THEME, color);
    if (color === "blue") {
      document.documentElement.setAttribute("theme", "blue");
    } else if (color === "orange") {
      document.documentElement.setAttribute("theme", "orange");
    } else if (color === "skyBlue") {
      document.documentElement.setAttribute("theme", "skyBlue");
    } else if (color === "purple") {
      document.documentElement.setAttribute("theme", "purple");
    } else if (color === "green") {
      document.documentElement.setAttribute("theme", "green");
    } else if (color === "red") {
      document.documentElement.setAttribute("theme", "red");
    } else if (color === "Turquoise_Blue") {
      document.documentElement.setAttribute("theme", "Turquoise_Blue");
    } else if (color === "gradient") {
      document.documentElement.setAttribute("theme", "gradient");
    }
  }

  menuOpen(event: MouseEvent): void {
    event.stopPropagation();
    const sideBar = document.querySelector(".side-bar") as HTMLElement;
    const header = document.querySelector(".header-main") as HTMLElement;
    const mainBorad = document.querySelector(".mainDash") as HTMLElement;
    sideBar.style.transition = ".3s";
    header.style.transition = ".3s";
    mainBorad.style.transition = ".3s";
    if (sideBar && header) {
      sideBar.classList.toggle("menu-collapsed");
      header.classList.toggle("menu-collapsed");
      mainBorad.classList.toggle("menu-collapsed");
    }
  }

  themeChanger(event: MouseEvent): void {
    event.stopPropagation();
    this.isThemeSettingOpen = !this.isThemeSettingOpen;
    const settingIcon = document.querySelector(
      ".theme-color-setting"
    ) as HTMLElement;
    if (settingIcon) {
      settingIcon.classList.toggle("open", this.isThemeSettingOpen);
    }
    const proDrop = document.querySelector(".profile-dropdown") as HTMLElement;
    if (proDrop) {
      proDrop.classList.remove("show");
    }
  }

  openProfile(event: MouseEvent): void {
    event.stopPropagation();
    this.isThemeSettingOpen = !this.isThemeSettingOpen;
    const settingIcon = document.querySelector(
      ".profile-setting"
    ) as HTMLElement;
    if (settingIcon) {
      settingIcon.classList.toggle("open", this.isThemeSettingOpen);
    }
    const proDrop = document.querySelector(".profile-dropdown") as HTMLElement;
    if (proDrop) {
      proDrop.classList.remove("show");
    }
  }


  profileMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    const proDrop = document.querySelector(".profile-dropdown") as HTMLElement;
    if (proDrop) {
      proDrop.classList.toggle("show", this.isDropdownOpen);
    }
    const settingIcon = document.querySelector(
      ".theme-color-setting"
    ) as HTMLElement;
    if (settingIcon) {
      settingIcon.classList.remove("open");
    }
  }

  closeprofileMenu() {
    const proDrop = document.querySelector(".profile-dropdown") as HTMLElement;
    if (proDrop) {
      proDrop.classList.remove("show");
    }
    const settingIcon = document.querySelector(
      ".theme-color-setting"
    ) as HTMLElement;
    if (settingIcon) {
      settingIcon.classList.remove("open");
    }
  }

  logout() {
    swal({
      title: "Are you sure?",
      text: "You want to log out?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((logout: any) => {
      if (logout) {
        this.authenticationService.logout();
      }
    });

  }

  async getProjectDropdownData() {
    interface CustomJwtPayload {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"?: string;
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"?: string;
      jti?: string;
      exp?: number;
      iss?: string;
      aud?: string;
      ProjectId?: string;
    }

    let loginToken = this.authenticationService?.currentTokenValue;

    if (loginToken) {
      if (
        loginToken.expiresIn &&
        Date.now() > Date.now() + loginToken.expiresIn
      ) {
        this.authenticationService.logout();
      }
      const token = loginToken.token;
      const decoded = jwtDecode<CustomJwtPayload>(token);

      this.firstName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] : "";
      this.name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] : "";
      this.userName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] : "";
      const strSelectedProject = decoded.ProjectId ? decoded.ProjectId : "-1";
      this.selectedProject = parseInt(strSelectedProject);
      this.tempSelectedProject = parseInt(strSelectedProject);
      this.headerDropdownService.updateDropdownValue(this.selectedProject); 
      this.localStorageService.setItem(AppConstant.PROJECTID, this.selectedProject);
      this.localStorageService.setItem(AppConstant.PROJECTNAME, this.projectDropdownData.find(x => x.id === this.selectedProject)?.name);


    }
    await this.recruitmentService.getProjectDropdownData(`${AppConstant.GET_PROJECTDROPDOWN + "/" + this.localStorageService.getItem('userId')}`).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.projectDropdownData = response.data;
          if (this.selectedProject === -1) {
            this.selectedProject = this.projectDropdownData[0].id;
            this.tempSelectedProject = this.selectedProject;
            setTimeout(() => {
              this.setProject();
            }, 100);
          } else {
            this.headerDropdownService.updateDropdownValue(this.selectedProject); 
            this.localStorageService.setItem(AppConstant.PROJECTID, this.selectedProject);
            this.localStorageService.setItem(AppConstant.PROJECTNAME, this.projectDropdownData.find(x => x.id === this.selectedProject)?.name);

          }

        }
      },
    });


    (await this.grantPermissionService.hasSpecialPermission("Write", 44)).subscribe({
      next: (responce) => {
        this.isPermission = responce;
      }
    })
  }

  async setProject() {
    if (this.selectedProject != -1) {
      let params = new HttpParams().append("projectId", this.selectedProject);
      await this.authenticationService.setProject(params, AppConstant.SETPROJECT).subscribe({
        next: (response) => {
          this.headerDropdownService.updateDropdownValue(this.selectedProject); 
          this.localStorageService.setItem(AppConstant.PROJECTID, this.selectedProject);
          this.localStorageService.setItem(AppConstant.PROJECTNAME, this.projectDropdownData.find(x => x.id === this.selectedProject)?.name);
        },
        error: (error) => {
          
          this.toaster.errorToaster("An error occurred while setting the project."); 
        },
      });
    } else {
    }
  }

  
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.eRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      if (this.isDropdownOpen) {
        this.profileMenu(event);
      }
      if (this.isThemeSettingOpen) {
        this.themeChanger(event);
      }
    }
  }

  async checkIn() {
    if (!this.employeeId) {
      await this.getEmployeeId();
    }
    if (!this.employeeId) {
      this.toaster.errorToaster('Invalid Employee ID. Cannot check in.');
      return;
    }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.inTime = `${hours}:${minutes}:${seconds}`;

    let obj = {
      employeeId: this.employeeId,
      attendanceDate: now.toISOString(),
      inTime: this.inTime,
      outOnDutyStatus: true
    };
    this.submitcheckInOut(obj);
  }

  async checkOut() {
    if (!this.isCheckIn) {
      this.toaster.errorToaster('You must check in first!');
      return;
    }
    if (!this.employeeId) {
      await this.getEmployeeId();
    }
    if (!this.employeeId) {
      this.toaster.errorToaster('Invalid Employee ID. Cannot check out.');
      return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.outTime = `${hours}:${minutes}:${seconds}`;

    let obj = {
      employeeId: this.employeeId,
      attendanceDate: now.toISOString(),
      outTime: this.outTime,
      outOnDutyStatus: true
    };
    this.submitcheckInOut(obj);
  }

  toggleCheckInOut() {
    if (this.isCheckedIn) {
      this.checkOut();
    } else {
      this.checkIn();
    }
    this.isCheckedIn = !this.isCheckedIn;
  }

  async submitcheckInOut(obj: any) {
    await this.projectattendanceService.postEmployeeDesignationHistory(obj, AppConstant.POST_CHECK_IN_OUT).subscribe({
      next: (response) => {
        if (response.success) {
        } else {
          this.toaster.errorToaster(response.message);
        }
      }
    })
  }

  async getEmployeeId() {
    return new Promise<void>((resolve, reject) => {
      this.projectattendanceService.getEmployeeDesignationHistory(AppConstant.GET_EMPLOYEE_ID).subscribe({
        next: (response: any) => {
          if (response.success && response.data?.employeeId) {
            this.employeeId = response.data.employeeId;
            resolve();
          } else {
            this.toaster.errorToaster('Failed to fetch Employee ID');
            reject();
          }
        }
      });
    });
  }

  async showCheckinoutRecord() {
    this.router.navigate(['/attendance/employeeattendace']);
 }

}
