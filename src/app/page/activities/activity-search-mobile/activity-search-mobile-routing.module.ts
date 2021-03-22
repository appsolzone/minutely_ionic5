import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitySearchMobilePage } from './activity-search-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitySearchMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitySearchMobilePageRoutingModule {}
