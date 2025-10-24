import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IconModule } from "../../shared/Icon/icon.module";
import { CoreModule } from '../../core/core.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    IconModule,
    CoreModule,
    NgSelectModule,
    SharedModule,
    HighchartsChartModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line

})
export class DashboardModule { }
