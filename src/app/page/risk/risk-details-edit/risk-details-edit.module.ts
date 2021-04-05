import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskDetailsEditPageRoutingModule } from './risk-details-edit-routing.module';

import { RiskDetailsEditPage } from './risk-details-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskDetailsEditPageRoutingModule
  ],
  declarations: [RiskDetailsEditPage],
  exports:[RiskDetailsEditPage]
})
export class RiskDetailsEditPageModule {}
