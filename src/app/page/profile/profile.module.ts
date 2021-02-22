import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

// Signin component
import { SigninPageModule } from '../signin/signin.module';
// Manage profile
import { ManageprofilePageModule } from '../manageprofile/manageprofile.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SigninPageModule,
    ManageprofilePageModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
