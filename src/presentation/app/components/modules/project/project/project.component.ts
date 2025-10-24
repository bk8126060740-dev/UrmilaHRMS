import { Component, Renderer2, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppConstant } from "../../../../../../common/app-constant";
import { GlobalConfiguration } from "../../../../../../common/global-configration";
import { HttpParams } from "@angular/common/http";
import swal from "sweetalert";
import {
  AddEnudumModel,
  ProjectDaum,
  ProjectStatusModel,
} from "../../../../../../domain/models/project.model";

import { NavigationExtras, Router } from "@angular/router";
import { ProjectService } from "../../../../../../domain/services/project.service";
import { FilterService } from "../../../../../../domain/services/filter.service";
import { Data } from "../../../../../../domain/models/filter.model";
import { DatePipe } from "@angular/common";
import { ExportService } from "../../../../../../domain/services/export.service";
import { GrantPermissionService } from "../../../../../../domain/services/permission/is-granted.service";
import { BasicLayoutComponent } from "../../../core/basic-layout/basic-layout.component";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrl: "./project.component.scss",
})
export class ProjectComponent {
  pageNumber: number = 1;
  selectedStatus: ProjectStatusModel = new ProjectStatusModel();
  defualtSelectedStatus: ProjectStatusModel = new ProjectStatusModel();

  recode: number = 10;
  searchTerm: string = "";
  totalCount: number = 0;
  statusCount: number = 0;
  orderby: string = "";
  rowData: ProjectDaum[] = [];
  projectAddendums: AddEnudumModel[] = [];
  projectStatus: ProjectStatusModel[] = [];
  activeStatus: any;
  // searchable : true
  columns = [
    {
      field: "name",
      displayName: "Name",
      sortable: true,
      filterable: true,
      visible: true,
      ProfilePic: true,
      fixVisible: true,
    },
    {
      field: "clientName",
      displayName: "Client Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "description",
      displayName: "Description",
      description: true,
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
      searchable: true
    },
    {
      field: "gstin",
      displayName: "GSTIN",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "formattedStartDate",
      displayName: "Start Date",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCenter: true,
      searchable: true

    },
    {
      field: "formattedEndDate",
      displayName: "End Date",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCenter: true,
      searchable: true

    },
    {
      field: "projectResourceRequirement",
      displayName: "Resource Req.",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
      searchable: true

    },
    {
      field: "bankName",
      displayName: "Bank Name",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
      searchable: true
    },

    {
      field: "projectManagerName",
      displayName: "Project Manager",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "projectStatusValue",
      displayName: "Status",
      sortable: true,
      filterable: true,
      visible: true,
      isColor: true,
      fixVisible: true,
      isCenter: true,
      searchable: true
    },
    {
      field: "subLocation",
      displayName: "Sub Location",
      sortable: true,
      filterable: true,
      visible: false,
    },
    {
      field: "projectNatureTypeValue",
      displayName: "Nature Type",
      sortable: true,
      filterable: true,
      visible: false,
      searchable: true
    },
    {
      field: "serviceCharge",
      displayName: "Service Charge",
      sortable: true,
      filterable: true,
      visible: false,
      searchable: true
    },
    {
      field: "projectDeliveryModelTypeValue",
      displayName: "Delivery Model Type",
      sortable: true,
      filterable: true,
      visible: false,
      searchable: true
    },
    {
      field: "projectResourceTypeValue",
      displayName: "Resource Type",
      sortable: true,
      filterable: true,
      visible: false,
      searchable: true
    },
    {
      field: "attendanceTypeValue",
      displayName: "Attendance Type",
      sortable: true,
      filterable: true,
      visible: false,
      searchable: true
    },
    {
      field: "paymentTypeValue",
      displayName: "Payment Type",
      sortable: true,
      filterable: true,
      visible: false,
      searchable: true
    },
    {
      field: "leader1Name",
      displayName: "Leader1 Name",
      sortable: true,
      filterable: true,
      visible: false,
    },
    {
      field: "leader2Name",
      displayName: "Leader2 Name",
      sortable: true,
      filterable: true,
      visible: false,
    },
    {
      field: "",
      displayName: "Attributes",
      button: true,
      sortable: false,
      filterable: false,
      visible: true,
      isCenter: true,
      icon: "Attributes",
    }
  ];
  filterData: Data[] = [];


  constructor(
    private projectService: ProjectService,
    private toaster: ToastrService,
    private router: Router,
    private exportService: ExportService,
    private grantPermissionService: GrantPermissionService,
    private datePipe: DatePipe,
    private basicLayoutComponent: BasicLayoutComponent
  ) { }

  ngOnInit() {
    this.getProject();
  }

  orderBy(event: any) {
    event = event.replace(/formattedStartDate/g, 'startDate ');
    event = event.replace(/formattedEndDate/g, 'endDate ');
    event = event.replace(/projectStatusValue /g, 'projectStatus ');
    this.orderby = event;
    this.getProject();

  }

  async attributeButtonClick(event: any) {
    (await
      this.grantPermissionService.hasSpecialPermission("Write", 36)).subscribe({
        next: (response) => {
          if (response) {
            const navigationExtras: NavigationExtras = {
              state: {
                projectRowData: event,
              },
            };
            this.router.navigate(["/project/attribute"], navigationExtras);
          } else {
            this.toaster.warning(AppConstant.NOTPERMISSION)
          }
        }
      })

  }




  async onStatusCardClick(status: any, event: Event) {
    this.searchTerm = "";

    this.selectedStatus = status;
    if (status.name == "Total Records") {
      this.getProject();
    } else {
      this.searchTerm = `projectStatus eq ${status.id}`;
      await this.getProject();
    }
  }

  async getProject() {
    let params = new HttpParams()
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);


    await this.projectService.getProject(`${AppConstant.GET_PROJECT}`, params)
      .subscribe({
        next: (response) => {
          if (response) {
            this.rowData = response.data.map((project) => {
              const newProject: ProjectDaum = {
                ...project,
                startDate: new Date(project.startDate),
                endDate: new Date(project.endDate),
                formattedStartDate: this.datePipe.transform(new Date(project.startDate), "dd/MM/yyyy", "UTC") || undefined,
                formattedEndDate: this.datePipe.transform(new Date(project.endDate), "dd/MM/yyyy", "UTC") || undefined,
                statusColorCode: this.getStatusColorCode(project.projectStatusValue)

              };

              return newProject;
            });

            this.totalCount = response.totalCount;
            const root = document.documentElement;
            const themeColor = getComputedStyle(root).getPropertyValue("--theme-color").trim();

            const prevSelectedStatus = this.selectedStatus ? { ...this.selectedStatus } : null;

            this.projectStatus = [];
            this.defualtSelectedStatus = new ProjectStatusModel();
            this.defualtSelectedStatus.colorCode = themeColor;
            this.defualtSelectedStatus.count = response.statusCount;
            this.defualtSelectedStatus.id = 0;
            this.defualtSelectedStatus.name = "Total Records";

            this.projectStatus.push(this.defualtSelectedStatus);
            this.statusCount = response.statusCount;
            this.selectedStatus = this.defualtSelectedStatus;
            response.projectStatus.forEach((element) => {
              this.projectStatus.push(element);
            });
            this.selectedStatus = this.projectStatus.find(status => status.id === prevSelectedStatus?.id) || this.defualtSelectedStatus;
          }
        },
      });
  }

  getStatusColorCode(projectStatus: string): string {
    switch (projectStatus) {
      case 'Completed': return '#B77BEF';
      case 'In Progress': return '#F5B849';
      case 'On Hold': return '#ffa75d';
      case 'Cancel': return '#FA6060';
      case 'Closed': return ''; // Define color if needed
      case 'Hybrid Model': return '#F171B1 ';
      case 'Active': return '#59AAAA';
      default: return '#4285F4'; // Default color
    }
  }

  addProject() {
    this.router.navigate(["/project/create"]);
  }

  async onEdit(row: any) {
    this.projectAddendums = [];
    this.rowData.forEach((project: ProjectDaum) => {
      if (
        project.id === row.id &&
        project.projectAddendums &&
        project.projectAddendums.length > 0
      ) {
        this.projectAddendums.push(...project.projectAddendums);
      }
    });

    const navigationExtras: NavigationExtras = {
      state: {
        ProjectData: row,
        projectAddendums: this.projectAddendums,
      },
    };
    this.router.navigate(["/project/create"], navigationExtras);
  }

  onDelete(row: any) {
    this.confirmDelete(row);
  }

  confirmDelete(row: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.deleteProject(row);
      } else {
        swal("Cancelled", "Your record is safe :)", "error");
      }
    });
  }

  async deleteProject(row: any) {
    await this.projectService.deleteProject(`${AppConstant.DELETE_PROJECT}` + "/" + row.id).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.rowData = this.rowData.filter((r) => r !== row);
          this.toaster.success("Delete ", response.message);
          this.totalCount = this.totalCount - 1;
          this.basicLayoutComponent.callHeaderMethodFromProject();
          this.getProject();
        }
      }

    });
  }

  onPageChange(value: number) {
    this.pageNumber = value;
    this.getProject();
  }

  onSearch(search: string) {
    this.searchTerm = search;
    this.getProject();
  }

  export() {
    this.exportService.get(AppConstant.GET_EXPORT_PROJECT).subscribe({
      next: (response: Blob) => {
        this.downloadFile(response);
      },
      error: (error) => { },
    });
  }

  downloadFile(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ProjectDetails_Export.xlsx"; // Specify the default file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  onTotalProjectPerPageValueChange(totalProjectCount: number) {
    this.recode = totalProjectCount;
    this.pageNumber = 1;
    this.getProject();
  }
}
