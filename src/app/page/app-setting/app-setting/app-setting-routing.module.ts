import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppSettingPage } from './app-setting.page';

const routes: Routes = [
  {
    path: '',
    component: AppSettingPage
  },
  {
    path: 'manageroles',
    loadChildren: () => import('src/app/page/app-setting/app-setting/manageroles/manageroles.module').then( m => m.ManagerolesPageModule)
  },
  {
    path: 'edit-role-mobile',
    loadChildren: () => import('./edit-role-mobile/edit-role-mobile.module').then( m => m.EditRoleMobilePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppSettingPageRoutingModule {}
