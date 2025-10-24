import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { EmployeeAttendanceService } from '../../../../../../domain/services/employeeattendance.service';
import { EmployeeAttendaceIdModel, EmployeeAttendanceUploadModeldata } from '../../../../../../domain/models/employeeAttendanceUpload.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { ToasterService } from '../../../../../../common/toaster-service';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CodeService } from '../../../../../../domain/services/code.service';
import { Code } from '../../../../../../domain/models/project.model';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';

@Component({
  selector: 'app-projectattendanceupload',
  templateUrl: './projectattendanceupload.component.html',
  styleUrl: './projectattendanceupload.component.scss'
})

export class ProjectattendanceuploadComponent {

  projectattendanceData: EmployeeAttendaceIdModel[] = [];
  UpdateProjectAttendanceStatus: EmployeeAttendanceUploadModeldata[] = [];
  pageNumber: number = 1;
  recode: number = 10;
  totalCount: number = 0;
  pojectAttendanceData: EmployeeAttendanceUploadModeldata = new EmployeeAttendanceUploadModeldata();
  projectAttendanceId: any;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  editingIndex: number | null = null;
  editingField: string | null = null;
  currentMonthYear!: string;
  @ViewChild("designationModel", { static: false }) public designationModel:
    | ModalDirective
    | undefined;
  designationList: Code[] = [];
  selectedDesignation: number = 0;
  selectedEmployeeId: number = 0;
  isColoumFilterVisible = false;
  isFilterVisible = false;
  recodeCount: number = 10;
  currentPage: number = 1;
  startItem: number = 0;
  endItem: number = this.recodeCount;
  dropdownSubscription: any;
  statusName: string = '';

  constructor(
    private projectattendanceService: EmployeeAttendanceService,
    private toaster: ToasterService,
    private route: Router,
    private codeService: CodeService,
    private cdRef: ChangeDetectorRef,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit() {

    const navigationState = history.state;
    if (navigationState) {
      this.pojectAttendanceData = navigationState.ProjectAttendanceData;
      this.statusName = this.pojectAttendanceData.statusName || '';
    }

    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.route.navigate(['attendance/dashboard'])
      }

    });

    this.getAllProjectAttendanceData();
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }

  getAllProjectAttendanceData(): void {

    const params = new HttpParams()
      .set('ProjectAttendanceId', this.pojectAttendanceData.id)
      .set('RecordCount', this.recode.toString())
      .set('PageNumber', this.pageNumber.toString())
      .set('FilterBy', this.searchTerm)
      .set('OrderBy', this.orderby)

    this.projectattendanceService.getEmployeeAttendanceUpload<EmployeeAttendaceIdModel[]>(AppConstant.GET_EMPLOYEEATTENDACEID, params).subscribe({
      next: (response: any) => {
        if (response) {
          this.projectattendanceData = response.data;
          this.projectattendanceData.forEach(element => {
            element.totalWorkingDays = this.pojectAttendanceData.totalWorkingDays;
            if (element.resultMessage === 75) {
              element.colorCode = '#FFFFFF'
            } else if (element.resultMessage === 84) {
              element.colorCode = '#f9c6b3b3'
            } else if (element.resultMessage === 86) {
              element.colorCode = '#fdeec9'
            } else if (element.resultMessage === 148) {
              element.colorCode = '#f9c6b3b3'
            }
          });
          this.totalCount = response.totalCount;
        }
      },
    });
  }

  updateDesignation(attendance: EmployeeAttendaceIdModel) {
    this.designationModel?.show();
    this.getAllDesignation();
    this.selectedEmployeeId = attendance.employeeId;
  }

  async getAllDesignation() {
    let obj = { codeTypeIds: AppConstant.GET_DESIGNATION };
    await this.codeService.getAllCodesByCodeTypesDropdownData(obj, AppConstant.GET_ALLCODESBYCODETYPES).subscribe({
      next: (response) => {
        this.designationList = response.data[0].codes;
      }
    })
  }
  onDesignationChange(event: any) {
    this.selectedDesignation = event.id;
  }


  onRecodeChange() {
    this.recode = this.recodeCount;
    this.currentPage = 1;
    this.calculateTotalPages();
    this.getAllProjectAttendanceData();
    this.cdRef.detectChanges();
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.startItem = (event.page - 1) * this.recode;
    this.endItem = this.totalCount < this.startItem + this.recode
      ? this.totalCount
      : this.startItem + this.recode;
    this.getAllProjectAttendanceData();
    this.cdRef.detectChanges();
  }

  calculateTotalPages() {
    this.totalCount = Math.ceil(this.recode / this.currentPage);
  }


  async updateEmployeeDesignation() {
    //
    if (this.selectedDesignation === 0 || this.selectedEmployeeId === 0) {
      this.toaster.warningToaster("You need to select Designation!!");
    } else {
      let obj = {
        designationId: this.selectedDesignation,
        employeeId: this.selectedEmployeeId
      }
      await this.projectattendanceService.postEmployeeDesignation<EmployeeAttendaceIdModel>(AppConstant.POST_EMPLOYEE_DESIGNATION, obj).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.successToaster(response.message);
            this.selectedDesignation = 0;
            this.selectedEmployeeId = 0;
            this.designationModel?.hide();
          } else {
            this.toaster.errorToaster(response.message);
          }
        }
      })
    }
  }

  startEditing(index: number, field: string): void {
    this.editingIndex = index;
    this.editingField = field;
  }

  saveRow(index: number): void {

    const project = this.projectattendanceData[index];
    const formData = new FormData();

    formData.append('Id', project.id?.toString());
    formData.append('EmployeeId', project.employeeId?.toString());
    formData.append('EmployeeName', project.employeeName);
    formData.append('TotalWorkingDays', project.totalWorkingDays?.toString());
    formData.append('PaidDays', project.paidDays?.toString());
    formData.append('NightDuty', project.nightDuty?.toString());
    formData.append('GHNHDuty', project.ghnhDuty?.toString());
    formData.append('DirelmentInHour', project.direlmentInHour?.toString());
    formData.append('Overtime', project.overtime?.toString());
    formData.append('ResultMessage', project.resultMessage?.toString());

    this.projectattendanceService.putEmployeeAttendanceUpload(formData, AppConstant.PUT_EMPLOYEEATTENDANCEUPDATE).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.editingIndex = null;
          this.editingField = null;
          this.getAllProjectAttendanceData();
        }
      }
    });
  }

  isRowNonEditable(project: any): boolean {
    return project.resultCodeMessage === 'Employee not exist.' && (this.statusName ? ['Approved', 'Rejected'].includes(this.statusName) : false)
      || project.resultCodeMessage === 'Employee Name & Designation both Mismatched.' && (this.statusName ? ['Approved', 'Rejected'].includes(this.statusName) : false)
      || project.resultCodeMessage === 'Employee Designation Mismatched.' && (this.statusName ? ['Approved', 'Rejected'].includes(this.statusName) : false)
      || (this.statusName ? ['Approved', 'Rejected'].includes(this.statusName) : false);
  }
  StatusChangeofAttendance(type: number) {
    let StatusId = type === 1 ? AppConstant.PROJECT_ATTENDANCE_APPROVE : AppConstant.PROJECT_ATTENDANCE_REJECT;
    const formData = new FormData();
    formData.append('Id', this.pojectAttendanceData.id.toString());
    formData.append('ProjectId', this.pojectAttendanceData.projectId.toString());
    formData.append('Month', this.pojectAttendanceData.month.toString());
    formData.append('Year', this.pojectAttendanceData.year.toString());
    formData.append('TotalWorkingDays', this.pojectAttendanceData.totalWorkingDays.toString());
    formData.append('StatusId', StatusId.toString());
    this.projectattendanceService.putProjectAttendanceStatus(formData, AppConstant.PUT_PROJECTATTENDANCESTATUS).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.route.navigate(['/attendance/dashboard']);
        }
      }
    });
  }

}
