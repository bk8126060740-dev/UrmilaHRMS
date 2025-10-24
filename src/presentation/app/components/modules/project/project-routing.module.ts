import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectHolidayComponent } from './project-holiday/project-holiday.component';
import { ProjectAttributeComponent } from './project-attribute/project-attribute.component';
import { ProjectAttributeCreateComponent } from './project-attribute-create/project-attribute-create.component';


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
        component: ProjectComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'create',
        component: ProjectCreateComponent,
        data: {
          title: 'Create'
        }
      },
      {
        path: 'holiday',
        component: ProjectHolidayComponent,
        data: {
          title: 'Holiday Calendar'
        }
      },
      {
        path: 'attribute',
        component: ProjectAttributeComponent,
        data: {
          title: 'Project Attribute'
        }
      }, {
        path: 'attributeCreate',
        component: ProjectAttributeCreateComponent,
        data: {
          title: 'Create Attribute'
        }
      }
    ]

  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
