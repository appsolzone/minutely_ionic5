import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerolesPage } from './manageroles.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerolesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerolesPageRoutingModule {}
