import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrievanceRoutingModule } from './grievance-routing.module';
import { GrievanceComponent } from './grievance/grievance.component';
import { GrievanceCreateComponent } from './grievance-create/grievance-create.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from "../../shared/shared.module";
import { GrievanceReplyComponent } from './grievance-reply/grievance-reply.component';
import { CoreModule } from "../../core/core.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TongGridModule } from '@teamopine/to-ng-grid';

@NgModule({
  declarations: [
    GrievanceComponent,
    GrievanceCreateComponent,
    GrievanceReplyComponent
  ],
  imports: [
    CommonModule,
    GrievanceRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    SharedModule,
    CoreModule,
    FormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TongGridModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line

})
export class GrievanceModule {

}
