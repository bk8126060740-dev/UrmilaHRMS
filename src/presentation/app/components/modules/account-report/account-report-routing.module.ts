import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountReportComponent } from './account-report/account-report.component';
import { BankIntiatePaymentsComponent } from './bank-intiate-payments/bank-intiate-payments.component';


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
            component: AccountReportComponent,
            data: {
              title: 'Dashboard'
            }
          },
          {
            path: 'BankIntiatePayments',
            component: BankIntiatePaymentsComponent,
            data: {
              title: 'Generate Bank Initiate Payments'
            }
          }    
          
        ]
  }];

 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountReportRoutingModule { }
