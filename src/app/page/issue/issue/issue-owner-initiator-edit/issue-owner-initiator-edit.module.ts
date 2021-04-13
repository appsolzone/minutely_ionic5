import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueOwnerInitiatorEditComponent } from './issue-owner-initiator-edit.component';
import { SelectUsersModule } from 'src/app/page/select-users/select-users.module';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    SelectUsersModule
  ],
  declarations: [IssueOwnerInitiatorEditComponent],
  exports: [IssueOwnerInitiatorEditComponent]
})
export class IssueOwnerInitiatorEditModule {}
