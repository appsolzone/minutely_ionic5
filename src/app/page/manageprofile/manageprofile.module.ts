import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageprofilePageRoutingModule } from './manageprofile-routing.module';

import { ManageprofilePage } from './manageprofile.page';
import { AddSubscriberPageModule } from '../add-subscriber/add-subscriber.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageprofilePageRoutingModule,
    AddSubscriberPageModule,
  ],
  declarations: [ManageprofilePage],
  exports:[ManageprofilePage],
})
export class ManageprofilePageModule {}
