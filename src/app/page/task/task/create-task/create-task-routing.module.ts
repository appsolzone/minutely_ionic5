import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTaskPage } from './create-task.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTaskPage
  },
  {
    path: 'add-member',
    loadChildren: () => import('src/app/page/admin/add-member/add-member.module').then( m => m.AddMemberPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTaskPageRoutingModule {}
