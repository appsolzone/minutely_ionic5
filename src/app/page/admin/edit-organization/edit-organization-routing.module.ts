import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditOrganizationPage } from './edit-organization.page';

const routes: Routes = [
  {
    path: '',
    component: EditOrganizationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditOrganizationPageRoutingModule {}
