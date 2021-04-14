import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskUserCommentsPageRoutingModule } from './task-user-comments-routing.module';

import { TaskUserCommentsPage } from './task-user-comments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskUserCommentsPageRoutingModule
  ],
  declarations: [TaskUserCommentsPage]
})
export class TaskUserCommentsPageModule {}
