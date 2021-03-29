import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskPage } from './risk.page';

const routes: Routes = [
  {
    path: '',
    component: RiskPage
  },
    {
    path: 'initiate',
    loadChildren: () => import('../../create-new-services/initiate/initiate.module').then( m => m.InitiatePageModule)
  },
  {
    path: 'select-members',
    loadChildren: () => import('../../create-new-services/select-members/select-members.module').then( m => m.SelectMembersPageModule)
  },
   {
    path: 'description',
    loadChildren: () => import('../../create-new-services/description/description.module').then( m => m.DescriptionPageModule)
  },
    {
    path: 'preview',
    loadChildren: () => import('../../create-new-services/preview/preview.module').then( m => m.PreviewPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('../../search-component/search-component.module').then( m => m.SearchComponentPageModule)
  },
  {
    path: 'risk-details',
    loadChildren: () => import('../../risk/risk-details/risk-details.module').then( m => m.RiskDetailsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiskPageRoutingModule {}
