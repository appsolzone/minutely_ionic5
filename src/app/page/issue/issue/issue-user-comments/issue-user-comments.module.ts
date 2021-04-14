import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueUserCommentsPageRoutingModule } from './issue-user-comments-routing.module';

import { IssueUserCommentsPage } from './issue-user-comments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueUserCommentsPageRoutingModule
  ],
  declarations: [IssueUserCommentsPage]
})
export class IssueUserCommentsPageModule {}
