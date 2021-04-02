import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingBasicInfoEditComponent } from './meeting-basic-info-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MeetingBasicInfoEditComponent],
  exports: [MeetingBasicInfoEditComponent]
})
export class MeetingBasicInfoEditModule {}
