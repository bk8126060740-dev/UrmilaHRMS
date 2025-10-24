import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnBoardComponent } from './on-board/on-board.component';
import { OnBoardWizardComponent } from './on-board-wizard/on-board-wizard.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';

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
        component: OnBoardComponent,
        data: {
          title: 'Dashboard'
        }
      },{
        path : 'create',
        component : OnBoardWizardComponent,
        data: {
          title: 'Create'
        }
      },{
        path : 'candidatelist',
        component : CandidateListComponent,
        data: {
          title: 'candidatelist'
        }
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnBoardRoutingModule { }
