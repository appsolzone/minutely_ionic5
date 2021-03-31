import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskPage } from './task.page';

const routes: Routes = [
  {
    path: '',
    component: TaskPage
  },
  {
    path: 'initiate',
    loadChildren: () => import('../../create-new-services/initiate/initiate.module').then( m => m.InitiatePageModule)
  },
  {
    path: 'select-members',
    loadChildren: () => import('../../create-new-services/select-members/select-members.module').then( m => m.SelectMembersPageModule)
  },
   {
    path: 'description',
    loadChildren: () => import('../../create-new-services/description/description.module').then( m => m.DescriptionPageModule)
  },
    {
    path: 'preview',
    loadChildren: () => import('../../create-new-services/preview/preview.module').then( m => m.PreviewPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('../../search-component/search-component.module').then( m => m.SearchComponentPageModule)
  },
  {
    path: 'task-details',
    loadChildren: () => import('../../task/task-details/task-details.module').then( m => m.TaskDetailsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskPageRoutingModule {}
