import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { TaskBasicInfoEditPage } from './task-basic-info-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [TaskBasicInfoEditPage],
  exports:[TaskBasicInfoEditPage]
})
export class TaskBasicInfoEditPageModule {}
