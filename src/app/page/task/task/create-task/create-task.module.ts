import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTaskPageRoutingModule } from './create-task-routing.module';

import { CreateTaskPage } from './create-task.page';
import { TaskAgendaNoteEditPageModule } from '../task-agenda-note-edit/task-agenda-note-edit.module';
import { TaskBasicInfoEditPageModule } from '../task-basic-info-edit/task-basic-info-edit.module';
import { LinkageModule } from 'src/app/page/linkage/linkage.module';
import { TaskOwnerInitiatorEditPageModule } from '../task-owner-initiator-edit/task-owner-initiator-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTaskPageRoutingModule,
    LinkageModule,
    TaskBasicInfoEditPageModule,
    TaskAgendaNoteEditPageModule,
    TaskOwnerInitiatorEditPageModule
  ],
  declarations: [CreateTaskPage]
})
export class CreateTaskPageModule {}
