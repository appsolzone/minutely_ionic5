import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'activities',
        loadChildren: () => import('../page/activities/activities.module').then( m => m.ActivitiesPageModule)
      },
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
        path: 'timesheet',
        loadChildren: () => import('../page/timesheet/timesheet/timesheet.module').then( m => m.TimesheetPageModule)
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
