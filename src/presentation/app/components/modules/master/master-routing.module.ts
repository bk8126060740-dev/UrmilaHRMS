import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeMasterComponent } from './code-master/code-master.component';
import { CodeTypeMasterComponent } from './code-type-master/code-type-master.component';
import { PayrollAttributeComponent } from './payroll-attribute/payroll-attribute.component';
import { PayrollAttributeCreateComponent } from './payroll-attribute-create/payroll-attribute-create.component';
import { DepartmentMasterComponent } from './department-master/department-master.component';
import { DesignationMasterComponent } from './designation-master/designation-master.component';
import { BankMasterComponent } from './bank-master/bank-master.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'code',
    pathMatch: 'full'
  }, {
    path: '',
    children: [
      {
        path: 'code',
        component: CodeMasterComponent,
        data: {
          title: 'Code Master'
        }
      },
      {
        path: 'codetype',
        component: CodeTypeMasterComponent,
        data: {
          title: 'Code Type Master'
        }
      },
      {
        path: 'attribute',
        component: PayrollAttributeComponent,
        data: {
          title: 'Payroll Attribute Master'
        }
      },
      {
        path: 'createattribute',
        component: PayrollAttributeCreateComponent,
        data: {
          title: 'Create Payroll Attribute'
        }
      },
      {
        path: 'Mstdepartment',
        component: DepartmentMasterComponent,
        data: {
          title: 'Department Master'
        }
      },
      {
        path: 'Mstdesignation',
        component: DesignationMasterComponent,
        data: {
          title: 'Designation Master'
        }
      },
      {
        path: 'bankmaster',
        component: BankMasterComponent,
        data: {
          title: 'Bank Resource Master'
        }
      }
    ]

  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
