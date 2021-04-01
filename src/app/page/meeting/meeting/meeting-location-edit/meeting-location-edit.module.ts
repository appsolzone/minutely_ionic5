import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingLocationEditComponent } from './meeting-location-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MeetingLocationEditComponent],
  exports: [MeetingLocationEditComponent]
})
export class MeetingLocationEditModule {}
