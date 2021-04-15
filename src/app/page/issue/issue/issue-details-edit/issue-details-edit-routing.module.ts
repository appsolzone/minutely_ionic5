import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueDetailsEditPage } from './issue-details-edit.page';

const routes: Routes = [
  {
    path: '',
    component: IssueDetailsEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueDetailsEditPageRoutingModule {}
