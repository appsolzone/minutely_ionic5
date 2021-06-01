import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingPageRoutingModule } from './meeting-routing.module';

import { MeetingListModule } from './meeting-list/meeting-list.module';

import { MeetingPage } from './meeting.page';

import { KpiModule } from 'src/app/page/kpi/kpi.module';

import { CalendarModule } from 'ion2-calendar';

import { FeatureCheckDirectiveModule } from 'src/app/directive/featurecheck/featurecheck.directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeetingPageRoutingModule,
    KpiModule,
    CalendarModule,
    MeetingListModule,
    FeatureCheckDirectiveModule
  ],
  declarations: [
    MeetingPage,
  ]
})
export class MeetingPageModule {}
