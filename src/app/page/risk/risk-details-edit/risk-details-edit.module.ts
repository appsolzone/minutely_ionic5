import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskDetailsEditPageRoutingModule } from './risk-details-edit-routing.module';

import { RiskDetailsEditPage } from './risk-details-edit.page';
import { RiskBasicInfoEditPageModule } from '../risk-basic-info-edit/risk-basic-info-edit.module';
import { RiskMitigationContingencyEditModule } from '../risk-mitigation-contingency-edit/risk-mitigation-contingency-edit.module';
import { RiskProbabilityImpactEditPageModule } from '../risk-probability-impact-edit/risk-probability-impact-edit.module';
import { RiskOwnerInitiatorEditPageModule } from '../risk-owner-initiator-edit/risk-owner-initiator-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskDetailsEditPageRoutingModule,
    RiskBasicInfoEditPageModule,
    RiskMitigationContingencyEditModule,
    RiskProbabilityImpactEditPageModule,
    RiskOwnerInitiatorEditPageModule
  ],
  declarations: [RiskDetailsEditPage],
  exports:[RiskDetailsEditPage]
})
export class RiskDetailsEditPageModule {}
