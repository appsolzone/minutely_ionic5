import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateIssuePage } from './create-issue.page';

const routes: Routes = [
  {
    path: '',
    component: CreateIssuePage
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
export class CreateIssuePageRoutingModule {}
