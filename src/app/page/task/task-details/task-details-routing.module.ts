import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailsPage } from './task-details.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailsPage
  },
  {
    path: 'comments',
    loadChildren: () => import('../../../page/user-comments/user-comments.module').then( m => m.UserCommentsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailsPageRoutingModule {}
