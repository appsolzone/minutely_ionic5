import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateIssuePage } from './create-issue.page';

const routes: Routes = [
  {
    path: '',
    component: CreateIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateIssuePageRoutingModule {}
