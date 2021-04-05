import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskDetailsEditPage } from './risk-details-edit.page';

const routes: Routes = [
  {
    path: '',
    component: RiskDetailsEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiskDetailsEditPageRoutingModule {}
