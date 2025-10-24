import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplianceRoutingModule } from './compliance-routing.module';
import { PFDashboardComponent } from './pfdashboard/pfdashboard.component';
import { CoreModule } from "../../core/core.module";
import { share } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { PFContributionReportComponent } from './pfcontribution-report/pfcontribution-report.component';
import { ReportComponent } from './report/report.component';
import { EsicContributionReportComponent } from './esic-contribution-report/esic-contribution-report.component';
import { EsicDashboardComponent } from './esic-dashboard/esic-dashboard.component';


@NgModule({
  declarations: [
    PFDashboardComponent,
    PFContributionReportComponent,
    ReportComponent,
    EsicContributionReportComponent,
    EsicDashboardComponent
  ],
  imports: [
    CommonModule,
    ComplianceRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTooltipModule,
    ModalModule,
    ReactiveFormsModule,
    NgSelectModule

  ]
})
export class ComplianceModule { }
