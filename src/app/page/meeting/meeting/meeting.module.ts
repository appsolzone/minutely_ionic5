import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingPageRoutingModule } from './meeting-routing.module';

import { MeetingListComponent } from './meeting-list/meeting-list.component';

import { MeetingPage } from './meeting.page';

import { KpiModule } from 'src/app/page/kpi/kpi.module';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeetingPageRoutingModule,
    KpiModule,
    CalendarModule
  ],
  declarations: [
    MeetingPage,
    MeetingListComponent
  ]
})
export class MeetingPageModule {}
