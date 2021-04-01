import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSubscriberPageRoutingModule } from './add-subscriber-routing.module';

import { AddSubscriberPage } from './add-subscriber.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSubscriberPageRoutingModule
  ],
  declarations: [AddSubscriberPage],
  exports: [AddSubscriberPage],
})
export class AddSubscriberPageModule {}
