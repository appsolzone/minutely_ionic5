import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamActivityStatsMobilePageRoutingModule } from './team-activity-stats-mobile-routing.module';

import { TeamActivityStatsMobilePage } from './team-activity-stats-mobile.page';
import { TeamActivityStatsComponentModule } from '../team-activity-stats/team-activity-stats.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamActivityStatsMobilePageRoutingModule,
    TeamActivityStatsComponentModule
  ],
  declarations: [TeamActivityStatsMobilePage]
})
export class TeamActivityStatsMobilePageModule {}
