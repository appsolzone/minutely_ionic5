import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
@Autounsubscribe()
export class TaskDetailsPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;
  public sessionInfo: any;
  public task: any;

  //variable
  public riskCopy:any|null = null;
  public toggleEditMode:boolean = false;

  status:string='';
  maxMeetingDate: any = moment().add(20,'years').format("YYYY");
  minMeetingDate: any = moment().format("YYYY-MM-DD");
  date: any;

  addThisTag:string;
  
  constructor(
    private crud:CrudService,
    private router:Router,
    private session:SessionService,
    ) {
        this.getSessionInfo();
     }

  ngOnInit() {
    this.task = history.state.data.task;
    console.log("taskDetails ngOnInit",this.task)
    if(!this.task){
      console.log("ngOnInit")
      this.router.navigate(['task']);
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
    this.task = history.state.data?.task ? history.state.data.task : this.task;
    console.log(this.task)
    if(!this.task){
      console.log("ionViewDidEnter")
      this.router.navigate(['task']);
    }
  }


  goToCommentPage(task){
   let passObj = {...task,parentModule:'task',navigateBack:'/task/task-details'};
   this.crud.detailsPagePasing$.next(passObj);
   this.router.navigate(['/task/task-details/comments']); 
  }
}
