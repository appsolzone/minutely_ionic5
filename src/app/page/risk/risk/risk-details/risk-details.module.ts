import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskDetailsPageRoutingModule } from './risk-details-routing.module';

import { RiskDetailsPage } from './risk-details.page';
import { RiskBasicInfoComponent } from '../risk-basic-info/risk-basic-info.component';
import { RiskOwnerInitiatorComponent } from '../risk-owner-initiator/risk-owner-initiator.component';
import { RiskMitigationContingencyComponent } from '../risk-mitigation-contingency/risk-mitigation-contingency.component';
import { RiskCommentsComponent } from '../risk-comments/risk-comments.component';
import { RiskProbabilityImpactComponentModule } from '../risk-probability-impact/risk-probability-impact.module';
import { LinkageModule } from 'src/app/page/linkage/linkage.module';
import { SelectUsersModule } from 'src/app/page/select-users/select-users.module';

import { FeatureCheckDirectiveModule } from 'src/app/directive/featurecheck/featurecheck.directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskDetailsPageRoutingModule,
    LinkageModule,
    SelectUsersModule,
    FeatureCheckDirectiveModule,
    RiskProbabilityImpactComponentModule,
  ],
  declarations: [
    RiskDetailsPage,
    RiskBasicInfoComponent,
    RiskOwnerInitiatorComponent,
    RiskMitigationContingencyComponent,
    RiskCommentsComponent
  ]
})
export class RiskDetailsPageModule {}
