import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueDescriptionEditComponent } from './issue-description-edit.component';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
  ],
  declarations: [IssueDescriptionEditComponent],
  exports: [IssueDescriptionEditComponent]
})
export class IssueDescriptionEditModule {}
