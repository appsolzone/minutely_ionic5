import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskDetailsPageRoutingModule } from './risk-details-routing.module';

import { RiskDetailsPage } from './risk-details.page';
import { ModalPagePageModule } from '../../modal-page/modal-page.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskDetailsPageRoutingModule,
    ModalPagePageModule
  ],
  declarations: [RiskDetailsPage]
})
export class RiskDetailsPageModule {}
