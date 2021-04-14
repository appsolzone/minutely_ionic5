import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskUserCommentsPage } from './risk-user-comments.page';

const routes: Routes = [
  {
    path: '',
    component: RiskUserCommentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiskUserCommentsPageRoutingModule {}
