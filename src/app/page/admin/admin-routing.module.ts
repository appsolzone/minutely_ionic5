import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';
// authguard
import { AuthguardService } from 'src/app/shared/authguard/authguard.service';

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
    loadChildren: () => import('./broadcast-message/broadcast-message.module').then( m => m.BroadcastMessagePageModule),
    canLoad: [AuthguardService],
    canActivate: [AuthguardService]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
