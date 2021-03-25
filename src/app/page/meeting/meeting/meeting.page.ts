import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { KpiService } from 'src/app/shared/kpi/kpi.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.page.html',
  styleUrls: ['./meeting.page.scss'],
})
@Autounsubscribe()
export class MeetingPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;
  public sessionInfo: any;

  constructor(
    private router: Router,
    private kpi: KpiService,
    private session: SessionService
  ) { }

  ngOnInit() {
     this.getSessionInfo();
  }

  ngOnDestroy(){}

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("meeting Session Subscription got", value, this.sessionInfo?.userProfile?.subscriberId , value?.userProfile?.subscriberId);
      // Re populate the values as required
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
}
