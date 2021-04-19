import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { TaskService } from 'src/app/shared/task/task.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { Platform, PopoverController } from '@ionic/angular';
import { SelectUsersComponent } from 'src/app/page/select-users/select-users.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
@Autounsubscribe()
export class TaskDetailsPage implements OnInit {

  // observables
  sessionSubs$;
  tasksSubs$;
  public sessionInfo: any;
  public task: any;
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
  public sendTaskDetailsMode:boolean = false;
  constructor(
    private router: Router,
    private session: SessionService,
    private taskservice: TaskService,
    private common: ComponentsService,
    public platform: Platform,
    public popoverController: PopoverController
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
    this.tasksSubs$ = this.taskservice.getTaskById(taskStateData.id)
                          .subscribe(act=>{
                              const data: any = act.payload.data();
                              const id: string = act.payload.id;
                              const taskInitiationDate = new Date(data.taskInitiationDate?.seconds*1000);
                              const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
                              const actualCompletionDate = data.actualCompletionDate?.seconds ? new Date(data.actualCompletionDate?.seconds*1000) : null;
                              const overdue =  data.taskStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
                              const overdueby = overdue=='overdue' ? moment(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')).fromNow() : '';
                              this.task = {id, data: {...data, taskInitiationDate, targetCompletionDate, actualCompletionDate },overdue,overdueby};

                              console.log("task details", this.task);
                          });

  }
  // edit linkage callback
  publishLinkage(ev){
    this.alllinkages = ev.linkages;
    this.editedlinkages = ev.editedlinkages;
    console.log("edited data received", this.alllinkages, this.editedlinkages);
  }

  // editTask
  editTask(){
    this.router.navigate(['task/task-details-edit'],{state: {data:{task: this.task}}});
  }


  sendTaskDetails(ev: any){
    // if(this.platform.is('desktop') || this.platform.is('tablet')){
      this.sendTaskDetailsMode = !this.sendTaskDetailsMode;
      // console.log(this.platform.is('desktop') || this.platform.is('tablet'));
      // this.presentPopover(ev);
    // }else{
      this.router.navigate(['task/send-email'],{state: {data:{service: this.task,linkages:this.alllinkages,parentsModule:'task'}}});
    // }
  }

  // share task
  async shareTaskDetails(selectedMembers){
    console.log("in parent module",selectedMembers);
    if (selectedMembers != null){
      let response: any = await this.taskservice.shareTaskMinutes(this.task, this.alllinkages,selectedMembers);
      let buttons = [
                      {
                        text: 'Dismiss',
                        role: 'cancel',
                        cssClass: '',
                        handler: ()=>{}
                      }
                    ];
      this.common.presentAlert(response.title, response.body, buttons);
    }
  }
  async presentPopover(ev: any) {
    this.sendTaskDetailsMode = !this.sendTaskDetailsMode;
    const popover = await this.popoverController.create({
      component: SelectUsersComponent,
      cssClass: 'customPopover',
      event: ev,
      translucent: true,
      componentProps: {
        sessionInfo:this.sessionInfo, alreadySelectedUserList: this.task.data.taskOwner? [this.task.data.taskOwner] : [],
        buttonItem: { icon: 'paper-plane-outline', text: 'Send mail'},
        showAddUser: false,
        sectionHeader: { icon: 'people', text: 'Select Users to send email ' },
        multiSelect:true,
        popoverMode:true,
       },
      // mode:'ios',
      backdropDismiss:true //false
    });

   await popover.present();

   popover.onDidDismiss().then((dataReturned) => {
      console.log("returnded selected members:",dataReturned.data);
      if (dataReturned != null) {
        this.shareTaskDetails(dataReturned.data);
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });
  }
}
