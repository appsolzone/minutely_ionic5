import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { TaskService } from 'src/app/shared/task/task.service';

@Component({
  selector: 'app-task-details-edit',
  templateUrl: './task-details-edit.page.html',
  styleUrls: ['./task-details-edit.page.scss'],
})
@Autounsubscribe()
export class TaskDetailsEditPage implements OnInit,
OnDestroy {
    // observables
  sessionSubs$;
  tasksSubs$;
  public showSection: string ='BASICINFO';
  public sessionInfo: any;
  public task: any;
  public refInformation: any;
  public alllinkages: any = {
                            meetings: [],
                            tasks: [],
                            issues: [],
                            risks: []
                          };
  public editedlinkages: any = {
                            meetings: [],
                            tasks: [],
                            issues: [],
                            risks: []
                          };
  constructor(
    private router: Router,
    private session: SessionService,
    private taskService: TaskService,
    private common: ComponentsService,
  ) {
        this.getSessionInfo();
  }

  ngOnInit() {
    let taskStateData = history.state.data.task;
    console.log("taskDetails ngOnInit")
    if(!taskStateData){
      console.log("ngOnInit")
      this.router.navigate(['task']);
    } else{
      if(taskStateData?.id!=this.task?.id){
        this.getTask(taskStateData);
      }
    }
  }

    ngOnDestroy(){}
  ionViewDidEnter(){
    console.log("taskDetails ionViewDidEnter", history.state.data?.task)
    let taskStateData = history.state.data?.task ? history.state.data.task : this.task;
    if(!taskStateData){
      console.log("ionViewDidEnter")
      this.router.navigate(['task']);
    } else {
      if(taskStateData?.id!=this.task?.id){
        this.getTask(taskStateData);
      }
    }
  }

   getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }
   // search implement
  getTask(taskStateData){
    // this.task = null;
    const data: any = taskStateData.data;
    const id: string = taskStateData.id;
    const taskInitiationDate = moment(data.taskInitiationDate).format('YYYY-MM-DD');
    const targetCompletionDate = moment(data.targetCompletionDate).format('YYYY-MM-DD');
    // const weekdays = data.weekdays ? data.weekdays : [false,false,false,false,false,false,false];

    this.task = {id, data: {...data, taskInitiationDate, targetCompletionDate
    }};

    this.refInformation = {id, taskInitiationDate, targetCompletionDate,
    status: data.taskStatus,
    taskOwner: {...data.taskOwner},
    // attendeeList: [...data.attendeeList],
    taskTitle: data.taskTitle,
    tags: [...data.tags],
    toCascadeChanges: true};
     if(this.sessionInfo?.userProfile && this.task?.data){
       const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
       console.log("userprofile values, ", uid, email, name, picUrl)
       this.task.data.subscriberId =subscriberId;
       this.task.data.taskOwner ={uid, email, name, picUrl};
       this.refInformation.taskOwner = {uid, email, name, picUrl};
     }
    console.log("task details", this.task);

  }

  // edit linkage callback
  publishLinkage(ev){
    this.alllinkages = ev.linkages;
    this.editedlinkages = ev.editedlinkages;
    console.log("edited data received risk", this.alllinkages, this.editedlinkages);
  }

  // savetask
  async saveTask(){
    const { status } = this.task.data;
    let { toCascadeChanges } = this.refInformation;
    let title = '';
    let body = '';
    let response: boolean = false;
    let buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{response = false;},
                      resolve: false
                    }
                  ];
    let continueButtons = [...buttons,
                      {
                        text: 'Continue',
                        role: '',
                        cssClass: '',
                        handler: ()=>{response = true;},
                        resolve: true
                      }
                    ];
    // If status is to CANCEL the task, no need to check validation status
    let validation = status=='RESOLVED' ?
                     {status: true, title: 'cancel', body: 'resolve task'}
                     :
                     this.taskService.validateBasicInfo(this.task, this.refInformation);

    if(!validation.status){
      await this.common.presentAlertConfirm(validation.title,validation.body, buttons);
      this.showSection = 'BASICINFO';
    } else {
      response = true;
      // if(attendeeList.length==0){
      //   title = 'Confirmation';
      //   body = "No attendee has been added/selected for the task. Are you sure that you want to continue to create the task without any attendee?"
      //   response = false;
      //   await this.common.presentAlertConfirm(title,body, continueButtons);
      // }
      if(response){
        // this.taskservice.processtask(this.task, this.refInformation, this.alllinkages, this.sessionInfo);
        let processtaskstatus: any = await this.taskService.processTask(this.task, this.refInformation, this.alllinkages, this.sessionInfo);
        console.log("this.task to be saved", this.task, this.alllinkages, this.refInformation, processtaskstatus);
        this.common.hideLoader();
        const {status, title, body } = processtaskstatus;
        this.common.presentAlert(title, body, buttons);
        if(status=='success'){
          this.router.navigate(['task']);
        }
      } else {
        this.showSection = 'ATTENDEES';
      }
    }
  }
}
