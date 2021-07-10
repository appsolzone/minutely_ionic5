import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueUserCommentsPageRoutingModule } from './issue-user-comments-routing.module';

import { IssueUserCommentsPage } from './issue-user-comments.page';

import { FeatureCheckDirectiveModule } from 'src/app/directive/featurecheck/featurecheck.directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueUserCommentsPageRoutingModule,
    FeatureCheckDirectiveModule
  ],
  declarations: [IssueUserCommentsPage]
})
export class IssueUserCommentsPageModule {}
