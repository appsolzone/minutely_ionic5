import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { TaskService } from 'src/app/shared/task/task.service';
import { ComponentsService } from 'src/app/shared/components/components.service';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
})
@Autounsubscribe()
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
    private taskservice: TaskService,
    private common: ComponentsService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    // let taskStateData = history.state.data.task;
    // console.log("taskDetails ngOnInit")
    // if(!taskStateData){
    //   console.log("ngOnInit")
    //   this.router.navigate(['task']);
    // } else{
    //   if(taskStateData?.id!=this.task?.id){
        let task = {...this.taskservice.newTask,
                    tags:[],
                    ownerInitiatorUidList:[]
                    };
        this.gettask({id:null,data:task});
    //   }
    // }
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    // console.log("taskDetails ionViewDidEnter", history.state.data?.task)
    // let taskStateData = history.state.data?.task ? history.state.data.task : this.task;
    // if(!taskStateData){
    //   console.log("ionViewDidEnter")
    //   this.router.navigate(['task']);
    // } else {
    //   if(taskStateData?.id!=this.task?.id){
    //     this.gettask(taskStateData);
    //   }
    // }
  }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(this.sessionInfo?.userProfile && this.task?.data){
        const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
        console.log("userprofile values, ", uid, email, name, picUrl)
        this.task.data.subscriberId =subscriberId;
        this.task.data.taskInitiator ={uid, email, name, picUrl};
        this.task.data.ownerInitiatorUidList.push(uid);
        this.refInformation.taskInitiator = {uid, email, name, picUrl};
      }
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  sectionChanged(e)
  {
     this.showSection = e.detail.value;
   }

  // search implement
  gettask(taskStateData){
    // this.task = null;
    const data: any = taskStateData.data;
    const id: string = taskStateData.id;
    const taskInitiationDate = null; //moment().format('YYYY-MM-DD');
    const targetCompletionDate = null; //moment(data.targetCompletionDate).format('YYYY-MM-DD');
    const actualCompletionDate = null;
    // const overdue =  data.taskStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
    // const overdueby = overdue=='overdue' ? moment(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')).fromNow() : '';
    this.task = {id, data: {...data, taskInitiationDate, targetCompletionDate, actualCompletionDate } //,overdue,overdueby
                  };
    this.refInformation = {id, taskInitiationDate, targetCompletionDate,
                           taskStatus: data.taskStatus,
                           taskInitiator: {...data.taskInitiator},
                           taskOwner: {...data.taskOwner},
                           ownerInitiatorUidList: [...data.ownerInitiatorUidList],
                           taskTitle: data.taskTitle,
                           tags: [...data.tags]
                         };
    if(this.sessionInfo?.userProfile && this.task?.data){
       const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
       console.log("userprofile values, ", uid, email, name, picUrl)
       this.task.data.subscriberId =subscriberId;
       this.task.data.taskInitiator ={uid, email, name, picUrl};
       this.task.data.ownerInitiatorUidList.push(uid);
       this.refInformation.taskInitiator = {uid, email, name, picUrl};
    }
    console.log("task details", this.task);

  }

  // edit linkage callback
  publishLinkage(ev){
    this.alllinkages = ev.linkages;
    this.editedlinkages = ev.editedlinkages;
    console.log("edited data received", this.alllinkages, this.editedlinkages);
  }

  // savetask
  async saveTask(){
    const { taskStatus } = this.task.data;
    let title = '';
    let body = '';
    let response: boolean = false;
    let buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{response= false}  ,
                      resolve: false
                    }
                  ];
    let continueButtons = [...buttons,
                      {
                        text: 'Continue',
                        role: '',
                        cssClass: '',
                        handler: ()=>{response = true},
                        resolve: true
                      }
                    ];
    // If status is to CANCEL the task, no need to check validation status
    let validation = taskStatus=='RESOLVED' ?
                     {status: true, title: 'resolved', body: 'resolved task'}
                     :
                     this.taskservice.validateBasicInfo(this.task, this.refInformation);

    if(!validation.status){
      await this.common.presentAlertConfirm(validation.title,validation.body, buttons);
    } else {
      title = 'Confirmation';
      body = "Are you sure that you want to continue to create the task?";
      response = false;
      await this.common.presentAlertConfirm(title,body, continueButtons);
      console.log("response", response);
      if(response){
        continueButtons[0].text = "No";
        continueButtons[1].text = "Yes";
        // Now check if we have to propagate changes for the task

        // If we are not cascading changes we should not check any thing else check the date again
        validation = taskStatus=='RESOLVED' ?
                         {status: true, title: 'resolved', body: 'resolved task'}
                         :
                         this.taskservice.validateBasicInfo(this.task, this.refInformation);
        if(taskStatus == 'RESOLVED' || validation.status){
          // Now run the process as required
          // this.navData.loader = true;
          // Let's cascade changes for the update
          // first clean existing entries
          // await this.transaction('clean', true);
          // this.navData.loader = true;
          // then save new changes
          await this.common.showLoader("Processing task changes, please wait");
          let processtaskstatus: any  = await this.taskservice.processTask(this.task, this.refInformation, this.alllinkages, this.sessionInfo);
          console.log("this.task to be saved", this.task, this.alllinkages, this.editedlinkages, this.refInformation, processtaskstatus);
          this.common.hideLoader();
          const {status, title, body } = processtaskstatus;
          continueButtons[0].text = "Dismiss";
          continueButtons[1].text = "Continue";
          this.common.presentAlert(title, body, buttons);
          if(status=='success'){
            this.router.navigate(['task']);
          }
        }
      }
    }
  }

  gotoSection(action){
    switch(action){
      case 'back':
        if(this.showSection=='OWNER'){
          this.showSection = 'BASICINFO';
        } else {
          this.showSection = 'OWNER';
        }
        break;
      case 'forward':
        if(this.showSection=='BASICINFO'){
          this.showSection = 'OWNER';
        } else {
          this.showSection = 'NOTES';
        }
        break;
    }
  }

}
