import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingDetailsEditPage } from './meeting-details-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MeetingDetailsEditPage
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
export class MeetingDetailsEditPageRoutingModule {}
