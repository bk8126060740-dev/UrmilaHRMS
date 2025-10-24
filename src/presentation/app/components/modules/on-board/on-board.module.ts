import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { OnBoardRoutingModule } from './on-board-routing.module';
import { OnBoardComponent } from './on-board/on-board.component';
import { SharedModule } from '../../shared/shared.module';

import { OnBoardWizardComponent } from './on-board-wizard/on-board-wizard.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from '../../core/core.module';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { DragDirective } from '../../../../../directive/dragDrop.directive';
import { CustomDateAdapter } from '../project/custom-date-adapter';
import { MY_DATE_FORMATS } from '../project/project.module';
import { DirectiveModule } from '../../../../../directive/directive.module';
import { TongGridModule } from '@teamopine/to-ng-grid';



@NgModule({
  declarations: [
    OnBoardComponent,
    OnBoardWizardComponent,
    CandidateListComponent,
  ],
  imports: [
    CommonModule,
    OnBoardRoutingModule,
    BsDropdownModule,
    PaginationModule,
    FormsModule,
    SharedModule,
    DirectiveModule,
    ModalModule.forRoot(),
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NgSelectModule,
    CoreModule,
    TongGridModule
  ],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ]
})
export class OnBoardModule { }
