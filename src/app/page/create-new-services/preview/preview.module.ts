import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewPageRoutingModule } from './preview-routing.module';

import { PreviewPage } from './preview.page';
import { SummaryPageModule } from '../summary/summary.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewPageRoutingModule,
    SummaryPageModule
  ],
  declarations: [PreviewPage],
  exports: [PreviewPage]
})
export class PreviewPageModule {}
