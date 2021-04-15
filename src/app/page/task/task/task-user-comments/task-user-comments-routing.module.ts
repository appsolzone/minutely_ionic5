import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskUserCommentsPage } from './task-user-comments.page';

const routes: Routes = [
  {
    path: '',
    component: TaskUserCommentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskUserCommentsPageRoutingModule {}
