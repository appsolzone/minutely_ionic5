import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMeetingPageRoutingModule } from './create-meeting-routing.module';

import { MeetingBasicInfoEditModule } from '../meeting-basic-info-edit/meeting-basic-info-edit.module';
import { MeetingAttendeesEditModule } from '../meeting-attendees-edit/meeting-attendees-edit.module';
import { MeetingAgendaNoteEditModule } from '../meeting-agenda-note-edit/meeting-agenda-note-edit.module';
import { MeetingLocationEditModule } from '../meeting-location-edit/meeting-location-edit.module';


import { LinkageModule } from 'src/app/page/linkage/linkage.module';

import { CreateMeetingPage } from './create-meeting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMeetingPageRoutingModule,
    LinkageModule,
    MeetingBasicInfoEditModule,
    MeetingAttendeesEditModule,
    MeetingAgendaNoteEditModule,
    MeetingLocationEditModule,
  ],
  declarations: [CreateMeetingPage]
})
export class CreateMeetingPageModule {}
