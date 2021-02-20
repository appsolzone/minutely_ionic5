import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitiesPage } from './activities.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesPage
  },
  {
    path: 'activity-search',
    loadChildren: () => import('./activity-search/activity-search.module').then( m => m.ActivitySearchPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesPageRoutingModule {}
