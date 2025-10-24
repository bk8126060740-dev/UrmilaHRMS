import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './candidate-list.component.scss'
})
export class CandidateListComponent {
  rowData: any[] = [];
  totalCount: number = 0;
  rows = [{
    projectName: "Railway",
    location: "Surat",
    department: "management",
    designation: "Employee",
    grade: "A",
    firstName: "Vrushti",
    lastName: "Bhanderi",
    mobile: "7358452147",
    email: "test@gmail.com",
    address1: "Address1",
    address2: "address2",
    postalCode: "395006",
    city: "Surat",
    state: "Gujrat",
    empUISID: "hdgsh56644",
    empRegdNo: "55tfgHN",
    BKCRegNo: "YY%$$&*",
    bankName: "SBI",
    bankBranch: "BARODA",
    accountName: "UHT",
    IFSCCode: "TGYU5777",
    startDate: "2024-02-09",
    endDate: "2024-02-16",
    UNANo: "GTG78",
    ESICNo: "GTG78",
    adharNo: "748452145",
    salary: "10000",
    status: "In Progress",
  }]

  columns = [
    {
      isSendlink: true,
    },
    {
      field: "projectName",
      displayName: "Project Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "location",
      displayName: "Location",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: false,
    },
    {
      field: "department",
      displayName: "Department",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "designation",
      displayName: "Designation",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "grade",
      displayName: "Grade",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: true,
    },
    {
      field: "firstName",
      displayName: "First Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: false,
    },
    {
      field: "lastName",
      displayName: "Last Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: false,
    },
    {
      field: "mobile",
      displayName: "Mobile",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
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
      field: "address1",
      displayName: "AddressLine 1",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCenter: false,
    },
    {
      field: "address2",
      displayName: "AddressLine 2",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
      isCenter: false,
    },
    {
      field: "postalCode",
      displayName: "Postal Code",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
      isCenter: false,
    },
    {
      field: "city",
      displayName: "City",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "state",
      displayName: "State",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "empUISID",
      displayName: "EmpUISID",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "empRegdNo",
      displayName: "EmpRegdNo",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "BKCRegNo",
      displayName: "BKCRegNo",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "bankName",
      displayName: "Bank Name",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "bankBranch",
      displayName: "Bank Branch",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "accountName",
      displayName: "Account Name",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "IFSCCode",
      displayName: "IFSC Code",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "startDate",
      displayName: "Start Date",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCenter: true,
    },
    {
      field: "endDate",
      displayName: "End Date",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCenter: true,
    },
    {
      field: "UNANo",
      displayName: "UNA No",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "ESICNo",
      displayName: "ESIC No",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "adharNo",
      displayName: "Adhar No",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "salary",
      displayName: "Salary",
      sortable: true,
      filterable: true,
      visible: false,
      fixVisible: false,
    },
    {
      field: "status",
      displayName: "Status",
      sortable: true,
      filterable: true,
      visible: true,
      isColor: true,
      fixVisible: true,
      isCenter: true,
    },
  ];

  ngOnInit() {
    this.rowData = this.rows
  }

  onEdit(event: MouseEvent) {

  }
  onDelete(event: MouseEvent) {

  }
  onSendlink() {
  }
  onPageChange(event: number) {

  }
}
