import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ProjectRoutingModule } from "./project-routing.module";
import { ProjectComponent } from "./project/project.component";
import { ProjectCreateComponent } from "./project-create/project-create.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule } from "@angular/material/core";
import { CoreModule } from "../../core/core.module";
import { ProjectHolidayComponent } from "./project-holiday/project-holiday.component";
import { ProjectAttributeComponent } from './project-attribute/project-attribute.component';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './custom-date-adapter';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDragPreview,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { LottieComponent } from "ngx-lottie";
import { DirectiveModule } from "../../../../../directive/directive.module";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProjectAttributeCreateComponent } from './project-attribute-create/project-attribute-create.component';
import { TongGridModule } from "@teamopine/to-ng-grid";


export const MY_DATE_FORMATS = {
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    monthYearA11yLabel: 'Month and year',
    yearA11yLabel: 'Year',
  },
};

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectCreateComponent,
    ProjectHolidayComponent,
    ProjectAttributeComponent,
    ProjectAttributeCreateComponent,
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    BsDropdownModule,
    PaginationModule,
    FormsModule,
    SharedModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatCheckbox,
    DirectiveModule,
    NgSelectModule,
    CoreModule,
    CdkDropList, CdkDrag, CdkDragPreview,
    LottieComponent,
    MatTooltipModule,
    TongGridModule,

  ],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProjectModule { }
