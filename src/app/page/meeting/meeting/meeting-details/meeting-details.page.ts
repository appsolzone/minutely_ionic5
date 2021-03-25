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
    console.log("meetingDetails ngOnInit")
    if(!this.meeting){
      console.log("ngOnInit")
      this.router.navigate(['meeting']);
    }
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    console.log("meetingDetails ionViewDidEnter", history.state.data?.meeting)
    this.meeting = history.state.data?.meeting ? history.state.data.meeting : this.meeting;
    if(!this.meeting){
      console.log("ionViewDidEnter")
      this.router.navigate(['meeting']);
    }
  }

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
