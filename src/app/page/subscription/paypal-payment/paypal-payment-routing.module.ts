import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaypalPaymentPage } from './paypal-payment.page';

const routes: Routes = [
  {
    path: '',
    component: PaypalPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaypalPaymentPageRoutingModule {}
