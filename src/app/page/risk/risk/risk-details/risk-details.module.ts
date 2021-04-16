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
import { RiskProbabilityImpactComponent } from '../risk-probability-impact/risk-probability-impact.component';
import { LinkageModule } from 'src/app/page/linkage/linkage.module';
import { SelectUsersModule } from 'src/app/page/select-users/select-users.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskDetailsPageRoutingModule,
    LinkageModule,
    SelectUsersModule
  ],
  declarations: [
    RiskDetailsPage,
    RiskBasicInfoComponent,
    RiskOwnerInitiatorComponent,
    RiskProbabilityImpactComponent,
    RiskMitigationContingencyComponent,
    RiskCommentsComponent
  ]
})
export class RiskDetailsPageModule {}
