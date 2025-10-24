import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { AppConstant } from "../../../../../../common/app-constant";
import { ProjectService } from "../../../../../../domain/services/project.service";
import { GlobalConfiguration } from "../../../../../../common/global-configration";
import { ProjectHolidayCalenderDaum } from "../../../../../../domain/models/projectHolidayCalender.model";
import { projectHolidayCalenderService } from "../../../../../../domain/services/projectHolidayCalender.service";
import { ToastrService } from "ngx-toastr";
import { HttpParams } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import swal from "sweetalert";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { ModalDirective } from "ngx-bootstrap/modal";
import { FilterService } from "../../../../../../domain/services/filter.service";
import { Data } from "../../../../../../domain/models/filter.model";
import { HeaderDropdownService } from "../../../../../../domain/services/header-dropdown.service";
import { LocalStorageService } from "../../../../../../common/local-storage.service";

@Component({
  selector: "app-project-holiday",
  templateUrl: "./project-holiday.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrl: "./project-holiday.component.scss",
})
export class ProjectHolidayComponent implements OnInit {
  projects: any[] = [];
  onEditButton: boolean = false;
  holidayTypes: any[] = [];
  weekOff: any[] = [];
  pageNumber: number = 1;
  holidayPerPage: number = 10;
  selectedProjectId: number = 0;
  searchTerm: string = "";
  totalCount: number = 0;
  selectedProjectName: string = "";
  rowData: ProjectHolidayCalenderDaum[] = [];
  filterData: Data[] = [];
  projectHolidayCalenderModel: ProjectHolidayCalenderDaum =
    new ProjectHolidayCalenderDaum();
  today = new Date();
  dateFilter = (date: Date | null): boolean => {
    const currentDate = new Date();
    // Disable dates before today
    return date ? date >= currentDate : false;
  };
  columns = [

    {
      field: "holidayType",
      displayName: "Type",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true
    },
    {
      field: "weeklyOffList",
      displayName: "Days",
      sortable: false,
      filterable: false,
      visible: true,
      searchable: true
    },
    {
      field: "formattedDate",
      displayName: "Date",
      sortable: true,
      filterable: true,
      visible: true,
      searchable: true
    },
    {
      field: "holidayDescription",
      displayName: "Description",
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: "isHalfDayName",
      displayName: "Day",
      sortable: true,
      filterable: true,
      visible: true,
    },
  ];
  @ViewChild("holidayForm", { static: false }) holidayForm!: NgForm;
  @ViewChild("AddProjectHolidayModel", { static: false })
  public addProjectHolidayModel: ModalDirective | undefined;

  dropdownSubscription: any;
  constructor(
    private projectService: ProjectService,
    private projectHolidayCalenderService: projectHolidayCalenderService,
    private toaster: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.getProjectHolidayByProjectId()
      }

    });
    this.getProjectHolidayByProjectId()


  }


  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }


  async getWeekOff() {
    let obj = { codeTypeIds: AppConstant.GETWEEKOFF };
    await this.projectService.getAllCodesByCodeTypesDropdownData(obj, `${AppConstant.GET_ALLCODESBYCODETYPES}`).subscribe({
      next: (response) => {
        if (response) {
          this.weekOff = response.data[0].codes;
        }
      }
    });
  }


  async getHolidayType() {
    let obj = { codeTypeIds: AppConstant.GET_HOLIDAYTYPEARRAY };
    await this.projectService.getAllCodesByCodeTypesDropdownData(obj, `${AppConstant.GET_ALLCODESBYCODETYPES}`).subscribe({
      next: (response) => {
        if (response) {
          this.holidayTypes = response.data[0].codes;
        }
      }
    });
  }

  onProjectSelect(event: any) {
    this.selectedProjectId = event.value;
    this.selectedProjectName = "Holiday Calendar";
    this.projectHolidayCalenderModel.projectId = event.value;
    this.getProjectHolidayByProjectId();
  }

  async getProjectHolidayByProjectId() {
    let params = new HttpParams()
      .set("PageNumber", this.pageNumber)
      .set("RecordCount", this.holidayPerPage)
      .set("projectId", this.selectedProjectId)
      .set("FilterBy", this.searchTerm);

    await this.projectHolidayCalenderService.getProjectHolidayCalender(`${AppConstant.GET_PROJECTHOLIDAYCALENDERBYPROJECT}`, params).subscribe({
      next: (response) => {
        if (response) {
          this.rowData = response.data.map((item) => {
            return {
              ...item,
              formattedDate:
                item.date === null ? '-' : this.datePipe.transform(new Date(item.date), "dd/MM/yyyy") ||
                  undefined,
              isHalfDayName: item.isHalfDay ? "Half Day" : "Full Day",
              weeklyOffList:
                item.weeklyOffList && item.weeklyOffList.length > 0
                  ? item.weeklyOffList.join(', ')
                  : '-'
            };
          });
          this.totalCount = response.totalCount;
        }
      }
    });
  }

  async getProjectHoliday() {
    let params = new HttpParams()
      .set("PageNumber", this.pageNumber)
      .set("RecordCount", this.holidayPerPage)
      .set("FilterBy", this.searchTerm);

    await this.projectHolidayCalenderService.getProjectHolidayCalender(`${AppConstant.GET_PROJECTHOLIDAYCALENDER}`, params).subscribe({
      next: (response) => {
        if (response) {
          this.rowData = response.data.map((item) => {
            return {
              ...item,
              formattedDate:
                this.datePipe.transform(new Date(item.date), "dd/MM/yyyy") ||
                undefined,
              isHalfDayName: item.isHalfDay ? "Half Day" : "Full Day",
            };
          });
          this.totalCount = response.totalCount;
        }
      }
    });
  }

  triggerFormSubmit(form: NgForm) {
    form.ngSubmit.emit();
  }
  addProjectHoliday() {
    this.getHolidayType();
    this.getWeekOff();
    this.holidayForm.resetForm();
    this.projectHolidayCalenderModel = new ProjectHolidayCalenderDaum();
    this.addProjectHolidayModel?.show();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.SaveProjectHoliday();
  }


  isWeekOffRequired: boolean = false;
  onHolidayTypeChange(event: any): void {
    const selectedHolidayTypeId = event.value;
    if (selectedHolidayTypeId === 18) {
      this.isWeekOffRequired = true;
    } else {
      this.isWeekOffRequired = false;
      this.projectHolidayCalenderModel.weekOff = [];  // Reset week off selection if it's not required
    }
  }

  async SaveProjectHoliday() {
    let obj = {
      id: 0,
      projectId: this.projectHolidayCalenderModel.projectId,
      date: this.projectHolidayCalenderModel.date === '' ? null : new Date(this.projectHolidayCalenderModel.date).toISOString(),
      holidayDescription: this.projectHolidayCalenderModel.holidayDescription,
      holidayType: this.projectHolidayCalenderModel.holidayType.toString(),
      isHalfDay: !this.projectHolidayCalenderModel.isHalfDay,
      weeklyOffList: this.projectHolidayCalenderModel.weekOff
    };
    if (this.projectHolidayCalenderModel.id == 0) {
      (await this.projectHolidayCalenderService.postProjectHolidayCalender(obj, `${AppConstant.POST_PROJECTHOLIDAYCALENDER}`)).subscribe({
        next: (responce) => {
          if (responce) {
            if (responce.success == true) {
              this.toaster.success("success", responce.message);
              this.onProjectSelect({ value: this.selectedProjectId });
              this.resetControlStates();
              this.resetForm();
              this.addProjectHolidayModel?.hide();
              this.projectHolidayCalenderModel = new ProjectHolidayCalenderDaum();
              this.projectHolidayCalenderModel.projectId = this.selectedProjectId;
            }
          }
        }
      });
    } else {
      obj.id = this.projectHolidayCalenderModel.id;
      let params = new HttpParams().set("id", this.projectHolidayCalenderModel.id);

      await this.projectHolidayCalenderService.putProjectHolidayCalender(obj, `${AppConstant.PUT_PROJECTHOLIDAYCALENDER}${this.projectHolidayCalenderModel.id}`, params).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toaster.success("success", response.message);
            this.onProjectSelect({ value: this.selectedProjectId });
            this.resetControlStates();
            this.addProjectHolidayModel?.hide();
            this.projectHolidayCalenderModel = new ProjectHolidayCalenderDaum();
            this.projectHolidayCalenderModel.projectId = this.selectedProjectId;
          }
        }
      });
      this.onEditButton = false;
    }

  }

  closeModel() {
    this.addProjectHolidayModel?.hide();

    this.resetForm();
  }
  resetForm() {
    if (this.holidayForm) {
      this.holidayForm.resetForm();
      this.projectHolidayCalenderModel = {
        id: 0,
        projectId: 0,
        date: '',
        holidayDescription: '',
        holidayType: '',
        weekOff: [],
        isHalfDay: false,
        isHalfDayName: '',
        formattedDate: '',
      };
    }
  }

  resetControlStates() {
    const controlsToReset = ["date", "holidayType", "weekOff"];

    controlsToReset.forEach((controlName) => {
      const control = this.holidayForm.control.get(controlName);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
        control.updateValueAndValidity();
      }
    });
  }

  onEdit(event: any) {
    // 
    this.getHolidayType();
    this.getWeekOff();
    this.onEditButton = true;
    this.projectHolidayCalenderModel.id = event.id;
    this.projectHolidayCalenderModel.date = event.date;
    this.projectHolidayCalenderModel.holidayDescription =
      event.holidayDescription;
    this.projectHolidayCalenderModel.holidayType = event.holidayTypeId;
    this.projectHolidayCalenderModel.isHalfDay = !event.isHalfDay;
    this.projectHolidayCalenderModel.projectId = event.projectId;
    this.projectHolidayCalenderModel.weekOff = event.weekOffValue
    this.isWeekOffRequired = this.projectHolidayCalenderModel.weekOff.length > 0
    this.addProjectHolidayModel?.show();

  }

  onDelete(event: any) {
    this.confirmDelete(event);
  }

  confirmDelete(event: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.deleteProjectHoliday(event);
      } else {
        return;
      }
    });
  }

  async deleteProjectHoliday(event: any) {
    let params = new HttpParams().set("id", event.id);
    await this.projectHolidayCalenderService.deleteProjectHolidayCalender(`${AppConstant.DELETE_PROJECTHOLIDAYCALENDER}${event.id}`, params).subscribe({
      next: (response) => {
        if (response && response.success) {
          GlobalConfiguration.consoleLog(
            "Project Holiday Component",
            "Delete response:",
            response
          );
          this.rowData = this.rowData.filter((r) => r !== event);
          this.toaster.success("Delete ", response.message);
          this.totalCount = this.totalCount - 1;
        }
      }
    });
  }

  //       `${AppConstant.GET_FILTER}${AppConstant.GRID_PROJECT}/ScreenGridCodeTypes`
  //         "Project Dashboard",
  //         "Get Filter Data error ",
  //         error

  onCancle() {
    this.router.navigate(["project/dashboard"]);
  }

  onPageChange(page: any) {
    this.pageNumber = page;
    this.getProjectHolidayByProjectId();
  }

  onTotalHolidayPerPageValueChange(totalHoliday: number) {
    this.holidayPerPage = totalHoliday;
    this.pageNumber = 1;
    this.getProjectHolidayByProjectId();
  }

  onSearch(search: string) {
    this.searchTerm = search;
    this.getProjectHolidayByProjectId();
  }

  filterapply(event: any) {
    this.searchTerm = event;
    this.getProjectHolidayByProjectId();
  }
}
