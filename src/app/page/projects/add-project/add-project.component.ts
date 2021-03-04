import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { Project } from 'src/app/interface/project';
import { ProjectService } from 'src/app/shared/project/project.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
@Autounsubscribe()
export class AddProjectComponent implements OnInit {
  @Input() sessionInfo: any ={};
  @Input() openAddProject: any = ()=>{};
  public newProject: Project;
  public inceptionDate: any = moment().format('YYYY-MM-DD');
  public maxDate: any = moment().format('YYYY-MM-DD')

  constructor(
    private project: ProjectService,
    private common: ComponentsService,
  ) {
    this.newProject = {...this.project.newProject};
  }

  ngOnInit() {}
  ngOnDestroy(){}

  saveProject(){
    this.newProject = { ...this.newProject, inceptionDate: new Date(this.inceptionDate)};
    this.project.createProject(this.newProject, this.sessionInfo)
      .then(async res=>{
        let title = "Project created";
        let body = "Project '" + res.projectId + "' '"+res.title+"' has been created successfully."
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        }
                      ];

        await this.common.presentAlert(title,body ,buttons);
        this.openAddProject();
      })
      .catch(async err=>{
        let title = "Exception";
        let body = "Project '" +this.newProject.title+"' could not be created. Please check and try again."
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        }
                      ];

        await this.common.presentAlert(title,body ,buttons);
      })
  }

}
