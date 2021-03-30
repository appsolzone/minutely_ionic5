import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { MeetingService } from 'src/app/shared/meeting/meeting.service';

@Component({
  selector: 'app-meeting-details-edit',
  templateUrl: './meeting-details-edit.page.html',
  styleUrls: ['./meeting-details-edit.page.scss'],
})
@Autounsubscribe()
export class MeetingDetailsEditPage implements OnInit {
  // observables
  sessionSubs$;
  meetingsSubs$;
  public sessionInfo: any;
  public meeting: any;

  constructor(
    private router: Router,
    private session: SessionService,
    private meetingservice: MeetingService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    let meetingStateData = history.state.data.meeting;
    console.log("meetingDetails ngOnInit")
    if(!meetingStateData){
      console.log("ngOnInit")
      this.router.navigate(['meeting']);
    } else{
      if(meetingStateData?.id!=this.meeting?.id){
        this.getMeeting(meetingStateData);
      }
    }
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    console.log("meetingDetails ionViewDidEnter", history.state.data?.meeting)
    let meetingStateData = history.state.data?.meeting ? history.state.data.meeting : this.meeting;
    if(!meetingStateData){
      console.log("ionViewDidEnter")
      this.router.navigate(['meeting']);
    } else {
      if(meetingStateData?.id!=this.meeting?.id){
        this.getMeeting(meetingStateData);
      }
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

  // search implement
  getMeeting(meetingStateData){
    // this.meeting = null;
    const data: any = meetingStateData.data;
    const id: string = meetingStateData.id;
    const meetingStart = moment(data.meetingStart).format('YYYY-MM-DDTHH:mm');
    const meetingEnd = moment(data.meetingEnd).format('YYYY-MM-DDTHH:mm');
    const weekdays = data.weekdays ? data.weekdays : [false,false,false,false,false,false,false];
    this.meeting = {id, data: {...data, meetingStart, meetingEnd, weekdays}};
    console.log("meeting details", this.meeting);

  }

}
