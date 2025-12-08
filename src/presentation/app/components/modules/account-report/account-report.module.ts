import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { AccountReportComponent } from './account-report/account-report.component';
import { AccountReportRoutingModule } from './account-report-routing.module';
import { BankIntiatePaymentsComponent } from './bank-intiate-payments/bank-intiate-payments.component';

@NgModule({
  declarations: [
    AccountReportComponent,
    BankIntiatePaymentsComponent,
  ],
  imports: [
    CommonModule,
    AccountReportRoutingModule,
    CoreModule,
    SharedModule,
    MatInputModule,
    MatSelectModule,
    ModalModule.forRoot(),
    MatDatepickerModule,
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
export class AccountReportModule { }
