import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

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
        loadChildren: () => import('../page/admin/admin.module').then( m => m.AdminPageModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../page/notification/notification.module').then( m => m.NotificationPageModule)
      },
        {
        path: 'subscription',
        loadChildren: () => import('../page/subscription/subscription.module').then( m => m.SubscriptionPageModule)
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
      }
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
