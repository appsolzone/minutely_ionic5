import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagerolesPageRoutingModule } from './manageroles-routing.module';

import { ManagerolesPage } from './manageroles.page';

import { RoleTemplatelistComponent } from 'src/app/page/app-setting/app-setting/role-templatelist/role-templatelist.component';
import { RoleListComponent } from 'src/app/page/app-setting/app-setting/role-list/role-list.component';
import { EditRoleModule } from 'src/app/page/app-setting/app-setting/edit-role/edit-role.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerolesPageRoutingModule,
    EditRoleModule,
  ],
  declarations: [
    ManagerolesPage,
    RoleTemplatelistComponent,
    RoleListComponent,
  ]
})
export class ManagerolesPageModule {}
