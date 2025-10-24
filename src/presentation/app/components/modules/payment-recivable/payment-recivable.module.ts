import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRecivableRoutingModule } from './payment-recivable-routing.module';
import { PaymentReciveableComponent } from './payment-reciveable/payment-reciveable.component';
import { PaymentReciveableDashboardComponent } from './payment-reciveable-dashboard/payment-reciveable-dashboard.component';
import { PaymentReciveableReportComponent } from './payment-reciveable-report/payment-reciveable-report.component';
import { CoreModule } from "../../core/core.module";
import { SharedModule } from "../../shared/shared.module";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IconModule } from '../../shared/Icon/icon.module';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TongGridModule } from '@teamopine/to-ng-grid';



@NgModule({
  declarations: [
    PaymentReciveableComponent,
    PaymentReciveableDashboardComponent,
    PaymentReciveableReportComponent
  ],
  imports: [
    CommonModule,
    PaymentRecivableRoutingModule,
    CoreModule,
    SharedModule,
    MatInputModule,
    MatSelectModule,
    ModalModule.forRoot(),
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    IconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    NgSelectModule,
    TongGridModule
  ]
})
export class PaymentRecivableModule { }
