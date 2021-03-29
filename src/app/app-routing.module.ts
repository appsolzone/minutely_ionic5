import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'modal-page',
    loadChildren: () => import('./page/modal-page/modal-page.module').then( m => m.ModalPagePageModule)
  },
  {
    path: 'risk-list',
    loadChildren: () => import('./page/risk/risk-list/risk-list.module').then( m => m.RiskListPageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
