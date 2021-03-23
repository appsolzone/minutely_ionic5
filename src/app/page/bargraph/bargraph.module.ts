import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BargraphComponent } from './bargraph.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    BargraphComponent
  ],
  exports: [
    BargraphComponent,
  ]
})
export class BargraphModule {}
