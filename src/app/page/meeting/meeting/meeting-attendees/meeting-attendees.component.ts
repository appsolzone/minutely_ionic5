import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-meeting-attendees',
  templateUrl: './meeting-attendees.component.html',
  styleUrls: ['./meeting-attendees.component.scss'],
})
export class MeetingAttendeesComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() meeting: any;
  // form data
  public meetingDetails: any;

  constructor() { }

  ngOnInit() {
    this.meetingDetails = this.meeting?.data;
  }

  ngOnChanges() {
    this.meetingDetails = this.meeting?.data;
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

}
