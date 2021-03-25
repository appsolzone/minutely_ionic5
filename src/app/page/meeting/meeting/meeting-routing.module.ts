import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingPage } from './meeting.page';

const routes: Routes = [
  {
    path: '',
    component: MeetingPage
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
    path: 'meeting-details',
    loadChildren: () => import('./meeting-details/meeting-details.module').then( m => m.MeetingDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingPageRoutingModule {}
