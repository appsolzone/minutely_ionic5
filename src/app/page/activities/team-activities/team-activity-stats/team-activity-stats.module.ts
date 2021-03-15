import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BargraphModule } from 'src/app/page/bargraph/bargraph.module';

import { TeamActivityStatsComponent } from './team-activity-stats.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BargraphModule,
  ],
  declarations: [TeamActivityStatsComponent],
  exports: [TeamActivityStatsComponent]
})
export class TeamActivityStatsComponentModule {}
