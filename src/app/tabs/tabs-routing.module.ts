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
        loadChildren: () => import('../page/notification/notification.module').then( m => m.NotificationPageModule),
        canLoad: [AuthguardService],
        canActivate: [AuthguardService]
      },
        {
        path: 'subscription',
        loadChildren: () => import('../page/subscription/subscription.module').then( m => m.SubscriptionPageModule),
        canLoad: [AuthguardService],
        canActivate: [AuthguardService]
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
