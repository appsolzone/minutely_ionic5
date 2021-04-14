import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskPage } from './risk.page';

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
    loadChildren: () => import('./create-risk/create-risk.module').then( m => m.CreateRiskPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiskPageRoutingModule {}
