import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivitiesPageRoutingModule } from './activities-routing.module';

import { ActivitiesPage } from './activities.page';

import { CalendarModule } from 'ion2-calendar';

import { ActivitySearchComponent } from './activity-search/activity-search.component';

import { OngoingActivitiesComponent } from './ongoing-activities/ongoing-activities.component';

import { ActivitiesSummaryComponent } from './activities-summary/activities-summary.component';

import { BargraphComponent } from '../bargraph/bargraph.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitiesPageRoutingModule,
    CalendarModule,
  ],
  declarations: [
    ActivitiesPage,
    OngoingActivitiesComponent,
    ActivitiesSummaryComponent,
    ActivitySearchComponent,
    BargraphComponent
  ]
})
export class ActivitiesPageModule {}
