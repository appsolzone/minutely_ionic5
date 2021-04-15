import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailsEditPage } from './task-details-edit.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailsEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailsEditPageRoutingModule {}
