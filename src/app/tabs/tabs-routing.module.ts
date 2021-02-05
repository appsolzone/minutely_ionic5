import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../page/profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'attendance',
        loadChildren: () => import('../page/attendance/attendance.module').then( m => m.AttendancePageModule)
      },
      {
        path: 'leave',
        loadChildren: () => import('../page/leave/leave.module').then( m => m.LeavePageModule)
      },
      {
        path: 'region',
        loadChildren: () => import('../page/region/region.module').then( m => m.RegionPageModule)
      },
      {
        path: 'expense',
        loadChildren: () => import('../page/expense/expense.module').then( m => m.ExpensePageModule)
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
        path: '',
        redirectTo: '/tabs/attendance',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/attendance',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
