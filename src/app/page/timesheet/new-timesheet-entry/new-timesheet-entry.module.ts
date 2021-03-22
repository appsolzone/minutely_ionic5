import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTimesheetEntryComponent } from './new-timesheet-entry.component';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
  ],
  declarations: [
    NewTimesheetEntryComponent
  ],
  exports: [
    NewTimesheetEntryComponent,
  ]
})
export class NewTimesheetEntryModule {}
