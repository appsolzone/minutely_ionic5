import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskUserCommentsPageRoutingModule } from './risk-user-comments-routing.module';

import { RiskUserCommentsPage } from './risk-user-comments.page';

import { FeatureCheckDirectiveModule } from 'src/app/directive/featurecheck/featurecheck.directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskUserCommentsPageRoutingModule,
    FeatureCheckDirectiveModule
  ],
  declarations: [RiskUserCommentsPage]
})
export class RiskUserCommentsPageModule {}
