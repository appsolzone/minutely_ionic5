import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarModule } from 'ion2-calendar';

import { ActivitySearchMobilePageRoutingModule } from './activity-search-mobile-routing.module';

import { ActivitySearchMobilePage } from './activity-search-mobile.page';

import { ActivitySearchComponent } from '../activity-search/activity-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitySearchMobilePageRoutingModule,
    CalendarModule,
  ],
  declarations: [
    ActivitySearchMobilePage,
    ActivitySearchComponent
  ]
})
export class ActivitySearchMobilePageModule {}
