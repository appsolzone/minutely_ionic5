import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingDetailsPageRoutingModule } from './meeting-details-routing.module';

import { MeetingBasicInfoModule } from '../meeting-basic-info/meeting-basic-info.module';
import { MeetingAttendeesModule } from '../meeting-attendees/meeting-attendees.module';
import { MeetingAgendaNoteModule } from '../meeting-agenda-note/meeting-agenda-note.module';
import { MeetingLocationModule } from '../meeting-location/meeting-location.module';

import { LinkageModule } from 'src/app/page/linkage/linkage.module';

import { MeetingDetailsPage } from './meeting-details.page';

import { FeatureCheckDirectiveModule } from 'src/app/directive/featurecheck/featurecheck.directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MeetingDetailsPageRoutingModule,
    LinkageModule,
    MeetingBasicInfoModule,
    MeetingAttendeesModule,
    MeetingAgendaNoteModule,
    MeetingLocationModule,
    FeatureCheckDirectiveModule
  ],
  declarations: [
    MeetingDetailsPage,
  ]
})
export class MeetingDetailsPageModule {}
