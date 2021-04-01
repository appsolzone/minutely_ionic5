import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingAgendaNoteEditComponent } from './meeting-agenda-note-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MeetingAgendaNoteEditComponent],
  exports: [MeetingAgendaNoteEditComponent]
})
export class MeetingAgendaNoteEditModule {}
