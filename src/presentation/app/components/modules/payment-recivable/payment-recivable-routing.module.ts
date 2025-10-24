import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentReciveableReportComponent } from './payment-reciveable-report/payment-reciveable-report.component';
import { PaymentReciveableComponent } from './payment-reciveable/payment-reciveable.component';
import { PaymentReciveableDashboardComponent } from './payment-reciveable-dashboard/payment-reciveable-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'report',
    component: PaymentReciveableReportComponent,
    data: {
      title: 'Report'
    }
  }, {
    path: 'received',
    component: PaymentReciveableComponent,
    data: {
      title: 'Received'
    }
  }, {
    path: 'dashboard',
    component: PaymentReciveableDashboardComponent,
    data: {
      title: 'Dashboard'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRecivableRoutingModule { }
