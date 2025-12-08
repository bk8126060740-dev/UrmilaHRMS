import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PFDashboardComponent } from './pfdashboard/pfdashboard.component';
import { PFContributionReportComponent } from './pfcontribution-report/pfcontribution-report.component';
import { ReportComponent } from './report/report.component';
import { EsicDashboardComponent } from './esic-dashboard/esic-dashboard.component';
import { EsicContributionReportComponent } from './esic-contribution-report/esic-contribution-report.component';
import { MissingContributionReportComponent } from './missing-contribution-report/missing-contribution-report.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'pfdashboard',
    pathMatch: 'full'
  }, {

    path: 'pfdashboard',
    component: PFDashboardComponent,
    data: {
      title: 'EPF Dashboard'
    }
  }, {
    path: 'pfcontribution-report',
    component: PFContributionReportComponent,
    data: {
      title: 'PF Contribution Report'
    }
  }, {

    path: 'esicdashboard',
    component: EsicDashboardComponent,
    data: {
      title: 'ESIC Dashboard'
    }
  }, {
    path: 'esiccontribution-report',
    component: EsicContributionReportComponent,
    data: {
      title: 'ESIC Contribution Report'
    }
  },
  {
    path: 'missing-contribution-report',
    component: MissingContributionReportComponent,
    data: {
      title: 'Missing EPFO Contribution Report'
    }
  },
  {
    path: 'report',
    component: ReportComponent,
    data: {
      title: 'Report'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplianceRoutingModule { }
