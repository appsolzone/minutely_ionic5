import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRoleMobilePageRoutingModule } from './edit-role-mobile-routing.module';

import { EditRoleMobilePage } from './edit-role-mobile.page';
import { EditRoleModule } from 'src/app/page/app-setting/app-setting/edit-role/edit-role.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditRoleMobilePageRoutingModule,
    EditRoleModule
  ],
  declarations: [EditRoleMobilePage]
})
export class EditRoleMobilePageModule {}
