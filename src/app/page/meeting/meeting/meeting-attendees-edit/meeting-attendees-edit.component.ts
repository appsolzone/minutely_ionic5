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
          attendeeList.push({name, picUrl, email, uid, attendance: attendance ? attendance : null, accepted:  accepted ? accepted : 'invited'});
        }
      });
    this.meetingDetails.attendeeList = attendeeList;
    this.generateAttendeeListUid();
    this.showSelectAttendees = false;
  }

  changeMeetingOwner(owner){
    console.log("owner selected",owner);
    const {name, picUrl, email, uid, attendance, accepted } = owner;
    this.meetingDetails.ownerId = {name, picUrl, email, uid };
    this.generateAttendeeListUid();
    this.showSelectOwner = false;
  }

  generateAttendeeListUid(){
    let attendeeUidList = this.meetingDetails.attendeeList.map(a=>a.uid);
    attendeeUidList.push(this.meetingDetails.ownerId.uid);
    this.meetingDetails.attendeeUidList = attendeeUidList;
  }

  recordAttendance(type, data, i){
    data.attendance = type;
  }

}
