import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { AssignTicketModel, Employee, GrievanceModel, GrievanceStatusModel, HoIdAndNameModel, ProjectId } from '../../../../../../domain/models/grievance.model';
import { NavigationExtras, Router } from '@angular/router';
import { GrievanceService } from '../../../../../../domain/services/grievance.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToasterService } from '../../../../../../common/toaster-service';
import { debounceTime, Subject } from 'rxjs';
import { GrantPermissionService } from '../../../../../../domain/services/permission/is-granted.service';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';

@Component({
  selector: 'app-grievance',
  templateUrl: './grievance.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './grievance.component.scss'
})

export class GrievanceComponent {
  rowData: GrievanceModel[] = [];
  projectIdData: ProjectId[] = [];
  grievance: GrievanceModel = new GrievanceModel();
  grievanceStatus: GrievanceStatusModel[] = [];
  selectedStatus: GrievanceStatusModel = new GrievanceStatusModel();
  defualtSelectedStatus: GrievanceStatusModel = new GrievanceStatusModel();
  totalCount: number = 0;
  statusCount: number = 0;
  recode: number = 10;
  searchTerm: string = 'statusId eq 157';

  filterTerm: string = '';
  orderby: string = '';
  pageNumber: number = 1;
  assignUser: { id: number; fullName: string }[] = [];
  filteredUsers: { id: number; fullName: string }[] = [];
  designations: number[] = [129, 130, 131, 132, 133, 134, 135, 136, 137, 193];
  selectedUserId: number | null = null;
  grievanceId: number = 0;
  selectedTicket: number | null = null;
  inputTypes: any[] = [];
  inputTypeId: number = 0;
  classificationTypes: any[] = [];
  classificationId: number = 0;
  subClassifications: any[] = [];
  subClassificationId: number = 0;
  description: string = '';
  GrievanceForm!: FormGroup;
  defaultProjectId: number = 0;
  submitted = false;
  employeeId: number = 0;
  selectedEmployee: any;
  filteredEmployeeList: Employee[] = [];
  private searchSubject: Subject<string> = new Subject<string>();
  private searchSubjectwithProject: Subject<string> = new Subject<string>();
  assignForm!: FormGroup;

  searchText: string = '';
  permission: boolean = false;
  columns = [
    {
      field: "grievanceNumber",
      displayName: "Grievance Number",
      sortable: false,
      filterable: true,
      visible: true,
      isCenter: true,
      fixVisible: true
    },
    {
      field: "employeeCode",
      displayName: "Employee Code",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true
    },
    {
      field: "employeeName",
      displayName: "Employee",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true
    },
    {
      field: "assignedEmployeeName",
      displayName: "Assigned To",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true
    },
    {
      field: "inputTypeName",
      displayName: "Input Type",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true
    },
    {
      field: "classificationTypeName",
      displayName: "Classification Type",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true
    },
    {
      field: "subClassificationName",
      displayName: "Sub Classification",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true
    },
    {
      field: "description",
      displayName: "Description",
      sortable: true,
      filterable: true,
      visible: false,
    },
    {
      field: 'statusName',
      displayName: 'Status',
      sortable: true,
      filterable: true,
      isCenter: true,
      isColor: true,
      visible: true,
      fixVisible: true,
      searchable: true
    },
    {
      field: "priorityName",
      displayName: "Priority",
      sortable: true,
      filterable: false,
      visible: true,
      isColor: true,
      isCenter: true,
      fixVisible: true
    }
  ];
  dropdownSubscription: any;

  constructor(
    private grievanceService: GrievanceService,
    private router: Router,
    private toaster: ToasterService,
    private formBuilder: FormBuilder,
    private grantPermissionService: GrantPermissionService,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService
  ) {
    (this.grantPermissionService.hasSpecialPermission("Write", 48)).subscribe({
      next: (response) => {
        if (response) {
          let obj = {
            field: "",
            displayName: "View",
            sortable: true,
            filterable: true,
            visible: true,
            isCenter: true,
            viewButton: true,
            fixVisible: true,
            isColor: false,
            searchable: true
          }
          this.columns.push(obj);
        }
      }
    })
  }

  @ViewChild("AssignTicket", { static: true })
  public addAssignTicketModel: ModalDirective | undefined;
  @ViewChild("CreateTicket", { static: true })
  public addCreateTicket: ModalDirective | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;

  async ngOnInit() {

    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.getGrievanceAllData();
      }

    });
    this.GrievanceForm = this.formBuilder.group({
      defaultProjectId: ['', Validators.required],
      employeeId: ['', Validators.required],
      inputTypeId: [''],
      classificationTypeId: ['', Validators.required],
      subClassificationId: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.assignForm = this.formBuilder.group({
      selectedUserId: ['', Validators.required],
    });
    this.getGrievanceAllData();
    this.fetchAssignUsers();
    this.getInputTypes();
    this.getClassificationTypes();
    this.fetchEmployees();
    this.fetchEmployeesWithProject();
    this.setupSearchSubscription();
    this.getProjectId();
    (await this.grantPermissionService.hasSpecialPermission("Write", 47)).subscribe({
      next: (response) => {
        this.permission = response;
      }
    });


  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }
  setupSearchSubscription() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.fetchEmployees();
    });
    this.searchSubjectwithProject.pipe(debounceTime(300)).subscribe(() => {
      this.fetchEmployeesAssignTicket();
    });

  }

  hasNonResolvedGrievances(): boolean {
    return this.rowData.some(grievance => grievance.statusName !== 'Resolved');
  }

  async fetchEmployees(): Promise<void> {
    const params = new HttpParams().set('SearchText', this.searchText);
    await this.grievanceService.getGrievanceAllData<Employee[]>(`${AppConstant.GET_EMPLOYEE_SEARCH}`, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.filteredEmployeeList = response.data;;
        } else {
          this.filteredEmployeeList = [];
        }
      }
    });
  }

  async fetchEmployeesWithProject(): Promise<void> {
    if (!this.defaultProjectId) {
      this.filteredEmployeeList = [];
      return;
    }
    const params = new HttpParams()
      .set('SearchText', this.searchText)
      .set('DefaultProjectId', this.defaultProjectId.toString());

    this.grievanceService.getGrievanceAllData<Employee[]>(`${AppConstant.GET_EMPLOYEE_SEARCH}`, params)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.filteredEmployeeList = response.data;
          } else {
            this.filteredEmployeeList = [];
          }
        },
        error: () => {
          this.filteredEmployeeList = [];
        }
      });
  }

  async fetchEmployeesAssignTicket(): Promise<void> {
    const params = new HttpParams().set('SearchText', this.searchText);
    await this.grievanceService.getGrievanceAllData<Employee[]>(`${AppConstant.GET_EMPLOYEE_SEARCH}`, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.filteredUsers = response.data;;
        } else {
          this.filteredUsers = [];
        }
      }
    });
  }


  onSearchChange(searchValue: string): void {
    this.searchText = searchValue;
    if (!this.searchText.trim()) {
      this.fetchEmployeesWithProject();
    } else {
      this.fetchEmployeesWithProject();
    }
  }

  onSearchAssignEmployee(searchText: string) {
    this.searchSubjectwithProject.next(searchText);
  }

  async fetchAssignUsers() {
    const requestBody = {
      designations: this.designations
    };
    await this.grievanceService.postAssignTicket<HoIdAndNameModel[]>(requestBody, AppConstant.POST_GET_LIST_OF_HO).subscribe(
      (response: any) => {
        if (response.success && response.data) {
          this.assignUser = response.data;
          this.filteredUsers = this.assignUser;
        } else {
          this.toaster.errorToaster(response.message);
        }
      }
    );
  }

  async submitTicket(): Promise<void> {
    this.submitted = true;
    if (this.GrievanceForm.invalid) {
      return;
    }
    const grievanceData = {
      employeeId: this.GrievanceForm.value.employeeId,
      inputTypeId: this.GrievanceForm.value.inputTypeId,
      classificationTypeId: this.GrievanceForm.value.classificationTypeId,
      subClassificationId: this.GrievanceForm.value.subClassificationId,
      description: this.GrievanceForm.value.description,
    };
    await this.grievanceService.postAssignTicket(grievanceData, AppConstant.GET_ALL_GRIEVANCE).subscribe({
      next: (response: any) => {
        if (response && response.success)
          this.getGrievanceAllData();
        this.toaster.successToaster(response.message);
        this.addCreateTicket?.hide();
      }
    });
  }

  CreateTickets() {
    this.addCreateTicket?.hide();
    this.searchText = '';
  }

  async getGrievanceAllData() {
    let params = new HttpParams()
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    await this.grievanceService.getGrievanceAllData<GrievanceModel[]>(AppConstant.GET_ALL_GRIEVANCE, params).subscribe({
      next: (responce: any) => {
        if (responce && responce.success) {
          this.rowData = responce.data;
          this.grievanceStatus = responce.grievanceStatus;

          if (this.searchTerm === 'statusId eq 157')
            this.selectedStatus = this.grievanceStatus.filter(m => m.id === 157)[0];


          this.rowData.forEach((grievance) => {
            grievance.grievanceNumber = `#${grievance.grievanceNumber}`;
            const matchingStatus = responce.grievanceStatus.find(
              (status: any) => status.id === grievance.statusId
            );
          });
          this.totalCount = responce.totalCount;
          this.statusCount = responce.statusCount;
        } else {
          this.rowData = [];
          this.grievanceStatus = [];
          this.totalCount = 0;
        }
      }
    });
  }


  async getProjectId() {
    await this.grievanceService.getGrievanceAllData<ProjectId[]>(AppConstant.GET_PROJECT + "/GetListOfIdAndName").subscribe({
      next: (responce: any) => {
        if (responce && responce.success) {
          this.projectIdData = responce.data;
        } else {
          this.rowData = [];
        }
      }
    });
  }

  async viewRecord(row: any) {
    (await this.grantPermissionService.hasSpecialPermission("Write", 48)).subscribe({
      next: (response) => {
        if (response) {
          const navigationExtras: NavigationExtras = {
            state: {
              grievanceCommentData: row,
              grievanceObject: row
            },
          };
          this.router.navigate(['/grievance/grievanceReply'], navigationExtras);
        } else {
          this.toaster.warningToaster('You do not have the necessary permissions to access the Comunication');
        }
      }
    });



  }

  async onStatusCardClick(status: any, event: Event) {
    this.searchTerm = "";
    this.selectedStatus = status;
    if (status.name == "Total Records") {
      this.getGrievanceAllData();
    } else {
      this.searchTerm = `statusId eq ${status.id}`;
      await this.getGrievanceAllData();
    }
  }

  assignTicket() {
    this.addAssignTicketModel?.show();
    this.formDirective.resetForm();
    this.selectedUserId = null;
    this.searchText = '';
    this.filteredUsers = this.assignUser;
  }

  async onAssignTicket(): Promise<void> {
    this.submitted = true;
    if (this.assignForm.invalid) {
      return;
    }
    const selectedRow = this.rowData.filter((row: any) => row.isSelected);
    const grievanceIds = selectedRow.map((row: any) => row.id);

    const obj: AssignTicketModel = {
      grievanceIds: grievanceIds,
      assignEmployeeId: this.selectedUserId ?? 0
    };

    await this.grievanceService.postAssignTicket<AssignTicketModel>(obj, AppConstant.POST_ASSIGN_TICKET).subscribe(
      (response: any) => {
        if (response.success) {
          this.toaster.successToaster(response.message);
          this.getGrievanceAllData();
          this.addAssignTicketModel?.hide();
        } else {
          this.toaster.errorToaster(response.message);
        }
      }
    );
  }

  async getInputTypes(): Promise<void> {
    const obj = {
      codeTypeIds: [38]
    };
    await this.grievanceService.postAssignTicket<AssignTicketModel[]>(obj, AppConstant.POST_GET_ALLLCODESTYPE).subscribe(
      (response: any) => {
        if (response.success) {
          this.inputTypes = response.data[0].codes;
        } else {
          this.toaster.errorToaster(response.message);
        }
      }
    );
  }

  async getClassificationTypes(): Promise<void> {
    let params = new HttpParams()
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    await this.grievanceService.getGrievanceAllData(AppConstant.GET_ALL_GRIEVANCE_CLASSIFICATION, params).subscribe(
      (response: any) => {
        if (response.success) {
          this.classificationTypes = response.data;
        } else {
          this.classificationTypes = [];
        }
      }
    );
  }

  async getSubClassifications(classificationTypeId: number): Promise<void> {
    await this.grievanceService.getGrievanceAllData(`${AppConstant.GET_LIST_SUBCLASSIFICATIONBYID}/${classificationTypeId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.subClassifications = response.data;
        } else {
          this.subClassifications = [];
        }
      }
    );
  }

  onClassificationIdChange(): void {
    this.getSubClassifications(this.classificationId);
  }

  onAddTicket() {
    this.addCreateTicket?.show();
    this.formDirective.resetForm();
  }

  onSearch(event: any) {
    if (typeof event === 'string' && event.includes('employeeCode.contains(')) {
      event = event.replace(/\bemployeeCode\b/g, 'EmployeeIdNavigation.employeeCode');
    }
    if (event.includes('grievanceNumber')) {
      event = event.replace(/\.contains\('/g, " eq ");
      event = event.replace(/'\)/g, "");
      event = event.replace(/grievanceNumber/, 'Id');
    }
    this.searchTerm = event;
    this.getGrievanceAllData();
  }

  onPageChange(event: number) {
    this.pageNumber = event;
    this.getGrievanceAllData();
  }

  onTotalGriveanceValueChange(event: any) {
    this.recode = event;
    this.pageNumber = 1;
    this.getGrievanceAllData();
  }

  orderBy(event: any) {
    this.orderby = event;
    this.getGrievanceAllData();
  }

}
