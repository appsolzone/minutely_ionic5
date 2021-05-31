import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { MinutelyKpiService } from 'src/app/shared/minutelykpi/minutelykpi.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.page.html',
  styleUrls: ['./issue.page.scss'],
})
@Autounsubscribe()
export class IssuePage implements OnInit {

  // observables
  sessionSubs$;
  public sessionInfo: any;

  constructor(
    private router: Router,
    private kpi: MinutelyKpiService,
    private session: SessionService
  ) { }

  ngOnInit() {
     this.getSessionInfo();
  }

  ngOnDestroy(){}

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("issue Session Subscription got", value, this.sessionInfo?.userProfile?.subscriberId , value?.userProfile?.subscriberId);
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

  gotoAddIssue(){
    this.router.navigate(['issue/create-issue'])
  }

}
