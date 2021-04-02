import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectMembersPage } from './select-members.page';

const routes: Routes = [
  {
    path: '',
    component: SelectMembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectMembersPageRoutingModule {}
