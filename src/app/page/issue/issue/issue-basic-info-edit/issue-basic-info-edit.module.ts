import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueBasicInfoEditComponent } from './issue-basic-info-edit.component';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
  ],
  declarations: [IssueBasicInfoEditComponent],
  exports: [IssueBasicInfoEditComponent]
})
export class IssueBasicInfoEditModule {}
