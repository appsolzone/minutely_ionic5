import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendEmailPageRoutingModule } from './send-email-routing.module';

import { SendEmailPage } from './send-email.page';
import { SelectUsersModule } from '../select-users/select-users.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendEmailPageRoutingModule,
    SelectUsersModule
  ],
  declarations: [SendEmailPage]
})
export class SendEmailPageModule {}
