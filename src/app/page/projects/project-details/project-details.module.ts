import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectDetailsPageRoutingModule } from './project-details-routing.module';

import { ProjectDetailsPage } from './project-details.page';

import { ProjectStatsComponent } from '../project-stats/project-stats.component';

import { EditProjectComponent } from '../edit-project/edit-project.component';

import { EditActivitiesComponent } from '../edit-activities/edit-activities.component';

import { BargraphModule } from 'src/app/page/bargraph/bargraph.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectDetailsPageRoutingModule,
    BargraphModule
  ],
  declarations: [
    ProjectDetailsPage,
    ProjectStatsComponent,
    EditProjectComponent,
    EditActivitiesComponent
  ]
})
export class ProjectDetailsPageModule {}
