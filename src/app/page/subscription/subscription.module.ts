import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionPageRoutingModule } from './subscription-routing.module';

import { SubscriptionPage } from './subscription.page';
import { ChoosePlanPageModule } from './choose-plan/choose-plan.module';
import { PaypalPaymentPageModule } from './paypal-payment/paypal-payment.module';
import { ChoosePlanPage } from './choose-plan/choose-plan.page';
import { PaypalPaymentPage } from './paypal-payment/paypal-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriptionPageRoutingModule,
    ChoosePlanPageModule,
    PaypalPaymentPageModule
  ],
  declarations: [SubscriptionPage]
})
export class SubscriptionPageModule {}
