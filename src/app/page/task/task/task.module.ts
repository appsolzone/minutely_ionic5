import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskPageRoutingModule } from './task-routing.module';

import { TaskPage } from './task.page';
import { BargraphComponent } from '../../bargraph/bargraph.component';
import { NotificationPageRoutingModule } from '../../notification/notification-routing.module';
import { TaskDetailsPageModule } from '../task-details/task-details.module';
import { TaskListPageModule } from '../task-list/task-list.module';
import { KpiModule } from '../../kpi/kpi.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskPageRoutingModule,
    NotificationPageRoutingModule,
    TaskDetailsPageModule,
    TaskListPageModule,
    KpiModule
  ],
  declarations: [TaskPage,BargraphComponent]
})
export class TaskPageModule {}
