import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from '../core/core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { AddressComponent } from './address/address.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { ExperienceComponent } from './experience/experience.component';
import { QualificationsComponent } from './qualifications/qualifications.component';
import { DocumentsComponent } from './documents/documents.component';
import { FinacialDetailsComponent } from './finacial-details/finacial-details.component';
import { SalarySlipComponent } from './salary-slip/salary-slip.component';
import { BgVerficationsComponent } from './bg-verfications/bg-verfications.component';
import { FamilyDetailsComponent } from './family-details/family-details.component';
import { ProjectHistoryComponent } from './project-history/project-history.component';
import { PfAccountDetailsComponent } from './pf-account-details/pf-account-details.component';
import { EsicAccountDetailsComponent } from './esic-account-details/esic-account-details.component';
import { PayrollAttributeComponent } from './payroll-attribute/payroll-attribute.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectiveModule } from '../../../../directive/directive.module';
import { IsGrantedDirective } from '../../../../domain/services/permission/is-granted.directive';
import { DesignationHistoryComponent } from './designation-history/designation-history.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CodeMasterComponent } from './code-master/code-master.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TimeFormatPipe } from '../../../../pipe/time-formate.pipe';
import { IconModule } from './Icon/icon.module';
import { MatIconModule } from '@angular/material/icon';
import { TongGridModule } from '@teamopine/to-ng-grid';

@NgModule({
  declarations: [
    BasicDetailsComponent,
    AddressComponent,
    ContactInfoComponent,
    ExperienceComponent,
    QualificationsComponent,
    DocumentsComponent,
    FinacialDetailsComponent,
    SalarySlipComponent,
    BgVerficationsComponent,
    FamilyDetailsComponent,
    ProjectHistoryComponent,
    PfAccountDetailsComponent,
    EsicAccountDetailsComponent,
    PayrollAttributeComponent,
    IsGrantedDirective,
    DesignationHistoryComponent,
    CodeMasterComponent,
    TimeFormatPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    NgSelectModule,
    CoreModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ModalModule.forRoot(),
    MatNativeDateModule,
    DirectiveModule,
    MatAutocompleteModule,
    MatTooltipModule,
    IconModule,
    MatIconModule,
    TongGridModule
  ],
  exports: [
    BasicDetailsComponent,
    AddressComponent,
    ContactInfoComponent,
    ExperienceComponent,
    QualificationsComponent,
    DocumentsComponent,
    FinacialDetailsComponent,
    SalarySlipComponent,
    BgVerficationsComponent,
    FamilyDetailsComponent,
    ProjectHistoryComponent,
    PfAccountDetailsComponent,
    EsicAccountDetailsComponent,
    PayrollAttributeComponent,
    IsGrantedDirective,
    DirectiveModule,
    DesignationHistoryComponent,
    CodeMasterComponent,
    TimeFormatPipe,
    IconModule
  ]


})
export class SharedModule { }
