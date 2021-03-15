import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskPageRoutingModule } from './task-routing.module';

import { TaskPage } from './task.page';
import { BargraphComponent } from '../../bargraph/bargraph.component';
import { NotificationPageRoutingModule } from '../../notification/notification-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskPageRoutingModule,
    NotificationPageRoutingModule
  ],
  declarations: [TaskPage,BargraphComponent]
})
export class TaskPageModule {}
