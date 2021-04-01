import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMemberPageRoutingModule } from './add-member-routing.module';

import { AddMemberPage } from './add-member.page';
import { ReactiveFormsModule }   from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMemberPageRoutingModule,
    FormsModule,ReactiveFormsModule
  ],
  declarations: [AddMemberPage],
  exports:[AddMemberPage]
})
export class AddMemberPageModule {}
