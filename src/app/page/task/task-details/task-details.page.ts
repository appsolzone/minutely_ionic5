import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { TaskService } from 'src/app/shared/task/task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
@Autounsubscribe()
export class TaskDetailsPage implements OnInit,OnDestroy {
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


  constructor(
    private router:Router,
    private session:SessionService,
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

  getSessionInfo(){
   this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

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

   // search implement
  getTask(taskStateData){
    // this.task = null;
    this.tasksSubs$ = this.taskService.getTaskById(taskStateData.id)
                          .subscribe(act=>{
                              const data: any = act.payload.data();
                              const id: string = act.payload.id;
                              const taskInitiationDate = new Date(data.taskInitiationDate?.seconds*1000);
                              let actualCompletionDate =  data.actualCompletionDate ? new Date(data.actualCompletionDate.seconds*1000) : null;
                              const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
                              this.task = {id, data: {...data, targetCompletionDate, taskInitiationDate, actualCompletionDate }};

                              console.log("task details", this.task);
                          });

  }

  // edit linkage callback
  publishLinkage(ev){
    this.alllinkages = ev.linkages;
    this.editedlinkages = ev.editedlinkages;
    console.log("edited data received risk", this.alllinkages, this.editedlinkages);
  }




  // goToCommentPage(task){
  //  let passObj = {...task,parentModule:'task',navigateBack:'/task/task-details'};
  //  this.crud.detailsPagePasing$.next(passObj);
  //  this.router.navigate(['/task/task-details/comments']);
  // }

    // edittask
  editTask(){
    this.router.navigate(['task/task-details-edit'],{state: {data:{task: this.task}}});
  }
  // share task
  // async sendMinutes(){
  //   let response = await this.taskService.sharetaskMinutes(this.task, this.alllinkages);
  //   let buttons = [
  //                   {
  //                     text: 'Dismiss',
  //                     role: 'cancel',
  //                     cssClass: '',
  //                     handler: ()=>{}
  //                   }
  //                 ];
  //   this.common.presentAlert(response.title, response.body, buttons);
  // }

  sendTaskDetails(){
    // TBA
  }


}
