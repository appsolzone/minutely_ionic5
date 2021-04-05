import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RiskMitigationContingencyEditComponent } from './risk-mitigation-contingency-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [RiskMitigationContingencyEditComponent],
  exports: [RiskMitigationContingencyEditComponent]
})
export class RiskMitigationContingencyEditModule {}