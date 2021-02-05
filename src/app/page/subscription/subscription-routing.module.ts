import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChoosePlanPage } from './choose-plan/choose-plan.page';
import { PaypalPaymentPage } from './paypal-payment/paypal-payment.page';
import { SubscriptionPage } from './subscription.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionPage,
   },
  {path:'choose-plan', loadChildren: () => import('./choose-plan/choose-plan.module').then(m => m.ChoosePlanPageModule)
  },
  {path:'payment', loadChildren: () => import('./paypal-payment/paypal-payment.module').then(m => m.PaypalPaymentPageModule)
  },
  {
    path:'',
    redirectTo:'tabs/subscription',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionPageRoutingModule {}
