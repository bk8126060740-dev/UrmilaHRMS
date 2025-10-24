import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpParams } from '@angular/common/http';
import { EmployeeAttendanceService } from '../../../../../../domain/services/employeeattendance.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import { AppConstant } from '../../../../../../common/app-constant';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FileHandle } from '../../../../../../directive/dragDrop.directive';
import { DomSanitizer } from '@angular/platform-browser';
import { EmployeeAttendanceUploadModeldata, ProjectAttendaceIdModel, statusCount } from '../../../../../../domain/models/employeeAttendanceUpload.model';
import { NavigationExtras, Router } from '@angular/router';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { SignalRService } from '../../../../../../common/signal-R.service';

@Component({
  selector: 'app-attandance',
  templateUrl: './attandance.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './attandance.component.scss'
})

export class AttandanceComponent {
  attendanceForm!: FormGroup;
  rowData: EmployeeAttendanceUploadModeldata[] = [];
  years: number[] = [];
  files: FileHandle[] = [];
  currentYear!: number;
  year: number[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  recode: number = 12;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  attendanceData: ProjectAttendaceIdModel[] = [];
  submitted = false;
  monthData = AppConstant.MONTH_DATA;
  daysInMonth = AppConstant.DAYSIN_MONTH
  projectAttendanceId: any;
  statusWithCounts: statusCount[] = [];
  selectedStatus: statusCount = new statusCount();
  projectName: string = '';
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  @Output() buttonClick = new EventEmitter<{ type: string, action: string }>();

  @ViewChild("codemodel", { static: false }) public codemodel: | ModalDirective | undefined;
  @ViewChild("attendancemodel", { static: false }) public attendancemodel: | ModalDirective | undefined;
  @ViewChild("attendancemodelData", { static: false }) public attendancemodelData: | ModalDirective | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;

  yearsList: { label: string, value: number }[] = [];
  selectedYear: number = new Date().getFullYear();
  columns = [
    {
      field: "srNo",
      displayName: "Sr No",
      sortable: true,
      filterable: false,
      visible: true,
      fixVisible: true,
      searchable: true
    },
    {
      field: "monthName",
      displayName: "Month",
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: "year",
      displayName: "Year",
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: "totalWorkingDays",
      displayName: "Total Working Days",
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: "statusName",
      displayName: "Status",
      sortable: true,
      filterable: true,
      visible: true,
      isColor: true,
      fixVisible: true,
      isCenter: true,
      searchable: true

    }, {
      field: "",
      displayName: "View Details",
      sortable: false,
      filterable: false,
      visible: true,
      isCenter: true,
      viewButton: true,
      searchable: true,
      fixVisible: true

    }, {
      field: "",
      displayName: "View File",
      button: true,
      icon: 'FileDownload',
      sortable: false,
      filterable: false,
      visible: true,
      isCenter: true,
      searchable: true,
      fixVisible: true,
      FileDownload: false
    }
  ];

  dropdownSubscription: any;
  constructor(
    private toaster: ToasterService,
    private formBuilder: FormBuilder,
    private employeeattendanceService: EmployeeAttendanceService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService,
    private signalRService: SignalRService
  ) { }

  ngOnInit() {
    this.projectName = this.localStorageService.getItem(AppConstant.PROJECTNAME) ?? '';
    this.signalRService.on('AttendanceProcessed', (message: string) => {
      // 
      this.getEmployeeAttendanceUploadData();

    });
    this.currentYear = new Date().getFullYear();
    this.years = this.getYearsList();
    this.updateDaysInMonthForYear(this.currentYear);

    const currentMonth = new Date().getMonth() + 1;
    this.attendanceForm = this.formBuilder.group({
      syncType: ['1', Validators.required],
      filename: ['', Validators.required],
      description: [''],
      month: [currentMonth, Validators.required],
      year: [this.currentYear, Validators.required],
      totalWorkingDays: ['', Validators.required]
    });

    this.attendanceForm.get('month')?.valueChanges.subscribe((month: number) => {
      this.attendanceForm.patchValue({
        totalWorkingDays: this.getDaysInMonth(this.attendanceForm.get('year')?.value, month)
      });
    });

    this.attendanceForm.get('year')?.valueChanges.subscribe((year: number) => {
      this.updateDaysInMonthForYear(year);
      const selectedMonth = this.attendanceForm.get('month')?.value;
      this.attendanceForm.patchValue({
        totalWorkingDays: this.getDaysInMonth(year, selectedMonth)
      });
    })

    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.getEmployeeAttendanceUploadData();
      }

    });
    this.getPayrollYears();
    this.getEmployeeAttendanceUploadData();
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }

  getPayrollYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 5; year <= currentYear; year++) {
      this.yearsList.push({ label: year.toString(), value: year });
    }
  }

  onYearChange(event: any): void {
    const YearObj = {
      year: this.selectedYear,
    };
    this.getEmployeeAttendanceUploadData();
  }

  async onStatusCardClick(status: any, event: any) {
    this.searchTerm = "";

    this.selectedStatus = status;
    if (status.name == "Total Records") {
      this.getEmployeeAttendanceUploadData();
    } else {
      this.searchTerm = `statusId eq ${status.id}`;
      await this.getEmployeeAttendanceUploadData();
    }
  }

  getYearsList(): number[] {
    const years = [];
    for (let i = this.currentYear - 1; i <= this.currentYear; i++) {
      years.push(i);
    }
    return years;
  }

  daysInMonthByYear: { [year: number]: number[] } = {};

  updateDaysInMonthForYear(year: number) {
    if (!this.daysInMonthByYear[year]) {
      this.daysInMonthByYear[year] = [];
    }
    for (let month = 1; month <= 12; month++) {
      this.daysInMonthByYear[year][month] = this.getDaysInMonth(year, month);
    }
  }

  getDaysInMonth(year: number, month: number): number {
    if (month === 2) {
      return this.isLeapYear(year) ? 29 : 28;
    }
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      return 31;
    }
    return 30;
  }

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
  }

  maxDayValidator(control: any): { [key: string]: boolean } | null {
    const year = this.attendanceForm?.get('year')?.value;
    const month = this.attendanceForm?.get('month')?.value;
    const totalDaysInMonth = this.getDaysInMonth(year, month);
    if (control.value > totalDaysInMonth) {
      return { 'maxDayExceeded': true };
    }
    return null;
  }

  EmployeeAttendancedownloadFile(row: any) {
    let file_name = '';
    if (row.toString().includes('Archive')) {
      file_name = 'exported-sucess'
    } else if (row.toString().includes('ErrorFiles')) {
      file_name = 'exported-error'
    } else if (row.toString().includes('EmployeeAttendanceTemplate')) {
      if (this.projectName === 'undefined') {
        this.projectName = this.localStorageService.getItem(AppConstant.PROJECTNAME) ?? '';
      }
      file_name = this.projectName.toUpperCase() + '_Employee_Attendance_Template'
    }
    let params = new HttpParams().set('filePath', row);
    this.employeeattendanceService.getEmployeeAttendanceFile(AppConstant.GET_EMPLOYEEATTENDANCEDOWNLOADUPLOADEDFILE, params).subscribe({
      next: (response: Blob) => {
        this.downloadFile(response, file_name);
      }
    })
  }

  downloadFile(blob: Blob, file_name: any) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file_name + '.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  onAddattendanceUpload() {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    this.attendancemodel?.show();

    this.attendanceForm.reset({
      syncType: '1',
      filename: '',
      description: '',
      month: currentMonth,
      year: currentYear,
      totalWorkingDays: this.getDaysInMonth(currentYear, currentMonth),
    });
    this.submitted = false;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (file.size > AppConstant.FILE5MB) {
        this.toaster.errorToaster(`File "${file.name}" exceeds the size limit of 5MB.`);
      } else {
        this.files = [];
        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        const name = file.name;
        if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
          this.files.push({ file, url, name });
        } else {
          this.toaster.warningToaster('We allow only excel file for Upload!!')
        }
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.files.length === 0) {
      if (this.attendanceForm.value.syncType === '1') {
        this.toaster.warningToaster('No file selected. Please choose a file to upload.');
        return;
      } else {

        const data = this.attendanceForm.value;

        let obj = {
          "month": data.month,
          "year": data.year,
          "description": data.description,
          "totalWorkingDays": data.totalWorkingDays
        }
        await this.employeeattendanceService.postEmployeeAttendanceUpload(obj, AppConstant.POST_EMPLOYEE_ATTENDANCE_SYNC).subscribe({
          next: (response) => {
            if (response.status === 200 && response.success) {
              this.toaster.successToaster(response.message);
              this.files = [];
              this.attendancemodel?.hide();
              this.formDirective.resetForm();
              this.getEmployeeAttendanceUploadData();
            }
          }
        });


      }
    } else {
      let formData = new FormData();
      const data = this.attendanceForm.value;
      if (this.files[0].file) {
        formData.append('File', this.files[0].file);
        formData.append('Description', data.description);
        formData.append('Month', data.month);
        formData.append('Year', data.year);
        formData.append('TotalWorkingDays', data.totalWorkingDays);

        await this.employeeattendanceService.postEmployeeAttendanceUpload(formData, AppConstant.POST_EMPLOYEEATTENDANCEDOWNLOADUPLOADEDFILE).subscribe({
          next: (response) => {
            if (response.status === 200 && response.success) {
              this.toaster.successToaster(response.message);
              this.files = [];
              this.attendancemodel?.hide();
              this.formDirective.resetForm();
              this.getEmployeeAttendanceUploadData();
            }
          }
        });
      }
    }
  }

  async getEmployeeAttendanceUploadData() {


    let params = new HttpParams()
      .set("Year", this.selectedYear)
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    await this.employeeattendanceService.getEmployeeAttendanceUpload<EmployeeAttendanceUploadModeldata[], statusCount[]>(AppConstant.GET_EMPLOYEEATTENDANCEUPLOADEDDATA, params).subscribe({
      next: (response: any) => {
        if (response) {

          this.rowData = response.data.projectAttendance.map((item: EmployeeAttendanceUploadModeldata) => ({
            ...item,
            monthName: AppConstant.MONTH_DATA.find(month => month.id === item.month)?.monthName,
            statusColorCode: this.getStatusColorCode(item.statusId)
          }))

          let previouslySelected = this.selectedStatus ? { ...this.selectedStatus } : null;

          this.statusWithCounts = [];
          const totalRecordStatus = new statusCount();
          totalRecordStatus.count = response.data.statusCount;
          totalRecordStatus.id = 0;
          totalRecordStatus.name = "Total Records";

          this.statusWithCounts.push(totalRecordStatus);
          this.totalCount = response.data.totalCount;



          response.data.statusWithCounts.forEach((element: any) => {
            this.statusWithCounts.push(element);
          });
          if (previouslySelected) {
            this.selectedStatus = this.statusWithCounts.find(s => s.name === previouslySelected.name) || totalRecordStatus;
          }
          this.totalCount = response.data.totalCount;
        }
        else {
          this.rowData = [];
        }
      }
    });
  }
  getStatusColorCode(statusId: number) {
    switch (statusId) {
      case 179: return '#EF9153';
      case 191: return '#F9B101';
      case 178: return '#59AAAA';
      default: return '#4285F4'; 
    }
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }

  handleFileSizeErrors(errors: string[]) {
    errors.forEach(error => {
      this.toaster.errorToaster(error);
    });
  }

  triggerProfileFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  removeFile() {
    this.files = [];
  }

  employeeDownloadFiles(employee: any) {

    AppConstant.getDownloadFile(employee.fileName)

  }





  onSearch(event: any) {
    this.searchTerm = event.toLowerCase().trim();

    const monthMap: { [key: string]: number } = {
      january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
      july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
      jan: 1, feb: 2, mar: 3, apr: 4, jun: 6,
      jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };

    let matched = false;

    const monthNameMatch = this.searchTerm.match(/monthname\.contains\(['"]?([a-zA-Z0-9]+)['"]?\)/i);

    if (monthNameMatch && monthNameMatch[1]) {
      const value = monthNameMatch[1].toLowerCase();

      if (!isNaN(+value)) {
        this.searchTerm = `month eq ${value}`;
        matched = true;
      } else if (monthMap[value]) {
        this.searchTerm = `month eq ${monthMap[value]}`;
        matched = true;
      }
    }

    
    if (!matched) {
      const match = this.searchTerm.match(/\d+/);
      if (match) {
        if (this.searchTerm.includes('year')) {
          this.searchTerm = `year eq ${match[0]}`;
          matched = true;
        } else if (this.searchTerm.includes('totalworkingdays')) {
          this.searchTerm = `totalWorkingDays eq ${match[0]}`;
          matched = true;
        }
      }
    }



    const match = this.searchTerm.match(/\d+/);
    if (match) {
      if (this.searchTerm.includes('year')) {
        this.searchTerm = `year eq ${match[0]}`;
      }
      else if (this.searchTerm.includes('totalworkingdays')) {
        this.searchTerm = `totalWorkingDays eq ${match[0]}`;
      }
      this.getEmployeeAttendanceUploadData();
    } else {
      this.toaster.warningToaster('Enter proper Value in Serch')
    }
    this.getEmployeeAttendanceUploadData();
  }

  onPageChange(page: any) {
    this.pageNumber = page;
    this.getEmployeeAttendanceUploadData();
  }

  onTotalEmployeeAttendanceValueChange(totalDepartment: any) {
    this.recode = totalDepartment;
    this.pageNumber = 1;
    this.getEmployeeAttendanceUploadData();
  }

  orderBy(event: any) {
    this.orderby = event;
    this.getEmployeeAttendanceUploadData();
  }

  async viewFile(projectAttendanceId: any) {
    let params = new HttpParams()
      .set("ProjectAttendanceId", projectAttendanceId.id)

    await this.employeeattendanceService.getEmployeeAttendanceUpload<ProjectAttendaceIdModel[]>(AppConstant.GET_PROJECTATTENDACEID, params).subscribe({
      next: (responce: any) => {
        if (responce && responce.data) {
          this.attendanceData = responce.data.map((element: ProjectAttendaceIdModel) => {
            let newData: ProjectAttendaceIdModel = {
              ...element,
              displayedFile: AppConstant.getActualFileName(element.fileName)
            }
            return newData
          });

          this.attendancemodelData?.show();
        }
      }
    });
  }

  viewRecord(row: any) {

    const navigationExtras: NavigationExtras = {
      state: {
        ProjectAttendanceData: row
      },
    };
    this.router.navigate(['/attendance/attendaceupload'], navigationExtras);
  }

  onEdit(event: MouseEvent) {
  }

  onInsert() {
    this.codemodel?.show();
  }

  downloadErrorFile(errorFileUrl: string) {
    if (errorFileUrl) {
      window.open(errorFileUrl, '_blank');
    } else {
      this.toaster.errorToaster('No error file available.');
    }
  }

}
