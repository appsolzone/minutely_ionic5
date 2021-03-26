import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { Project } from 'src/app/interface/project';
import { ProjectService } from 'src/app/shared/project/project.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
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
  public targetClosureDate: any = null;
  public maxDate: any = moment().format('YYYY-MM-DD')

  constructor(
    private router:Router,
    private project: ProjectService,
    private activity: ActivityService,
    private common: ComponentsService,
  ) {
    this.newProject = {...this.project.newProject};
  }

  ngOnInit() {}
  ngOnDestroy(){}

  saveProjectConfirm(){
    if(this.targetClosureDate == null || this.targetClosureDate == ''){
      this.common.presentAlertConfirm('No closure date', 
      'This project does not have any closure date. Would you like to continue?').then(feed=>{
        if(feed==true){
          this.saveProject();
          //console.log('action needed');
  
        }
        else{
          console.log('no action needed');
        }
      })
    }
    else{
console.log('No exception')
    }
    
  }

  saveProject(){
    if(this.targetClosureDate == null || this.targetClosureDate == ''){
      this.newProject = { ...this.newProject, inceptionDate: new Date(this.inceptionDate),
        targetClosureDate: new Date(this.targetClosureDate),hasClosureDate:false
      };
    }
    else{
      this.newProject = { ...this.newProject, inceptionDate: new Date(this.inceptionDate),
        targetClosureDate: new Date(this.targetClosureDate),hasClosureDate:true
      };
    }
    
    this.project.createProject(this.newProject, this.sessionInfo)
      .then(async res=>{
        let title = "Project created";
        let body = "Thank you for creating the Project '" +res.title+"'.  Start tracking the time by creating the activities."
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        },
                        {
                          text: 'Start activity',
                          role: '',
                          cssClass: '',
                          handler: ()=>{this.startNewActivity(res);}
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

  startNewActivity(project){
    let startActivity: any = {
                          activity: {},
                          taskProject: {...project, projectNo: project.projectId.replace(/[A-Z]/,'')}
                        };
    this.activity.patch(startActivity);
    this.router.navigate(['activities']);
  }

}
