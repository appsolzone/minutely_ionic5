import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { MeetingService } from 'src/app/shared/meeting/meeting.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.page.html',
  styleUrls: ['./meeting-details.page.scss'],
})
@Autounsubscribe()
export class MeetingDetailsPage implements OnInit {
  // observables
  sessionSubs$;
  meetingsSubs$;
  public sessionInfo: any;
  public meeting: any;
  public alllinkages: any = {
                            meetings: [],
                            tasks: [],
                            issues: [],
                            risks: []
                          };
  public editedlinkages: any = {
                            meetings: [],
                            tasks: [],
                            issues: [],
                            risks: []
                          };

  constructor(
    private router: Router,
    private session: SessionService,
    private meetingservice: MeetingService,
    private common: ComponentsService,
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
    this.meetingsSubs$ = this.meetingservice.getMeetingById(meetingStateData.id)
                          .subscribe(act=>{
                              const data: any = act.payload.data();
                              const id: string = act.payload.id;
                              const meetingStart = new Date(data.meetingStart?.seconds*1000);
                              const meetingEnd = data.meetingEnd?.seconds ? new Date(data.meetingEnd?.seconds*1000) : null;
                              this.meeting = {id, data: {...data, meetingStart, meetingEnd }};

                              console.log("meeting details", this.meeting);
                          });

  }
  // edit linkage callback
  publishLinkage(ev){
    this.alllinkages = ev.linkages;
    this.editedlinkages = ev.editedlinkages;
    console.log("edited data received", this.alllinkages, this.editedlinkages);
  }

  // editMeeting
  editMeeting(){
    this.router.navigate(['meeting/meeting-details-edit'],{state: {data:{meeting: this.meeting}}});
  }
  // share minutes
  async sendMinutes(){
    let response = await this.meetingservice.shareMeetingMinutes(this.meeting, this.alllinkages);
    let buttons = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{}
                    }
                  ];
    this.common.presentAlert(response.title, response.body, buttons);
  }

}
