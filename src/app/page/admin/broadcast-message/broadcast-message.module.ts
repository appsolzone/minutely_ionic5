import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BroadcastMessagePageRoutingModule } from './broadcast-message-routing.module';

import { SelectUsersModule } from 'src/app/page/select-users/select-users.module'

import { BroadcastMessagePage } from './broadcast-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BroadcastMessagePageRoutingModule,
    SelectUsersModule
  ],
  declarations: [BroadcastMessagePage]
})
export class BroadcastMessagePageModule {}
