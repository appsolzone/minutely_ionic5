import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FillTimesheetPage } from './fill-timesheet.page';

const routes: Routes = [
  {
    path: '',
    component: FillTimesheetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FillTimesheetPageRoutingModule {}
