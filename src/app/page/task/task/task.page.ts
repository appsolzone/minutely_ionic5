import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { KpiService } from 'src/app/shared/kpi/kpi.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
@Autounsubscribe()
export class TaskPage implements  OnInit,OnDestroy {
  // observables
  sessionSubs$;
  public sessionInfo: any;

  constructor(
    private router:Router,
    private crud:CrudService,
    private session:SessionService,
    private kpi:KpiService,
  ) { }

  ngOnInit() {
    this.getSessionInfo();
  }

  ngOnDestroy(){}

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("testing :",value?.userProfile?true:false);
      if(this.sessionInfo?.uid != value?.uid){
        // TBA
      }
      if(value?.userProfile && this.sessionInfo?.userProfile?.subscriberId != value?.userProfile?.subscriberId){
        this.kpi.initialiseKpi(value);
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
     });
  }

  naviageteAddPage(){
   let actions = this.crud.crud_action; 
   actions = {
     service:'Task',
     type:'create',
     parentModule:'task',
     header:'Create new task',
     object:this.crud.passingObj
   } 
   this.crud.crud_action$.next(actions);
   this.router.navigate(['/task/initiate']);
  }
}
