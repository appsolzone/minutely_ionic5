import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamActivityStatsMobilePage } from './team-activity-stats-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: TeamActivityStatsMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamActivityStatsMobilePageRoutingModule {}
