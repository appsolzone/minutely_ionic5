import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRiskPageRoutingModule } from './create-risk-routing.module';

import { CreateRiskPage } from './create-risk.page';
import { RiskBasicInfoEditPageModule } from '../risk-basic-info-edit/risk-basic-info-edit.module';
import { LinkageModule } from 'src/app/page/linkage/linkage.module';
import { RiskMitigationContingencyEditModule } from '../risk-mitigation-contingency-edit/risk-mitigation-contingency-edit.module';
import { RiskOwnerInitiatorEditPageModule } from '../risk-owner-initiator-edit/risk-owner-initiator-edit.module';
import { RiskProbabilityImpactEditPageModule } from '../risk-probability-impact-edit/risk-probability-impact-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRiskPageRoutingModule,
    LinkageModule,
    RiskBasicInfoEditPageModule,
    RiskMitigationContingencyEditModule,
    RiskOwnerInitiatorEditPageModule,
    RiskProbabilityImpactEditPageModule
  ],
  declarations: [CreateRiskPage]
})
export class CreateRiskPageModule {}
