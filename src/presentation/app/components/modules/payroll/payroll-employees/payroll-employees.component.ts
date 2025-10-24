import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProjectDaum } from '../../../../../../domain/models/project.model';

@Component({
  selector: 'app-payroll-employees',
  templateUrl: './payroll-employees.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './payroll-employees.component.scss'
})
export class PayrollEmployeesComponent {
  rowData: ProjectDaum[] = [];
  @ViewChild("payrollEmpmodal", { static: false }) public payrollEmpmodal:
  | ModalDirective
  | undefined;
  totalCount: number = 0;
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
      field: "pf",
      displayName: "Pf",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "basicSalary",
      displayName: "Basic Salary",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "Esic",
      displayName: "Esic",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "alliance",
      displayName: "Alliance",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "total",
      displayName: "Total",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
  ];


  onEdit(event: MouseEvent) {

  }

  onInsert(){    
    this.payrollEmpmodal?.show();
  }  

  onDelete(event: MouseEvent) {

  }

  addProject() {

  }
  onPageChange(event: number) {

  }

}
