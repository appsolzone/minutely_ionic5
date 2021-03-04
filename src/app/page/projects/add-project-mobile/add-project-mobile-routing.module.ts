import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProjectMobilePage } from './add-project-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: AddProjectMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProjectMobilePageRoutingModule {}
