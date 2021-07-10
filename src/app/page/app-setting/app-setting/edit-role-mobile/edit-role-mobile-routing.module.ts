import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRoleMobilePage } from './edit-role-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: EditRoleMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRoleMobilePageRoutingModule {}
