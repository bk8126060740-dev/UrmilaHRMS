import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttandanceComponent } from './attandance/attandance.component';
import { ProjectattendanceuploadComponent } from './projectattendanceupload/projectattendanceupload.component';
import { EmployeeattandanceComponent } from './employeeattandance/employeeattandance.component';

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
        component: AttandanceComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'attendaceupload',
        component: ProjectattendanceuploadComponent,
        data: {
          title: 'Project Attendance Upload'
        }
      },
      {
        path: 'employeeattendace',
        component: EmployeeattandanceComponent,
        data: {
          title: 'Employee Attendance'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttandanceRoutingModule { }
