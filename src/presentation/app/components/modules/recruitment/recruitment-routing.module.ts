import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { RecruitmentCreateComponent } from './recruitment-create/recruitment-create.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { CandidateCreateComponent } from './candidate-create/candidate-create.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: RecruitmentComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'newopportunity',
        component: RecruitmentCreateComponent,
        data: {
          title: 'Jobs Create'
        }
      },
      {
        path: 'jobapplication',
        component: JobApplicationComponent,
        data: {
          title: 'Process Application'
        }
      },
      {
        path: 'createcandidate',
        component: CandidateCreateComponent,
        data: {
          title: 'Create'
        }
      }

    ]

  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentRoutingModule { }
