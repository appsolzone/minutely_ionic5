import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssuePageRoutingModule } from './issue-routing.module';

import { IssueListModule } from './issue-list/issue-list.module';
import { KpiModule } from 'src/app/page/kpi/kpi.module';

import { IssuePage } from './issue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssuePageRoutingModule,
    IssueListModule,
    KpiModule
  ],
  declarations: [IssuePage]
})
export class IssuePageModule {}
