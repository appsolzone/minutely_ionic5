import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskPage } from './risk.page';

// authguard
import { AuthguardService } from 'src/app/shared/authguard/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: RiskPage
  },
  {
    path: 'risk-details',
    loadChildren: () => import('./risk-details/risk-details.module').then( m => m.RiskDetailsPageModule)
  },
    {
    path: 'risk-details/:id',
    loadChildren: () => import('./risk-details/risk-details.module').then( m => m.RiskDetailsPageModule)
  },
    {
    path: 'risk-details-linkage/:id',
    loadChildren: () => import('./risk-details/risk-details.module').then( m => m.RiskDetailsPageModule)
  },
  {
    path: 'risk-details-edit',
    loadChildren: () => import('./risk-details-edit/risk-details-edit.module').then( m => m.RiskDetailsEditPageModule)
  },
  {
    path: 'create-risk',
    loadChildren: () => import('./create-risk/create-risk.module').then( m => m.CreateRiskPageModule),
    canLoad: [AuthguardService],
    canActivate: [AuthguardService]
  },
  {
    path: 'comments',
    loadChildren: () => import('./risk-user-comments/risk-user-comments.module').then( m => m.RiskUserCommentsPageModule)
  },
  {
    path: 'send-email',
    loadChildren: () => import('../../send-email/send-email.module').then( m => m.SendEmailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiskPageRoutingModule {}
