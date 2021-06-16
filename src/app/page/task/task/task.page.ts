import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { MinutelyKpiService } from 'src/app/shared/minutelykpi/minutelykpi.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { AnalyticsService } from 'src/app/shared/analytics/analytics.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
@Autounsubscribe()
export class TaskPage implements OnInit {

  // observables
  sessionSubs$;
  public sessionInfo: any;

  constructor(
    private router: Router,
    private kpi: MinutelyKpiService,
    private session: SessionService,
    private analytics: AnalyticsService,
  ) { }

  ngOnInit() {
     this.getSessionInfo();
     this.collectAnalytics();
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    this.collectAnalytics();
  }

  collectAnalytics(name: any ='Task_home'){
    this.analytics.setScreenName({name: 'TaskPage'});
    let event = {
      name: name,
      params: {}
    };
    this.analytics.logEvent(event);
  }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("task Session Subscription got", value, this.sessionInfo?.userProfile?.subscriberId , value?.userProfile?.subscriberId);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid){
        // TBA
      }
      if(value?.userProfile && this.sessionInfo?.userProfile?.subscriberId != value?.userProfile?.subscriberId){
        // No need as it'll be initialized by meetings page
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  gotoAddTask(){
    this.router.navigate(['task/create-task'])
  }

}
