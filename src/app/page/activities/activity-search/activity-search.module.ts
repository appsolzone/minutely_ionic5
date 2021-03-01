import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivitySearchComponent } from './activity-search.component';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
  ],
  declarations: [
    ActivitySearchComponent
  ],
  exports: [
    ActivitySearchComponent,
  ]
})
export class ActivitySearchModule {}
