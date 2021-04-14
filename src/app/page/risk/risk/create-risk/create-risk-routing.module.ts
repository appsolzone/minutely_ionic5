import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateRiskPage } from './create-risk.page';

const routes: Routes = [
  {
    path: '',
    component: CreateRiskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateRiskPageRoutingModule {}
