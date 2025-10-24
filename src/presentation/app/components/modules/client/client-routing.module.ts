import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ClientCreateComponent } from './client-create/client-create.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: ClientComponent,
        data: {
          title: 'Dashboard'
        }
      }, {
        path: 'create',
        component: ClientCreateComponent,
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
export class ClientRoutingModule { }
