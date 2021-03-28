import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskMatrixComponent } from './risk-matrix.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    RiskMatrixComponent,
  ],
  exports: [
    RiskMatrixComponent,
  ]
})
export class RiskMatrixModule {}
