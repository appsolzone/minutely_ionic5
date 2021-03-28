import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingDetailsPageRoutingModule } from './meeting-details-routing.module';

import { MeetingBasicInfoComponent } from '../meeting-basic-info/meeting-basic-info.component';
import { MeetingAttendeesComponent } from '../meeting-attendees/meeting-attendees.component';
import { MeetingAgendaNoteComponent } from '../meeting-agenda-note/meeting-agenda-note.component';
import { MeetingLocationComponent } from '../meeting-location/meeting-location.component';

import { LinkageModule } from 'src/app/page/linkage/linkage.module';

import { MeetingDetailsPage } from './meeting-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MeetingDetailsPageRoutingModule,
    LinkageModule
  ],
  declarations: [
    MeetingDetailsPage,
    MeetingBasicInfoComponent,
    MeetingAttendeesComponent,
    MeetingAgendaNoteComponent,
    MeetingLocationComponent
  ]
})
export class MeetingDetailsPageModule {}
