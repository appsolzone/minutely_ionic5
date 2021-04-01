import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchComponentPageRoutingModule } from './search-component-routing.module';

import { SearchComponentPage } from './search-component.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchComponentPageRoutingModule
  ],
  declarations: [SearchComponentPage],
  exports:[SearchComponentPage]
})
export class SearchComponentPageModule {}
