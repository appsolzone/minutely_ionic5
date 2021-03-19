import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { Project } from 'src/app/interface/project';
import { ProjectService } from 'src/app/shared/project/project.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
})
@Autounsubscribe()
export class EditProjectComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() projectDetails: any;
  @Input() onCancel: any = ()=>{};
  public editProject: Project;
  public inceptionDate: any = null;
  public targetClosureDate: any = null;
  public maxDate: any = moment().format('YYYY-MM-DD')

  constructor(
    private router:Router,
    private project: ProjectService,
    private activity: ActivityService,
    private common: ComponentsService,
  ) {
  }

  ngOnInit() {
    this.editProject = {...this.projectDetails.data};
    this.inceptionDate = moment(this.editProject.inceptionDate).format('YYYY-MM-DD');
    this.targetClosureDate = moment(this.editProject.targetClosureDate).format('YYYY-MM-DD');
  }
  ngOnDestroy(){}

  saveProject(){
    this.common.showLoader("Saving project details, please wait ....");
    let updatedProject = { ...this.editProject,
                        inceptionDate: this.inceptionDate ? new Date(this.inceptionDate) : null,
                        targetClosureDate: this.targetClosureDate ? new Date(this.targetClosureDate) : null
                        };
    this.project.updateProject(this.projectDetails.id, updatedProject, this.sessionInfo)
      .then(async res=>{
        let title = "Project updated";
        let body = "The Project '" + updatedProject.title+"' has been updated successfully.  Start tracking the time by creating the activities."
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        }
                      ];

        await this.common.presentAlert(title,body ,buttons);
        this.common.hideLoader();
        this.onCancel(false);
      })
      .catch(async err=>{
        let title = "Error";
        let body = "Project '" +updatedProject.title+"' could not be updated. Please check and try again."
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        }
                      ];

        await this.common.presentAlert(title,body ,buttons);
        this.common.hideLoader();
      })
  }

  async completeOrOpenProject(event){
    this.common.showLoader("Saving project details, please wait ....");
    let updatedProject = { ...this.editProject,
                        inceptionDate: this.inceptionDate ? new Date(this.inceptionDate) : null,
                        targetClosureDate: this.targetClosureDate ? new Date(this.targetClosureDate) : null,
                        closureDate: new Date(),
                        status: event,
                        };
    // check whether we can mark the project as complete
    const {subscriberId, uid} = this.sessionInfo;
    let queryObj = [
                {field: 'subscriberId',operator: '==', value: subscriberId},
                {field: 'project.projectId',operator: '==', value: updatedProject.projectId},
                {field: 'status',operator: 'in', value: ['ACTIVE','PAUSE']}
                ];
    let ongoingActivities = 0;
    if(event == 'COMPLETE'){
      await this.activity.getActivitiesOnce(queryObj,null,1)
              .then(act=>{
                act.forEach(doc=>{
                  ongoingActivities++;
                })
              })
              .catch(err=>{
                ongoingActivities++;
              });
    }

    if(ongoingActivities==0){
        // Now mark all activities as complete
        if(event=='COMPLETE'){
          updatedProject.activities.forEach(pact=>{
                                                  pact.status = event; //'COMPLETE';
                                                });
        }

        this.project.updateProject(this.projectDetails.id, updatedProject, this.sessionInfo, event=='COMPLETE')
          .then(async res=>{
            let title = "Project updated";
            let body = "The Project '" + updatedProject.title+"' has been updated and marked "+ event.toLowerCase() +" successfully."
            let buttons: any[] = [
                            {
                              text: 'Dismiss',
                              role: 'cancel',
                              cssClass: '',
                              handler: ()=>{}
                            }
                          ];

            await this.common.presentAlert(title,body ,buttons);
            this.common.hideLoader();
            this.onCancel(false);
          })
          .catch(async err=>{
            let title = "Error";
            let body = "Project '" +updatedProject.title+"' could not be updated. Please check and try again."
            let buttons: any[] = [
                            {
                              text: 'Dismiss',
                              role: 'cancel',
                              cssClass: '',
                              handler: ()=>{}
                            }
                          ];

            await this.common.presentAlert(title,body ,buttons);
            this.common.hideLoader();
          })
      } else {
        let title = "Warning";
        let body = "Project '" +updatedProject.title+"' could not be marked as complete as there are ongoing activities. Please check and try again."
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        },
                        {
                          text: 'View activities',
                          role: '',
                          cssClass: '',
                          handler: ()=>{this.router.navigate(['activities/team-activities'])}
                        }
                      ];

        await this.common.presentAlert(title,body ,buttons);
        this.common.hideLoader();
      }
  }

}
