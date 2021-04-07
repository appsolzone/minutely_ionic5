import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },  {
    path: 'add-member',
    loadChildren: () => import('./add-member/add-member.module').then( m => m.AddMemberPageModule)
  },
  {
    path: 'edit-organization',
    loadChildren: () => import('./edit-organization/edit-organization.module').then( m => m.EditOrganizationPageModule)
  },
  {
    path: 'broadcast-message',
    loadChildren: () => import('./broadcast-message/broadcast-message.module').then( m => m.BroadcastMessagePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
