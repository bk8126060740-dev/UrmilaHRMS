import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionRoutingModule } from './permission-routing.module';
import { PermissionComponent } from './permission/permission.component';
import { CoreModule } from "../../core/core.module";
import { GrievanceRoutingModule } from '../grievance/grievance-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from '../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { ModalModule } from "ngx-bootstrap/modal";
import { CanDeactivateGuard } from '../../core/guards/canDeactivate/can-deactivate.guard';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    PermissionComponent,
    UserPermissionComponent
  ],
  imports: [
    CommonModule,
    PermissionRoutingModule,
    CoreModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckbox,
    ModalModule.forRoot(),
    NgSelectModule,
    MatTooltipModule
  ],
  providers: [CanDeactivateGuard]
})
export class PermissionModule { }
