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
  @Input() editedlinkedMeetings: any[];
  @Input() viewMode = '';
  public linkedMeetings: any[];
  public showSearchList: boolean = false;

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
      const meetingStart = data.meetingStart?.seconds ? new Date(data.meetingStart?.seconds*1000) : data.meetingStart;
      const meetingEnd = data.meetingEnd?.seconds ? new Date(data.meetingEnd?.seconds*1000) : data.meetingEnd ? data.meetingEnd : null;
      // return {id, data: { ...data, startTime, endTime }};
      return {id, data: {...data, meetingStart, meetingEnd }};
    });
    // this.linkedMeetings =[];
    this.linkedMeetings = newMeetings.sort((a:any,b:any)=>a.data.meetingStart-b.data.meetingStart);
  }

  openMeetingDetails(meeting){
    this.router.navigate(['meeting/meeting-details-linkage/'+meeting.id],{state: {data:{meeting: meeting}}});
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

  linkSelectedMeeting(m){
    console.log("linkSelectedMeeting", m)
    const data = m.data;
    const id = m.id;
    let idx = this.linkedMeetings.findIndex(lm=>lm.id==id);
    if(idx!=-1){
      this.linkedMeetings.splice(idx,1);
      this.meetings.splice(idx,1);
    }
    // const meetingStart = new Date(data.meetingStart?.seconds*1000);
    // const meetingEnd = data.meetingEnd?.seconds ? new Date(data.meetingEnd?.seconds*1000) : null;
    // return {id, data: { ...data, startTime, endTime }};
    this.editedlinkedMeetings.push(m);
    this.linkedMeetings.push(m);
    console.log("linkSelectedMeeting", this.linkedMeetings, this.editedlinkedMeetings)
  }

}
