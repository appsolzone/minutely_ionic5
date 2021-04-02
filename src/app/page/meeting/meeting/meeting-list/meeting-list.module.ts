import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingListComponent } from './meeting-list.component';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
  ],
  declarations: [MeetingListComponent],
  exports: [MeetingListComponent]
})
export class MeetingListModule {}
