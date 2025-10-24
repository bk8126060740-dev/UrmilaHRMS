import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { SharedModule } from "../../shared/shared.module";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from "@angular/material/core";
import { CoreModule } from "../../core/core.module";
import { RecruitmentComponent } from "./recruitment/recruitment.component";
import { RecruitmentRoutingModule } from "./recruitment-routing.module";
import { RecruitmentCreateComponent } from "./recruitment-create/recruitment-create.component";
import { JobApplicationComponent } from "./job-application/job-application.component";
import { NgxEditorModule } from "ngx-editor";
import { CandidateCreateComponent } from "./candidate-create/candidate-create.component";
import { CustomDateAdapter } from "../project/custom-date-adapter";
import { MY_DATE_FORMATS } from "../project/project.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { SafeUrlPipe } from "../../../../../pipe/safe-url.pipe";
import { TongGridModule } from "@teamopine/to-ng-grid";

@NgModule({
  declarations: [
    RecruitmentComponent,
    RecruitmentCreateComponent,
    JobApplicationComponent,
    CandidateCreateComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    RecruitmentRoutingModule,
    BsDropdownModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    SharedModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    CoreModule,
    NgxEditorModule,
    NgSelectModule,
    ReactiveFormsModule,
    TongGridModule
  ],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
  ],
})
export class RecruitmentModule { }
