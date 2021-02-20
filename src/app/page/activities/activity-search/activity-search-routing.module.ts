import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitySearchPage } from './activity-search.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitySearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitySearchPageRoutingModule {}
