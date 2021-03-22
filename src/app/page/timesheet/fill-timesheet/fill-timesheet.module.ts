import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarModule } from 'ion2-calendar';

import { FillTimesheetPageRoutingModule } from './fill-timesheet-routing.module';

import { FillTimesheetPage } from './fill-timesheet.page';

import { NewTimesheetEntryModule } from '../new-timesheet-entry/new-timesheet-entry.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FillTimesheetPageRoutingModule,
    CalendarModule,
    NewTimesheetEntryModule
  ],
  declarations: [FillTimesheetPage]
})
export class FillTimesheetPageModule {}
