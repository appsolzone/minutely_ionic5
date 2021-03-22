import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-team-activity-stats-mobile',
  templateUrl: './team-activity-stats-mobile.page.html',
  styleUrls: ['./team-activity-stats-mobile.page.scss'],
})
@Autounsubscribe()
export class TeamActivityStatsMobilePage implements OnInit {
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
        // re initialise all content
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });

  }

  ngOnInit() {
  }
  ngOnDestroy(){}

}
