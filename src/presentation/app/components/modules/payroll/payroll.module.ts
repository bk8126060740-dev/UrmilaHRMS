import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { PayrollComponent } from './payroll/payroll.component';
import { SharedModule } from '../../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PayrollEmployeesComponent } from './payroll-employees/payroll-employees.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CoreModule } from "../../core/core.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayrollDetailsComponent } from './payroll-details/payroll-details.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconModule } from '../../shared/Icon/icon.module';
import { BankSheetListComponent } from './bank-sheet-list/bank-sheet-list.component';
import { BankSheetReportComponent } from './bank-sheet-report/bank-sheet-report.component';
import { TongGridModule } from '@teamopine/to-ng-grid';


@NgModule({
  declarations: [
    PayrollComponent,
    PayrollEmployeesComponent,
    PayrollDetailsComponent,
    BankSheetListComponent,
    BankSheetReportComponent,
  ],
  imports: [
    PayrollRoutingModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    SharedModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    PaginationModule,
    MatTooltipModule,
    IconModule,
    TongGridModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line   

})
export class PayrollModule { }

