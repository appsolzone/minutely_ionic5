import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from '../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
@Autounsubscribe()
export class ActivitiesPage implements OnInit {
  // observables
  sessionSubs$;
  public sessionInfo: any;
  public showActivitySearch: boolean = false;

  constructor(
    private router:Router,
    private session: SessionService,
  ) {
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    if(!this.sessionInfo || !this.sessionInfo?.uid){
      this.router.navigate(['profile']);
    }
  }

  ngOnDestroy(){

  }

  openSearchActivities(){
    this.router.navigateByUrl('activities/activity-search');
  }
  gotoTeamActivities(){
    this.router.navigateByUrl('activities/team-activities');
  }

}
