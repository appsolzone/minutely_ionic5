import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskListPageRoutingModule } from './task-list-routing.module';

import { TaskListPage } from './task-list.page';

import { CalendarModule } from 'ion2-calendar';

import { FeatureCheckDirectiveModule } from 'src/app/directive/featurecheck/featurecheck.directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskListPageRoutingModule,
    CalendarModule,
    FeatureCheckDirectiveModule,
  ],
  declarations: [TaskListPage],
  exports:[TaskListPage]
})
export class TaskListPageModule {}
