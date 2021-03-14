import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamActivitiesPageRoutingModule } from './team-activities-routing.module';

import { TeamActivitiesPage } from './team-activities.page';

import { BargraphModule } from 'src/app/page/bargraph/bargraph.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamActivitiesPageRoutingModule,
    BargraphModule
  ],
  declarations: [TeamActivitiesPage]
})
export class TeamActivitiesPageModule {}
