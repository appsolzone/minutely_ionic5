import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { MinutelyKpiService } from 'src/app/shared/minutelykpi/minutelykpi.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { AnalyticsService } from 'src/app/shared/analytics/analytics.service';
import { MeetingGuideService } from 'src/app/shared/tourGuide/meetingPage/meeting-guide.service';

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
    private kpi: MinutelyKpiService,
    private session: SessionService,
    private analytics: AnalyticsService,
    private meetingguide: MeetingGuideService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
     this.collectAnalytics();
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    if (!this.sessionInfo || !this.sessionInfo?.uid) {
      this.router.navigate(['profile']);
    } else {
      this.meetingguide.meetingDashboardTour(this.gotoAddMeeting.bind(this));
    }
    this.collectAnalytics();
  }

  collectAnalytics(name: any ='Meeting_home'){
    this.analytics.setScreenName({name: 'MeetingPage'});
    let event = {
      name: name,
      params: {}
    };
    this.analytics.logEvent(event);
  }

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
      if(!this.sessionInfo || !this.sessionInfo?.userProfile?.uid){
        this.router.navigate(['profile']);
      }
    });
  }

  gotoAddMeeting(){
    this.router.navigate(['meeting/create-meeting'])
  }
}
