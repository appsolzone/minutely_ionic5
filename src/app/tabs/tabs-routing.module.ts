import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
// authguard
import { AuthguardService } from 'src/app/shared/authguard/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../page/profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('../page/admin/admin.module').then( m => m.AdminPageModule),
        canLoad: [AuthguardService],
        canActivate: [AuthguardService]
      },
      {
        path: 'notification',
        loadChildren: () => import('../page/notification/notification.module').then( m => m.NotificationPageModule)
      },
        {
        path: 'subscription',
        loadChildren: () => import('../page/subscription/subscription.module').then( m => m.SubscriptionPageModule),
        canLoad: [AuthguardService],
        canActivate: [AuthguardService]
      },
        {
        path: 'meeting',
        loadChildren: () => import('../page/meeting/meeting/meeting.module').then( m => m.MeetingPageModule)
      },
      {
        path: 'risk',
        loadChildren: () => import('../page/risk/risk/risk.module').then( m => m.RiskPageModule)
      },
        {
        path: 'task',
        loadChildren: () => import('../page/task/task/task.module').then( m => m.TaskPageModule)
      },
      {
        path: 'issue',
        loadChildren: () => import('../page/issue/issue/issue.module').then( m => m.IssuePageModule)
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'settings',
        loadChildren: () => import('../page/app-setting/app-setting/app-setting.module').then( m => m.AppSettingPageModule),
        canLoad: [AuthguardService],
        canActivate: [AuthguardService]
      },
      {
        path: 'broadcast-message',
        loadChildren: () => import('../page/admin/broadcast-message/broadcast-message.module').then( m => m.BroadcastMessagePageModule),
        canLoad: [AuthguardService],
        canActivate: [AuthguardService]
      },
      {
        path: 'access-denied/:pgId',
        loadChildren: () => import('../page/access-denied/access-denied/access-denied.module').then( m => m.AccessDeniedPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
