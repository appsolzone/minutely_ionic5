import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchComponentPage } from './search-component.page';

const routes: Routes = [
  {
    path: '',
    component: SearchComponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchComponentPageRoutingModule {}
