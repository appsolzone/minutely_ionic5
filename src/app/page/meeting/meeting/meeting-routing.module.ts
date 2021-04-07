import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingPage } from './meeting.page';

const routes: Routes = [
  {
    path: '',
    component: MeetingPage
  },
  {
    path: 'meeting-details',
    loadChildren: () => import('./meeting-details/meeting-details.module').then( m => m.MeetingDetailsPageModule)
  },
  {
    path: 'meeting-details-linkage/:id',
    loadChildren: () => import('./meeting-details/meeting-details.module').then( m => m.MeetingDetailsPageModule)
  },
  {
    path: 'meeting-details-edit',
    loadChildren: () => import('./meeting-details-edit/meeting-details-edit.module').then( m => m.MeetingDetailsEditPageModule)
  },
  {
    path: 'create-meeting',
    loadChildren: () => import('./create-meeting/create-meeting.module').then( m => m.CreateMeetingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingPageRoutingModule {}
