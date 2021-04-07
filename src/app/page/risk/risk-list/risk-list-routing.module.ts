import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskListPage } from './risk-list.page';

const routes: Routes = [
  {
    path: '',
    component: RiskListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiskListPageRoutingModule {}
