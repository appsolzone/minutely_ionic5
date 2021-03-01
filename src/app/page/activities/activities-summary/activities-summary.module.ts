import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BargraphModule } from '../../bargraph/bargraph.module';

import { ActivitiesSummaryComponent } from './activities-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BargraphModule,
  ],
  declarations: [
    ActivitiesSummaryComponent
  ],
  exports: [
    ActivitiesSummaryComponent,
  ]
})
export class ActivitiesSummaryModule {}
