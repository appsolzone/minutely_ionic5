import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingAttendeesComponent } from './meeting-attendees.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MeetingAttendeesComponent],
  exports: [MeetingAttendeesComponent]
})
export class MeetingAttendeesModule {}
