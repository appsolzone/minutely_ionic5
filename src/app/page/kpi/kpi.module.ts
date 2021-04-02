import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskMatrixModule } from 'src/app/page/risk-matrix/risk-matrix.module';

import { KpiComponent } from './kpi.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskMatrixModule,
  ],
  declarations: [
    KpiComponent
  ],
  exports: [
    KpiComponent,
  ]
})
export class KpiModule {}
