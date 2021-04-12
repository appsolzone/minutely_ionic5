import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { TaskService } from 'src/app/shared/task/task.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
})
export class CreateTaskPage implements OnInit {

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
   let task = {...this.taskService.newTask};
   this.getTask({id:null,data:task});
  }

  sectionChanged(e)                  
  {
     this.showSection = e.detail.value;
   }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(this.sessionInfo?.userProfile && this.task?.data){
        const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
        console.log("userprofile values, ", uid, email, name, picUrl)
        this.task.data.subscriberId =subscriberId;
        this.task.data.ownerId ={uid, email, name, picUrl};
        this.refInformation.ownerId = {uid, email, name, picUrl};
      }
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
    const taskInitiationDate = moment(data.taskInitiationDate,'YYYY-MM-DD').format('YYYY-MM-DD');//null; //moment(data.taskInitiationDate).format('YYYY-MM-DDTHH:mm');
  
    const targetCompletionDate = moment(data.taskInitiationDate,'YYYY-MM-DD').add(1,'days').format('YYYY-MM-DD');//null; //moment(data.targetCompletionDate).format('YYYY-MM-DDTHH:mm');
    // const weekdays = data.weekdays ? data.weekdays : [false,false,false,false,false,false,false];

    console.log(taskInitiationDate,targetCompletionDate);

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
