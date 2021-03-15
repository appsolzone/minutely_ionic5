import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamActivitiesPageRoutingModule } from './team-activities-routing.module';

import { TeamActivitiesPage } from './team-activities.page';
import { TeamOngoingActivitiesComponent } from './team-ongoing-activities/team-ongoing-activities.component';
import { TeamActivityStatsComponentModule } from './team-activity-stats/team-activity-stats.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamActivitiesPageRoutingModule,
    TeamActivityStatsComponentModule,
  ],
  declarations: [
    TeamActivitiesPage,
    TeamOngoingActivitiesComponent
  ]
})
export class TeamActivitiesPageModule {}
