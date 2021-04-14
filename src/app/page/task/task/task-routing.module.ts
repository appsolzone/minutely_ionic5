import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskPage } from './task.page';

const routes: Routes = [
  {
    path: '',
    component: TaskPage
  },
  {
    path: 'task-details',
    loadChildren: () => import('./task-details/task-details.module').then( m => m.TaskDetailsPageModule)
  },
  {
    path: 'task-details/:id',
    loadChildren: () => import('./task-details/task-details.module').then( m => m.TaskDetailsPageModule)
  },
  {
    path: 'task-details-linkage/:id',
    loadChildren: () => import('./task-details/task-details.module').then( m => m.TaskDetailsPageModule)
  },
  {
    path: 'task-details-edit',
    loadChildren: () => import('./task-details-edit/task-details-edit.module').then( m => m.TaskDetailsEditPageModule)
  },
  {
    path: 'create-task',
    loadChildren: () => import('./create-task/create-task.module').then( m => m.CreateTaskPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskPageRoutingModule {}
