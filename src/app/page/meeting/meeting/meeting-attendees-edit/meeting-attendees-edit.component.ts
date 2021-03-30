import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-meeting-attendees-edit',
  templateUrl: './meeting-attendees-edit.component.html',
  styleUrls: ['./meeting-attendees-edit.component.scss'],
})
export class MeetingAttendeesEditComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() meeting: any;
  // form data
  public meetingDetails: any;
  public showSelectAttendees: boolean = false;
  public showSelectOwner: boolean = false;

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

  processAttendeeList(userList){
    let attendeeList = [];
    userList.forEach(u=>{
        const {name, picUrl, email, uid, attendance, accepted } = u;
        if(u.uid!=this.meetingDetails.ownerId.uid){
          attendeeList.push({name, picUrl, email, uid, attendance, accepted });
        }
      });
    this.meetingDetails.attendeeList = attendeeList;
    this.showSelectAttendees = false;
  }

  changeMeetingOwner(owner){
    console.log("owner selected",owner);
    const {name, picUrl, email, uid, attendance, accepted } = owner;
    this.meetingDetails.ownerId = {name, picUrl, email, uid, attendance, accepted };
    this.showSelectOwner = false;
  }

}
