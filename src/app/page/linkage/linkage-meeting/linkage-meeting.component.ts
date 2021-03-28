import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-linkage-meeting',
  templateUrl: './linkage-meeting.component.html',
  styleUrls: ['./linkage-meeting.component.scss'],
})
export class LinkageMeetingComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() meetings: any[];
  public linkedMeetings: any[];

  constructor(
    private router:Router,
  ) { }

  ngOnInit() {
    if(this.meetings){
      this.getLinkedMeetings();
    }
  }

  ngOnDestroy(){}

  ngOnChanges() {
    if(this.meetings){
      this.getLinkedMeetings();
    }
  }

  getLinkedMeetings(){
    let newMeetings = this.meetings.map(m=>{
      const data = m.data;
      const id = m.id;
      const meetingStart = new Date(data.meetingStart?.seconds*1000);
      const meetingEnd = data.meetingEnd?.seconds ? new Date(data.meetingEnd?.seconds*1000) : null;
      // return {id, data: { ...data, startTime, endTime }};
      return {id, data: {...data, meetingStart, meetingEnd }};
    });
    this.linkedMeetings =[];
    this.linkedMeetings = newMeetings.sort((a:any,b:any)=>a.data.meetingStart-b.data.meetingStart);
  }

  openMeetingDetails(meeting){
    this.router.navigate(['meeting/meeting-details-linkage/'+meeting.id],{state: {data:{meeting: meeting}}});
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

}
