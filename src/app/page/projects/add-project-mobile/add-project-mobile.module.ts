import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProjectMobilePageRoutingModule } from './add-project-mobile-routing.module';

import { AddProjectMobilePage } from './add-project-mobile.page';

import { AddProjectModule } from '../add-project/add-project.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProjectMobilePageRoutingModule,
    AddProjectModule
  ],
  declarations: [AddProjectMobilePage]
})
export class AddProjectMobilePageModule {}
