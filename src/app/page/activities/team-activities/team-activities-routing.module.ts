import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamActivitiesPage } from './team-activities.page';

const routes: Routes = [
  {
    path: '',
    component: TeamActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamActivitiesPageRoutingModule {}
