import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client/client.component';
import { ClientCreateComponent } from './client-create/client-create.component';
import { SharedModule } from '../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CoreModule } from '../../core/core.module';
import { IsGrantedDirective } from '../../../../../domain/services/permission/is-granted.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TongGridModule } from '@teamopine/to-ng-grid';

@NgModule({
  declarations: [ClientComponent, ClientCreateComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    CoreModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TongGridModule
  ],
})
export class ClientModule { }
