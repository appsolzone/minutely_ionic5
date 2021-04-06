import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BroadcastMessagePage } from './broadcast-message.page';

const routes: Routes = [
  {
    path: '',
    component: BroadcastMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BroadcastMessagePageRoutingModule {}
