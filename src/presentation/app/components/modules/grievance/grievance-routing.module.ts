import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceComponent } from './grievance/grievance.component';
import { GrievanceCreateComponent } from './grievance-create/grievance-create.component';
import { GrievanceReplyComponent } from './grievance-reply/grievance-reply.component';

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
        component: GrievanceComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'create',
        component: GrievanceCreateComponent,
        data: {
          title: 'Create'
        }
      },
      {
        path: 'grievanceReply',
        component: GrievanceReplyComponent,
        data: {
          title: 'Comment'
        }
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceRoutingModule { }
