import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueDetailsEditPage } from './issue-details-edit.page';

const routes: Routes = [
  {
    path: '',
    component: IssueDetailsEditPage
  },
  {
    path: 'add-member',
    loadChildren: () => import('src/app/page/admin/add-member/add-member.module').then( m => m.AddMemberPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueDetailsEditPageRoutingModule {}
