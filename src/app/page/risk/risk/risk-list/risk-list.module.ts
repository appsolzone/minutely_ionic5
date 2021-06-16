import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskListPageRoutingModule } from './risk-list-routing.module';

import { RiskMatrixModule } from 'src/app/page/risk-matrix/risk-matrix.module';

import { RiskListPage } from './risk-list.page';

import { CalendarModule } from 'ion2-calendar';

import { FeatureCheckDirectiveModule } from 'src/app/directive/featurecheck/featurecheck.directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskListPageRoutingModule,
    RiskMatrixModule,
    CalendarModule,
    FeatureCheckDirectiveModule,
  ],
  declarations: [RiskListPage],
  exports:[RiskListPage]
})
export class RiskListPageModule {}
