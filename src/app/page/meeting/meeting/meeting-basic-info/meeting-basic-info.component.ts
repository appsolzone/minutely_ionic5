import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meeting-basic-info',
  templateUrl: './meeting-basic-info.component.html',
  styleUrls: ['./meeting-basic-info.component.scss'],
})
export class MeetingBasicInfoComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() meeting: any;
  // form data
  public meetingDetails: any;
  public meetingExpired: boolean=false;
  public acceptedStatus: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.meetingDetails = this.meeting?.data;
    console.log("meetingdetails", this.meetingDetails);
    if(this.meetingDetails){
      this.checkAcceptence();
    }
  }
  ngOnChanges() {
    this.meetingDetails = this.meeting?.data;
    if(this.meetingDetails){
      this.checkAcceptence();
    }
  }

  checkAcceptence(){
    let now = new Date();
    let expired = this.meetingDetails.meetingStart;
    if(now > expired){
      this.meetingExpired = true;
    } else {
      this.meetingExpired = false;
    }
    let attendeePos = this.meetingDetails.attendeeList.findIndex((u,i)=>u.uid==this.sessionInfo.uid);
    if(attendeePos!=-1){
      this.acceptedStatus = this.meetingDetails.attendeeList[attendeePos].accepted ?
                            this.meetingDetails.attendeeList[attendeePos].accepted
                            :
                            'invited';
    }
  }

}
