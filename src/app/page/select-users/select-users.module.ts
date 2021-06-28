import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }   from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectUsersComponent } from './select-users.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  declarations: [SelectUsersComponent],
  exports: [SelectUsersComponent]
})
export class SelectUsersModule {}
