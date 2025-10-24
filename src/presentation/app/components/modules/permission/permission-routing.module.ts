import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './permission/permission.component';
import { CanDeactivateGuard } from '../../core/guards/canDeactivate/can-deactivate.guard';
import { UserPermissionComponent } from './user-permission/user-permission.component';

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
        component: PermissionComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Dashboard'
        }
      }, {
        path: 'user',
        component: UserPermissionComponent,
        data: {
          title: 'User Permission'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
