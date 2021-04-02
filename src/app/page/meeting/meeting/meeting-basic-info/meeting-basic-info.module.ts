import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingBasicInfoComponent } from './meeting-basic-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MeetingBasicInfoComponent],
  exports: [MeetingBasicInfoComponent]
})
export class MeetingBasicInfoModule {}
