import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSubscriberPage } from './add-subscriber.page';

const routes: Routes = [
  {
    path: '',
    component: AddSubscriberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSubscriberPageRoutingModule {}
