import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./page/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'attendance',
    loadChildren: () => import('./page/attendance/attendance.module').then( m => m.AttendancePageModule)
  },
  {
    path: 'leave',
    loadChildren: () => import('./page/leave/leave.module').then( m => m.LeavePageModule)
  },
  {
    path: 'region',
    loadChildren: () => import('./page/region/region.module').then( m => m.RegionPageModule)
  },
  {
    path: 'expense',
    loadChildren: () => import('./page/expense/expense.module').then( m => m.ExpensePageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./page/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./page/notification/notification.module').then( m => m.NotificationPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
