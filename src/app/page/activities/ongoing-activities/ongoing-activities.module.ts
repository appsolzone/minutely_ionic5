import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OngoingActivitiesComponent } from './ongoing-activities.component';

import { StartActivityComponent } from '../start-activity/start-activity.component';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
  ],
  declarations: [
    OngoingActivitiesComponent,
    StartActivityComponent
  ],
  exports: [
    OngoingActivitiesComponent,
    StartActivityComponent
  ]
})
export class OngoingActivitiesModule {}
