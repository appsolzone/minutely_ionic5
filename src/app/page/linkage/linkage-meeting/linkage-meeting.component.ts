import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { LinkageService } from 'src/app/shared/linkage/linkage.service';

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
  @Input() alllinkedMeetings: any[];
  public showSearchList: boolean = false;
  public linkedMeetings: any[];

  constructor(
    private router:Router,
    private common: ComponentsService,
    private linkage: LinkageService
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
    this.alllinkedMeetings = [...this.linkedMeetings];
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
    this.editedlinkedMeetings.push({...m,state: 'pending'});
    this.linkedMeetings.push({...m,state: 'pending'});
    this.alllinkedMeetings = [...this.linkedMeetings];
    this.common.presentToaster("'"+m.data.meetingTitle+"' has been added to the list of linked meeting. It'll be saved when the changes are saved.")
    console.log("linkSelectedMeeting", this.alllinkedMeetings, this.linkedMeetings, this.editedlinkedMeetings)
  }

  undoDelinkMeeting(m){
    // now check if the state is to be deleted 'delete'
    // then restore the linkage back
    const data = m.data;
    const id = m.id;
    let eidx = this.editedlinkedMeetings.findIndex(elm=>elm.id==id);
    this.editedlinkedMeetings.splice(eidx,1);
    delete m.state;
    this.alllinkedMeetings = [...this.linkedMeetings];
    this.common.presentToaster("The linkage has been restored for '"+m.data.meetingTitle+"'. It'll be saved when the changes are saved.")
  }

  delinkSelectedMeeting(m,i){
    console.log("delinkSelectedMeeting", m, i)
    const data = m.data;
    const id = m.id;
    // if its already pending just delete it from the list
    if(m.state=='pending'){
      let eidx = this.editedlinkedMeetings.findIndex(elm=>elm.id==id);
      this.editedlinkedMeetings.splice(eidx,1);
      this.linkedMeetings.splice(i,1);
    } else {
      this.editedlinkedMeetings.push({...m,state: 'delete'});
      // now set the state as delete
      m.state= 'delete';
    }
    this.alllinkedMeetings = [...this.linkedMeetings];

    this.common.presentToaster("'"+m.data.meetingTitle+"' has been removed from the list of linked meeting. It'll be saved when the changes are saved.")
    console.log("delinkSelectedMeeting", this.linkedMeetings, this.editedlinkedMeetings)
  }

}
