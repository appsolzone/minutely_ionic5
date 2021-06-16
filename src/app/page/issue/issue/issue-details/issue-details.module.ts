import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueDetailsPageRoutingModule } from './issue-details-routing.module';

import { IssueBasicInfoComponent } from '../issue-basic-info/issue-basic-info.component';
import { IssueOwnerInitiatorComponent } from '../issue-owner-initiator/issue-owner-initiator.component';
import { IssueDescriptionComponent } from '../issue-description/issue-description.component';
import { IssueCommentsComponent } from '../issue-comments/issue-comments.component';

import { LinkageModule } from 'src/app/page/linkage/linkage.module';

import { IssueDetailsPage } from './issue-details.page';

import { FeatureCheckDirectiveModule } from 'src/app/directive/featurecheck/featurecheck.directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueDetailsPageRoutingModule,
    LinkageModule,
    FeatureCheckDirectiveModule,
  ],
  declarations: [
    IssueBasicInfoComponent,
    IssueOwnerInitiatorComponent,
    IssueDescriptionComponent,
    IssueCommentsComponent,
    IssueDetailsPage,
  ]
})
export class IssueDetailsPageModule {}
