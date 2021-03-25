import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.page.html',
  styleUrls: ['./meeting-details.page.scss'],
})
@Autounsubscribe()
export class MeetingDetailsPage implements OnInit {
  // observables
  sessionSubs$;
  public sessionInfo: any;
  public meeting: any;

  constructor(
    private router: Router,
    private session: SessionService
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    this.meeting = history.state.data.meeting;
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

}
