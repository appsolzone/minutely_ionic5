import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMeetingPage } from './create-meeting.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMeetingPage
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
export class CreateMeetingPageRoutingModule {}
