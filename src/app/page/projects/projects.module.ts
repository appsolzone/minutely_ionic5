import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectsPageRoutingModule } from './projects-routing.module';

import { ProjectsPage } from './projects.page';

import { AddProjectModule } from './add-project/add-project.module';

import { ProjectListComponent } from './project-list/project-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectsPageRoutingModule,
    AddProjectModule,
  ],
  declarations: [
    ProjectsPage,
    ProjectListComponent
  ]
})
export class ProjectsPageModule {}
