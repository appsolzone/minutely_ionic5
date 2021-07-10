import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskUserCommentsPageRoutingModule } from './task-user-comments-routing.module';

import { TaskUserCommentsPage } from './task-user-comments.page';

import { FeatureCheckDirectiveModule } from 'src/app/directive/featurecheck/featurecheck.directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskUserCommentsPageRoutingModule,
    FeatureCheckDirectiveModule
  ],
  declarations: [TaskUserCommentsPage]
})
export class TaskUserCommentsPageModule {}
