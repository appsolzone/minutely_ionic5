import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { RiskOwnerInitiatorEditPage } from './risk-owner-initiator-edit.page';
import { SelectUsersModule } from '../../select-users/select-users.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectUsersModule
  ],
  declarations: [RiskOwnerInitiatorEditPage],
  exports:[RiskOwnerInitiatorEditPage]
})
export class RiskOwnerInitiatorEditPageModule {}
