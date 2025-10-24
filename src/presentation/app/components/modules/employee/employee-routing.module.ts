import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';


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
        component: EmployeeComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'create',
        component: EmployeeCreateComponent,
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
export class EmployeeRoutingModule { }
