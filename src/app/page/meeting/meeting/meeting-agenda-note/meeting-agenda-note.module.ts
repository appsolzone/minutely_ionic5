import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingAgendaNoteComponent } from './meeting-agenda-note.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MeetingAgendaNoteComponent],
  exports: [MeetingAgendaNoteComponent]
})
export class MeetingAgendaNoteModule {}
