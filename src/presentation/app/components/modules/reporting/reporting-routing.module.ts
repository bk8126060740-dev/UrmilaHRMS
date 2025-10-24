import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from './reporting/reporting.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ReportViewComponent } from './report-view/report-view.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {

    path: 'dashboard',
    component: ReportingComponent,
    data: {
      title: 'Dashboard'
    }
  }, {
    path: 'createtemplate',
    component: CreateTemplateComponent,
    data: {
      title: 'Create Template'
    }
  }, {
    path: 'reportView',
    component: ReportViewComponent,
    data: {
      title: 'View Report'
    }

  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
