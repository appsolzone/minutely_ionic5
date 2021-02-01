import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageprofilePage } from './manageprofile.page';

const routes: Routes = [
  {
    path: '',
    component: ManageprofilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageprofilePageRoutingModule {}
