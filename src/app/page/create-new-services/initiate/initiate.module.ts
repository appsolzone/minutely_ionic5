import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitiatePageRoutingModule } from './initiate-routing.module';

import { InitiatePage } from './initiate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitiatePageRoutingModule
  ],
  declarations: [InitiatePage],
  exports: [InitiatePage]
})
export class InitiatePageModule {}
