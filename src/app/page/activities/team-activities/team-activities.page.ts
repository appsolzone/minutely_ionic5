import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-team-activities',
  templateUrl: './team-activities.page.html',
  styleUrls: ['./team-activities.page.scss'],
})
@Autounsubscribe()
export class TeamActivitiesPage implements OnInit {
  // observables
  sessionSubs$;
  public sessionInfo: any;

  constructor(
    private router:Router,
    private session: SessionService,
  ) {
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        // TBA
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['activities']);
      }
      // call getactivities if no sessionInfo to clean the subscription and timer
      // else if sessionInfo is present and not subscribed yet then subscribe to get the data
      // if(!value || (value?.uid && value?.subscriberId && !this.ongoingActivitySubs$?.unsubscribe && !this.activitySubs$?.unsubscribe)){
      //   this.router.navigate(['activities']);
      // }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(){

  }

}
