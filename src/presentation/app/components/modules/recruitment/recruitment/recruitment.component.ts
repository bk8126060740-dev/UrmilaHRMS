import { Component, ViewEncapsulation } from "@angular/core";
import { RecruitmentService } from "./../../../../../../domain/services/recruitment.service";
import { Router, NavigationExtras } from "@angular/router";
import { GlobalConfiguration } from "../../../../../../common/global-configration";
import { AppConstant } from "../../../../../../common/app-constant";
import { ToasterService } from "../../../../../../common/toaster-service";
import { Data } from "../../../../../../domain/models/filter.model";
import swal from "sweetalert";
import { HttpParams } from "@angular/common/http";
import {
  jobPositionCreateRequestModel,
  jobPositionStatusModel,
} from "../../../../../../domain/models/jobPosition";
import { FilterService } from "../../../../../../domain/services/filter.service";
import { HeaderDropdownService } from "../../../../../../domain/services/header-dropdown.service";
import { LocalStorageService } from "../../../../../../common/local-storage.service";

@Component({
  selector: "app-recruitment",
  templateUrl: "./recruitment.component.html",
  styleUrl: "./recruitment.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class RecruitmentComponent {
  pageNumber: number = 1;
  title = "Job Position";
  projectAddendums: [] = [];
  rowData: jobPositionCreateRequestModel[] = [];
  filterData: Data[] = [];
  totalCount: number = 0;
  orderby: string = "";
  recode: number = 10;
  searchTerm: string = "";
  selectedStatus: jobPositionStatusModel = new jobPositionStatusModel();
  defualtSelectedStatus: jobPositionStatusModel = new jobPositionStatusModel();
  jobPositionStatus: jobPositionStatusModel[] = [];
  activeStatus: any;

  columns = [
    {
      field: "title",
      displayName: "Title",
      sortable: true,
      filterable: true,
      visible: true,
      ProfilePic: false,
      fixVisible: true,
    },
    {
      field: "desgnationName",
      displayName: "Designation Name",
      sortable: true,
      filterable: true,
      visible: true,
      ProfilePic: false,
      fixVisible: true,
    },
    {
      field: "hiringManagerEmployeeName",
      displayName: "HM Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      searchable: true
    },
    //   field: "hiringManagerEmployeeId",
    //   displayName: "HM ID",
    //   sortable: true,
    //   filterable: true,
    //   visible: false,
    //   fixVisible: false,
    //   searchable: true
    {
      field: "noOfPosition",
      displayName: "Vacancies",
      sortable: true,
      searchType: "number" as const,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "ctcMin",
      displayName: "Minimum CTC (in Lakh)",
      sortable: true,
      searchType: "number" as const,
      filterable: true,
      visible: false,
      fixVisible: false,
      isCenter: true,
    },
    {
      field: "ctcMax",
      displayName: "Maximum CTC (in Lakh)",
      sortable: true,
      searchType: "number" as const,
      filterable: true,
      visible: false,
      fixVisible: false,
      isCenter: true,
    },
    {
      field: "ectcMin",
      displayName: "Minimum Expected CTC (in Lakh)",
      sortable: true,
      searchType: "number" as const,
      filterable: true,
      visible: false,
      fixVisible: false,
      isCenter: true,
    },
    {
      field: "ectcMax",
      displayName: "Maximum Expected CTC (in Lakh)",
      sortable: true,
      searchType: "number" as const,
      filterable: true,
      visible: false,
      fixVisible: false,
      isCenter: true,
    },
    {
      field: "experienceType",
      displayName: "Experience Type",
      sortable: true,
      filterable: true,
      visible: false,
      searchable: true,
      fixVisible: true,
    },

    {
      field: "experienceMin",
      displayName: "Minimum Experience(in years)",
      searchType: "number" as const,
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "experienceMax",
      displayName: "Maximum Experience(in years)",
      sortable: true,
      searchType: "number" as const,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "positionFilled",
      displayName: "Filled Position",
      sortable: true,
      searchType: "number" as const,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    //   field: "status",
    //   displayName: "Status",
    //   sortable: true,
    //   filterable: true,
    //   visible: false,
    //   isColor: true,
    //   fixVisible: false,
    //   isCenter: true,

    {
      field: "location",
      displayName: "Location",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "ageMin",
      displayName: "Minimum Age",
      searchType: "number" as const,
      sortable: true,
      filterable: true,
      visible: false,
    },
    {
      field: "ageMax",
      displayName: "Maximum Age",
      searchType: "number" as const,
      sortable: true,
      filterable: true,
      visible: false,
    },
    {
      field: "languages",
      displayName: "Languages",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "description",
      displayName: "Description",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: true,
      searchable: true
    },

    {
      field: "departmentName",
      displayName: "Department",
      sortable: true,
      filterable: true,
      visible: false,
    },
    {
      field: "role",
      displayName: "Role",
      sortable: true,
      filterable: true,
      visible: false,
    },
    //   field: "modeId",
    //   displayName: "ModeID",
    //   sortable: true,
    //   filterable: true,
    //   visible: false,
    //   searchable: true
    {
      field: "duration",
      displayName: "Duration",
      button: false,
      sortable: true,
      filterable: true,
      visible: false,
      FixVisible: false,
      isCenter: true,
    },

    {
      field: "skillString",
      displayName: "Skills",
      button: false,
      sortable: true,
      filterable: true,
      visible: false,
      FixVisible: false,
      isCenter: true,
    },
    {
      field: "qualificationString",
      displayName: "Qualifications",
      button: false,
      sortable: true,
      filterable: true,
      visible: false,
      FixVisible: false,
      isCenter: true,
    },
  ];
  dropdownSubscription: any;
  constructor(
    private recruitmentService: RecruitmentService,
    private toaster: ToasterService,
    private router: Router,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);
      if (value != project) {
        this.getJobBoardTableData()
      }
    });
    this.getJobBoardTableData();
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }

  orderBy(event: any) {
    event = event.replace(
      /hiringManagerEmployeeName asc/g,
      `hiringManagerNavigation.UserNavigation.firstname.contains('asc')`
    );

    event = event.replace(
      /hiringManagerEmployeeName desc/g,
      `hiringManagerNavigation.UserNavigation.firstname.contains('desc')`
    );

    this.orderby = event;
    this.getJobBoardTableData();
  }

  OnClear(event: Event) {

  }

  attributeButtonClick(event: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        projectRowData: event,
      },
    };
    this.router.navigate(["/recruitment/dashboard"], navigationExtras);
  }


  removeTags(str: string) {
    if (str === null || str === "") return "";
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  getJobBoardTableData() {
    let params = new HttpParams()
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    this.recruitmentService
      .getJobPosition(`${AppConstant.JOB_POSITION}`, params)
      .subscribe({
        next: (response) => {
          if (response) {

            this.rowData = response.data.map((jobPosition) => {
              const newJobPosition: any = {
                ...jobPosition,
                description: this.removeTags(jobPosition.description),
              };

              newJobPosition.qualificationString =
                newJobPosition.qualifications.reduce(
                  (result: string, item: any) =>
                    result
                      ? result + "," + item?.qualificationName
                      : item?.qualificationName,
                  ""
                );

              newJobPosition.skillString = newJobPosition.skills.reduce(
                (result: string, item: any) =>
                  result ? result + "," + item?.skillName : item?.skillName,
                ""
              );



              return newJobPosition;
            });
            this.totalCount = response.totalCount;
          }
        },
        error: (error) => {
          console.error("Error:", error);
        },
        complete: () => {

        },
      });
  }

  onEdit(row: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        jobPositionData: row,
      },
    };

    this.router.navigate(["/recruitment/newopportunity"], navigationExtras);
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
        this.deleteJobPosition(row);
      } else {
        swal("Cancelled", "Your record is safe :)", "error");
      }
    });
  }

  async deleteJobPosition(row: any) {
    (
      await this.recruitmentService.deleteJobPosition(
        `${AppConstant.JOB_POSITION}/${row.id}`
      )
    ).subscribe(
      (response) => {
        if (response && response.success) {
          GlobalConfiguration.consoleLog(
            "Job Board Component",
            "Deleted the jobPosition - Response:",
            response
          );
          this.rowData = this.rowData.filter((r) => r !== row);
          this.toaster.successToaster("success", response.message);

          this.totalCount = this.totalCount - 1;
        }
      },
      (error) => {
        GlobalConfiguration.consoleLog(
          "Recruitment Component",
          "Delete Jobposition error:",
          error
        );
      }
    );
  }

  onPageChange(value: number) {
    this.pageNumber = value;
    this.getJobBoardTableData();
  }

  onSearch(search: string) {

    const regex = /(\w+)\.contains\('(\d+)'\)/;
    const regexHM = /(\w+)\.contains\('(\w+)'\)/;

    const x = search.match(regex);
    const y = search.match(regexHM);
    if (y) {
      const [, hmVariable, hmValue] = y;
      if (hmVariable === "hiringManagerEmployeeName") {
        this.searchTerm = `hiringManagerNavigation.UserNavigation.firstname.contains('${hmValue}')`;

        this.getJobBoardTableData();
        return;
      }
    }
    if (x) {
      const [, variable, value] = x;

      if (typeof parseInt(value) === "number") {
        this.searchTerm = `${variable} eq ${value}`;
        this.getJobBoardTableData();
        return;
      }
    } else {
      this.searchTerm = search;
      this.getJobBoardTableData();
    }
  }

  onTotalJobPositionPerPageValueChange(totaljobPositionCount: number) {
    this.recode = totaljobPositionCount;
    this.pageNumber = 1;
    this.getJobBoardTableData();
  }

  insert() {
    this.router.navigate(["/recruitment/newopportunity"]);
  }
}
