import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamActivitiesPage } from './team-activities.page';

const routes: Routes = [
  {
    path: '',
    component: TeamActivitiesPage
  },
  {
    path: 'team-activity-stats-mobile',
    loadChildren: () => import('./team-activity-stats-mobile/team-activity-stats-mobile.module').then( m => m.TeamActivityStatsMobilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamActivitiesPageRoutingModule {}
