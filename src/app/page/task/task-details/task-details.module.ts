import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailsPageRoutingModule } from './task-details-routing.module';

import { TaskDetailsPage } from './task-details.page';
import { TaskBasicInfoComponent } from '../task-basic-info/task-basic-info.component';
import { TaskOwnerInitiatorComponent } from '../task-owner-initiator/task-owner-initiator.component';
import { TaskAgendaNoteComponent } from '../task-agenda-note/task-agenda-note.component';
import { TaskCommentsComponent } from '../task-comments/task-comments.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailsPageRoutingModule,
  ],
  declarations: [
    TaskDetailsPage,
    TaskBasicInfoComponent,
    TaskOwnerInitiatorComponent,
    TaskAgendaNoteComponent,
    TaskCommentsComponent
  ],
  exports:[TaskDetailsPage]
})
export class TaskDetailsPageModule {}
