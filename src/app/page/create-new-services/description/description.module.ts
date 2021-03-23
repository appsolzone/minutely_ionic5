import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescriptionPageRoutingModule } from './description-routing.module';

import { DescriptionPage } from './description.page';
import { SummaryPageModule } from '../summary/summary.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DescriptionPageRoutingModule,
    SummaryPageModule
  ],
  declarations: [DescriptionPage],
  exports:[DescriptionPage]
})
export class DescriptionPageModule {}
