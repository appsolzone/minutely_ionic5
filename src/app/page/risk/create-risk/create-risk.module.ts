import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRiskPageRoutingModule } from './create-risk-routing.module';

import { CreateRiskPage } from './create-risk.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRiskPageRoutingModule
  ],
  declarations: [CreateRiskPage]
})
export class CreateRiskPageModule {}
