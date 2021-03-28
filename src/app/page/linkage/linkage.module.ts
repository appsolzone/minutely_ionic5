import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LinkageMeetingComponent } from './linkage-meeting/linkage-meeting.component';
import { LinkageTaskComponent } from './linkage-task/linkage-task.component';
import { LinkageIssueComponent } from './linkage-issue/linkage-issue.component';
import { LinkageRiskComponent } from './linkage-risk/linkage-risk.component';

import { RiskMatrixModule } from 'src/app/page/risk-matrix/risk-matrix.module';

import { LinkageComponent } from './linkage.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskMatrixModule
  ],
  declarations: [
    LinkageComponent,
    LinkageMeetingComponent,
    LinkageTaskComponent,
    LinkageIssueComponent,
    LinkageRiskComponent
  ],
  exports: [
    LinkageComponent,
  ]
})
export class LinkageModule {}
