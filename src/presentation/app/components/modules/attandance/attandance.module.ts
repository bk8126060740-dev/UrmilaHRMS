import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttandanceRoutingModule } from './attandance-routing.module';
import { AttandanceComponent } from './attandance/attandance.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '../../shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CoreModule } from "../../core/core.module";
import { LottieComponent } from 'ngx-lottie';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectiveModule } from '../../../../../directive/directive.module';
import { ProjectattendanceuploadComponent } from './projectattendanceupload/projectattendanceupload.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeattandanceComponent } from './employeeattandance/employeeattandance.component';
import { TongGridModule } from '@teamopine/to-ng-grid';

@NgModule({
  declarations: [
    AttandanceComponent,
    ProjectattendanceuploadComponent,
    EmployeeattandanceComponent
  ],
  imports: [
    CommonModule,
    AttandanceRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    SharedModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    DirectiveModule,
    ModalModule.forRoot(),
    CoreModule,
    LottieComponent,
    NgSelectModule,
    PaginationModule,
    MatTooltipModule,
    TongGridModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line

})
export class AttandanceModule { }
