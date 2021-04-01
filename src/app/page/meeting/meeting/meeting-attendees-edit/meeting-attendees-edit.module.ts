import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingAttendeesEditComponent } from './meeting-attendees-edit.component';
import { SelectUsersModule } from 'src/app/page/select-users/select-users.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectUsersModule
  ],
  declarations: [MeetingAttendeesEditComponent],
  exports: [MeetingAttendeesEditComponent]
})
export class MeetingAttendeesEditModule {}
