import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskPageRoutingModule } from './risk-routing.module';

import { RiskPage } from './risk.page';
import { SearchComponentPageModule } from '../../search-component/search-component.module';
import { KpiModule } from '../../kpi/kpi.module';
import { RiskListPageModule } from '../risk-list/risk-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskPageRoutingModule,
    SearchComponentPageModule,
    KpiModule,
    RiskListPageModule
  ],
  declarations: [RiskPage]
})
export class RiskPageModule {}
