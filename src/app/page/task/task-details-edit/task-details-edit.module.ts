import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailsEditPageRoutingModule } from './task-details-edit-routing.module';

import { TaskDetailsEditPage } from './task-details-edit.page';
import { TaskBasicInfoEditPageModule } from '../task-basic-info-edit/task-basic-info-edit.module';
import { TaskOwnerInitiatorEditPageModule } from '../task-owner-initiator-edit/task-owner-initiator-edit.module';
import { TaskAgendaNoteEditPageModule } from '../task-agenda-note-edit/task-agenda-note-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailsEditPageRoutingModule,
    TaskBasicInfoEditPageModule,
    TaskAgendaNoteEditPageModule,
    TaskOwnerInitiatorEditPageModule
  ],
  declarations: [TaskDetailsEditPage],
  exports:[TaskDetailsEditPage]
})
export class TaskDetailsEditPageModule {}
