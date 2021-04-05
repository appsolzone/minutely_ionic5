import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },  {
    path: 'task-list',
    loadChildren: () => import('./page/task/task-list/task-list.module').then( m => m.TaskListPageModule)
  },
  {
    path: 'create-risk',
    loadChildren: () => import('./page/risk/create-risk/create-risk.module').then( m => m.CreateRiskPageModule)
  },
  {
    path: 'risk-basic-info-edit',
    loadChildren: () => import('./page/risk/risk-basic-info-edit/risk-basic-info-edit.module').then( m => m.RiskBasicInfoEditPageModule)
  },
  {
    path: 'risk-probability-impact-edit',
    loadChildren: () => import('./page/risk/risk-probability-impact-edit/risk-probability-impact-edit.module').then( m => m.RiskProbabilityImpactEditPageModule)
  },
  {
    path: 'risk-owner-initiator-edit',
    loadChildren: () => import('./page/risk/risk-owner-initiator-edit/risk-owner-initiator-edit.module').then( m => m.RiskOwnerInitiatorEditPageModule)
  },
  {
    path: 'risk-details-edit',
    loadChildren: () => import('./page/risk/risk-details-edit/risk-details-edit.module').then( m => m.RiskDetailsEditPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
