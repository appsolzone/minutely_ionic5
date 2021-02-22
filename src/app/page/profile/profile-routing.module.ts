import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    // children:[
    //   {
    //     path:'/choose-plan', loadChildren: () => import('../subscription/payments/plan-choose/plan-choose.module').then(m => m.PlanChoosePageModule)
    //   },{
    //     path:'/payment', loadChildren: () => import('../subscription/payments/paypal-payment/paypal-payment.module').then(m => m.PaypalPaymentPageModule)
    //   },
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
