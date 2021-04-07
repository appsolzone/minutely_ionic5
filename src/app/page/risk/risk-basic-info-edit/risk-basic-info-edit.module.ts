import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { RiskBasicInfoEditPage } from './risk-basic-info-edit.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [RiskBasicInfoEditPage],
  exports:[RiskBasicInfoEditPage]
})
export class RiskBasicInfoEditPageModule {}
