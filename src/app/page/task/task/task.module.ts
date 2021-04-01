import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskPageRoutingModule } from './task-routing.module';

import { TaskPage } from './task.page';
import { BargraphComponent } from '../../bargraph/bargraph.component';
import { NotificationPageRoutingModule } from '../../notification/notification-routing.module';
import { TaskDetailsPageModule } from '../task-details/task-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskPageRoutingModule,
    NotificationPageRoutingModule,
    TaskDetailsPageModule
  ],
  declarations: [TaskPage,BargraphComponent]
})
export class TaskPageModule {}
