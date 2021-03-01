import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarModule } from 'ion2-calendar';

import { TimesheetPageRoutingModule } from './timesheet-routing.module';

import { TimesheetPage } from './timesheet.page';

import { ActivitiesSummaryModule } from '../../activities/activities-summary/activities-summary.module';

import { BargraphModule } from '../../bargraph/bargraph.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimesheetPageRoutingModule,
    CalendarModule,
    BargraphModule,
    ActivitiesSummaryModule
  ],
  declarations: [
    TimesheetPage,
  ]
})
export class TimesheetPageModule {}
