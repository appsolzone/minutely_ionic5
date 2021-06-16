import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  // @Input() editedlinkedMeetings: any[];
  @Input() viewMode = '';
  // @Input() alllinkedMeetings: any[];
  @Output() onEditLinkage = new EventEmitter<any>();
  public showSearchList: boolean = false;
  public linkedMeetings: any[] =[];
  public editedlinkedMeetings: any[] = [];

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
      console.log("getLinkedMeetings....onngChange", this.meetings)
      this.getLinkedMeetings();
    }
  }

  getLinkedMeetings(){
    let newMeetings = this.meetings.map(m=>{
      const data = m.data;
      const id = m.id;
      const state = m.state;
      // const meetingStart = data.meetingStart?.seconds ? new Date(data.meetingStart?.seconds*1000) : data.meetingStart? data.meetingStart : null;
      const meetingStart = data.meetingStart?.seconds ? new Date(data.meetingStart?.seconds*1000) : data.meetingStart ? data.meetingStart : null;
      const meetingEnd = data.meetingEnd?.seconds ? new Date(data.meetingEnd?.seconds*1000) : data.meetingEnd ? data.meetingEnd : null;
      // return {id, data: { ...data, startTime, endTime }};
      if(state){
        return {id, data: {...data, meetingStart, meetingEnd }, state};
      } else {
        return {id, data: {...data, meetingStart, meetingEnd }};
      }

    });
    // this.linkedMeetings =[];
    this.linkedMeetings = newMeetings.sort((a:any,b:any)=>a.data.meetingStart-b.data.meetingStart);
    this.editedlinkedMeetings = this.linkedMeetings.filter(m=>['pending','delete'].includes(m.state));
    console.log("getLinkedMeetings....", this.linkedMeetings, this.editedlinkedMeetings)
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
    this.onEditLinkage.emit({editedlinkages: this.editedlinkedMeetings});
    this.common.presentToaster("'"+m.data.meetingTitle+"' has been added to the list of linked meeting. It'll be saved when the changes are saved.")
    console.log("linkSelectedMeeting", this.linkedMeetings, this.editedlinkedMeetings)
  }

  undoDelinkMeeting(m,i){
    // now check if the state is to be deleted 'delete'
    // then restore the linkage back
    const data = m.data;
    const id = m.id;
    let eidx = this.editedlinkedMeetings.findIndex(elm=>elm.id==id);
    this.editedlinkedMeetings.splice(eidx,1);
    delete m.state;
    this.onEditLinkage.emit({editedlinkages: this.editedlinkedMeetings});
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
      // m.state= 'delete';
    }
    this.onEditLinkage.emit({linkages: this.linkedMeetings, editedlinkages: this.editedlinkedMeetings});

    this.common.presentToaster("'"+m.data.meetingTitle+"' has been removed from the list of linked meeting. It'll be saved when the changes are saved.")
    console.log("delinkSelectedMeeting", this.linkedMeetings, this.editedlinkedMeetings)
  }

}
