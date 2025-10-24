import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MasterRoutingModule } from "./master-routing.module";
import { CodeMasterComponent } from "./code-master/code-master.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { SharedModule } from "../../shared/shared.module";
import { CodeTypeMasterComponent } from "./code-type-master/code-type-master.component";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule } from "@angular/material/core";
import { PayrollAttributeComponent } from './payroll-attribute/payroll-attribute.component';
import { PayrollAttributeCreateComponent } from './payroll-attribute-create/payroll-attribute-create.component';
import { CoreModule } from "../../core/core.module";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DepartmentMasterComponent } from './department-master/department-master.component';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDragPreview,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DesignationMasterComponent } from './designation-master/designation-master.component';
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { BankMasterComponent } from './bank-master/bank-master.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { TongGridModule } from "@teamopine/to-ng-grid";

@NgModule({
  declarations: [CodeMasterComponent, CodeTypeMasterComponent, PayrollAttributeComponent, PayrollAttributeCreateComponent, DepartmentMasterComponent, DesignationMasterComponent, BankMasterComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    BsDropdownModule,
    PaginationModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    CoreModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    CdkDropList, CdkDrag, CdkDragPreview,
    MatTooltipModule,
    MatAutocompleteModule,
    NgSelectModule,
    TongGridModule
  ],
})
export class MasterModule { }
