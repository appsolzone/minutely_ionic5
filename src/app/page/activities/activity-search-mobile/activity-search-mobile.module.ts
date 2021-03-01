import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { ActivitySearchMobilePageRoutingModule } from './activity-search-mobile-routing.module';

import { ActivitySearchMobilePage } from './activity-search-mobile.page';

import { ActivitySearchModule } from '../activity-search/activity-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitySearchMobilePageRoutingModule,
    ActivitySearchModule,
  ],
  declarations: [
    ActivitySearchMobilePage,
  ]
})
export class ActivitySearchMobilePageModule {}
