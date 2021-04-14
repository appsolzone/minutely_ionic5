import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { TaskAgendaNoteEditPage } from './task-agenda-note-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [TaskAgendaNoteEditPage],
  exports:[TaskAgendaNoteEditPage]
})
export class TaskAgendaNoteEditPageModule {}
