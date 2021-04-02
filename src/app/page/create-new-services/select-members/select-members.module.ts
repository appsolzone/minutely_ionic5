import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectMembersPageRoutingModule } from './select-members-routing.module';

import { SelectMembersPage } from './select-members.page';
import { SummaryPageModule } from '../summary/summary.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectMembersPageRoutingModule,
    SummaryPageModule
  ],
  declarations: [SelectMembersPage],
  exports: [SelectMembersPage]
})
export class SelectMembersPageModule {}
