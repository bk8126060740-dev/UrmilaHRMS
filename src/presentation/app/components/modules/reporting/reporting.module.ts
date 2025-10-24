import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting/reporting.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CdkDrag, CdkDragPreview, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoreModule } from '../../core/core.module';
import { TongGridModule } from '@teamopine/to-ng-grid';


@NgModule({
  declarations: [
    ReportingComponent,
    CreateTemplateComponent,
    ReportViewComponent
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    PaginationModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    CdkDropList, CdkDrag, CdkDragPreview,
    DragDropModule,
    MatTooltipModule,
    CoreModule,
    NgSelectModule,
    TongGridModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line
})
export class ReportingModule { }
