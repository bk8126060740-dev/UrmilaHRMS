import { Component } from '@angular/core';
import { codeDaum } from '../../../../../../domain/models/code.model';
import { CodeTypeService } from '../../../../../../domain/services/codeType.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { GlobalConfiguration } from '../../../../../../common/global-configration';
import { CodeService } from '../../../../../../domain/services/code.service';
import { HttpParams } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { EmployeeService } from '../../../../../../domain/services/employee.service';
import { Employee } from '../../../../../../domain/models/employee.model';
import { DatePipe } from '@angular/common';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { ExportService } from '../../../../../../domain/services/export.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
  totalCount: number = 0;
  rowData: Employee[] = [];
  recode: number = 10;
  searchTerm: string = "";
  pageNumber: number = 1;
  filterData: [] = [];
  columns = [
    {
      field: "firstName",
      displayName: "First Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "lastName",
      displayName: "Last Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "email",
      displayName: "Email",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "bkcRegNo",
      displayName: "BKC Reg No.",
      sortable: true,
      filterable: true,
      visible: true,
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
      field: "mobileNumber",
      displayName: "Mobile No.",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "formattedDOJ",
      displayName: "DOJ",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      searchable: true
    },
    {
      field: "formattedpfRegistrationDate",
      displayName: "PF Registration Date",
      sortable: true,
      filterable: true,
      visible: false
    },
    {
      field: "formattedesicRegistrationDate",
      displayName: "ESIC Registration Date",
      sortable: true,
      filterable: true,
      visible: false
    },
    {
      field: "bankName",
      displayName: "Bank Name",
      sortable: true,
      filterable: true,
      visible: false
    },
    {
      field: "accountNumber",
      displayName: "Account Number",
      searchType: "number",
      sortable: true,
      filterable: true,
      visible: false
    },
    {
      field: "ifscCode",
      displayName: "IFSC Code",
      sortable: true,
      filterable: true,
      visible: false
    },
    {
      field: "aadharCardNumber",
      displayName: "Aadhaar Card Number",
      sortable: true,
      filterable: true,
      visible: false
    },
    {
      field: "panNumber",
      displayName: "PAN Number",
      sortable: true,
      filterable: true,
      visible: false
    }
  ];

  orderby: string = "";
  dropdownSubscription: any;

  constructor(
    private route: Router,
    private employeeService: EmployeeService,
    private datePipe: DatePipe,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService,
    private exportService: ExportService
  ) { }

  async onEdit(row: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        EmployeeData: row,
      },
    };
    this.route.navigate(["/employee/create"], navigationExtras);
  }

  async onDelete(row: any) {
  }

  async addCode(row: any) {
  }

  async ngOnInit() {

    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);
      if (value != project) {
        this.getAllEmployee();
      }

    });
    this.getAllEmployee();
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }
  async getAllEmployee() {
    let params = new HttpParams()
      .set('RecordCount', this.recode.toString())
      .set('PageNumber', this.pageNumber.toString())
      .set('FilterBy', this.searchTerm)
      .set('OrderBy', this.orderby);
    this.employeeService.getEmployee<Employee[]>(AppConstant.GET_ALLEMPLOYEE, params).subscribe({
      next: (response) => {
        this.rowData = response.data;
        this.rowData = response.data.map((employee) => {
          const newemployee: Employee = {
            ...employee,
            doj: new Date(employee.doj),
            pfRegistrationDate: new Date(employee.pfRegistrationDate),
            esicRegistrationDate: new Date(employee.esicRegistrationDate),

            formattedDOJ: this.datePipe.transform(new Date(employee.doj), 'dd-MMM-yyyy') || undefined,
            formattedpfRegistrationDate: this.datePipe.transform(new Date(employee.pfRegistrationDate), 'dd-MMM-yyyy') || undefined,
            formattedesicRegistrationDate: this.datePipe.transform(new Date(employee.esicRegistrationDate), 'dd-MMM-yyyy') || undefined,
          };
          return newemployee;
        });

        this.totalCount = response.totalCount;
      }
    })
  }

  export() {
    this.exportService.get(AppConstant.GET_EMPLOYEEBYID + "/AllEmployeeExcelSheet").subscribe({
      next: (response: Blob) => {
        this.downloadFile(response);
      },
      error: (error) => { }
    });
  }

  downloadFile(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EmployeeList_Export.xlsx'; // Specify the default file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  getStatusColorCode(projectStatus: string): string {
    switch (projectStatus) {
      case 'Completed': return '#B77BEF';
      case 'In Progress': return '#F5B849';
      case 'On Hold': return '#EF9153';
      case 'Cancel': return '#D60B40';
      case 'Closed': return ''; // Define color if needed
      case 'Hybrid Model': return '#F171B1';
      case 'Active': return '#59AAAA';
      default: return '#4285F4'; // Default color
    }
  }

  addEditEmployee() {
    this.route.navigate(['employee/create'])
  }


  onPageChange(value: number) {
    this.pageNumber = value;
    this.getAllEmployee();
  }

  onTotalProjectPerPageValueChange(totalProjectCount: number) {
    this.recode = totalProjectCount;
    this.pageNumber = 1;
    this.getAllEmployee();
  }


  onSearch(search: string) {
    search = search.replace(/formattedDOJ/g, 'doj');
    this.searchTerm = search;
    this.getAllEmployee();
  }

  orderBy(event: any) {
    event = event.replace(/formattedDOJ/g, 'doj ');
    this.orderby = event;
    this.getAllEmployee();
  }

}
