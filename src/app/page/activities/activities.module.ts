import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivitiesPageRoutingModule } from './activities-routing.module';

import { ActivitiesPage } from './activities.page';

import { CalendarModule } from 'ion2-calendar';

import { ActivitySearchModule } from './activity-search/activity-search.module';

import { OngoingActivitiesModule } from './ongoing-activities/ongoing-activities.module';

import { ActivitiesSummaryModule } from './activities-summary/activities-summary.module';

// import { StartActivityComponent } from './start-activity/start-activity.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitiesPageRoutingModule,
    CalendarModule,
    ActivitySearchModule,
    ActivitiesSummaryModule,
    OngoingActivitiesModule
  ],
  declarations: [
    ActivitiesPage,
    // StartActivityComponent,
  ]
})
export class ActivitiesPageModule {}
