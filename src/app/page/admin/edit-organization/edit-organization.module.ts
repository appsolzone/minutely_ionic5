import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditOrganizationPageRoutingModule } from './edit-organization-routing.module';

import { EditOrganizationPage } from './edit-organization.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditOrganizationPageRoutingModule
  ],
  declarations: [EditOrganizationPage]
})
export class EditOrganizationPageModule {}
