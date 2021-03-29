import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskDetailsPage } from './risk-details.page';

const routes: Routes = [
  {
    path: '',
    component: RiskDetailsPage
  },
  {
    path: 'comments',
    loadChildren: () => import('../../../page/user-comments/user-comments.module').then( m => m.UserCommentsPageModule)
  },
  {
    path: 'select-members',
    loadChildren: () => import('../../../page/create-new-services/select-members/select-members.module').then( m => m.SelectMembersPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiskDetailsPageRoutingModule {}
