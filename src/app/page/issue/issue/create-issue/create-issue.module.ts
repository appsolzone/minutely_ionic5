import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateIssuePageRoutingModule } from './create-issue-routing.module';

import { IssueBasicInfoEditModule } from '../issue-basic-info-edit/issue-basic-info-edit.module';
import { IssueOwnerInitiatorEditModule } from '../issue-owner-initiator-edit/issue-owner-initiator-edit.module';
import { IssueDescriptionEditModule } from '../issue-description-edit/issue-description-edit.module';
// import { IssueCommentsComponent } from '../issue-comments/issue-comments.component';

import { LinkageModule } from 'src/app/page/linkage/linkage.module';

import { CreateIssuePage } from './create-issue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateIssuePageRoutingModule,
    IssueBasicInfoEditModule,
    IssueOwnerInitiatorEditModule,
    IssueDescriptionEditModule,
    LinkageModule
  ],
  declarations: [
    CreateIssuePage
  ]
})
export class CreateIssuePageModule {}
