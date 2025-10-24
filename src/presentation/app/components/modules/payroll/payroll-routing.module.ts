import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollComponent } from './payroll/payroll.component';
import { PayrollEmployeesComponent } from './payroll-employees/payroll-employees.component';
import { BreadcrumbService } from '../../core/breadcrumb/breadcrumb.service';
import { PayrollDetailsComponent } from './payroll-details/payroll-details.component';
import { BankSheetListComponent } from './bank-sheet-list/bank-sheet-list.component';
import { BankSheetReportComponent } from './bank-sheet-report/bank-sheet-report.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: PayrollComponent,
        data: {
          title: 'Dashboard'
        }
      }, {
        path: 'create',
        component: PayrollEmployeesComponent,
        data: {
          title: 'Create'
        }
      },
      {
        path: 'payrolldetails',
        component: PayrollDetailsComponent,
        data: {
          title: 'Payroll Details'
        }
      },
      {
        path: 'bank-sheet-list',
        component: BankSheetListComponent,
        data: {
          title: 'Payroll Bank Sheet'
        }
      },
      {
        path: 'bank-sheet-report',
        component: BankSheetReportComponent,
        data: {
          title: 'Payroll Bank Sheet Report'
        }
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BreadcrumbService],

})
export class PayrollRoutingModule {
}
