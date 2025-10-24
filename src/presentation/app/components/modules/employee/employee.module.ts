import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee/employee.component';
import { SharedModule } from '../../shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { CoreModule } from '../../core/core.module';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { CustomDateAdapter } from '../project/custom-date-adapter';
import { MY_DATE_FORMATS } from '../project/project.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TongGridModule } from '@teamopine/to-ng-grid';

@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeCreateComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    BsDropdownModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    CoreModule,
    NgSelectModule,
    TongGridModule
  ],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ]
})
export class EmployeeModule { }
