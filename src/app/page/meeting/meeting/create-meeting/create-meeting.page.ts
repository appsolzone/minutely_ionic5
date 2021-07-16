import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { MeetingService } from 'src/app/shared/meeting/meeting.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { AnalyticsService } from 'src/app/shared/analytics/analytics.service';
import { MeetingGuideService } from 'src/app/shared/tourGuide/meetingPage/meeting-guide.service';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.page.html',
  styleUrls: ['./create-meeting.page.scss'],
})
@Autounsubscribe()
export class CreateMeetingPage implements OnInit, OnDestroy {
  // observables
  sessionSubs$;
  meetingsSubs$;
  public showSection: string ='BASICINFO';
  public sessionInfo: any;
  public meeting: any;
  public refInformation: any;
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
    private analytics: AnalyticsService,
    private meetingguide: MeetingGuideService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    // console.log("meetingDetails ngOnInit")
    // if(!meetingStateData){
    //   console.log("ngOnInit")
    //   this.router.navigate(['meeting']);
    // } else{
        let meeting = {...this.meetingservice.newMeeting,
                        tags:[],
                        attendeeList:[],
                        attendeeUidList:[],
                        weekdays:[false, false, false, false, false, false, false],
                      };
        this.getMeeting({id:null,data:meeting});
    // }
    this.collectAnalytics();
  }

  ionViewWillEnter(){
    console.log("ionViewDidEnter meetingguide");
    if (!this.sessionInfo || !this.sessionInfo?.uid) {
      this.router.navigate(['profile']);
    } else {
      console.log("ionViewDidEnter meetingguide");
      this.meetingguide.createMeeting();
    }
    this.collectAnalytics();
  }

  ngOnDestroy(){}

  collectAnalytics(name: any ='Open_Create_Meeting'){
    this.analytics.setScreenName({name: 'CreateMeetingPage'});
    let event = {
      name: name,
      params: {}
    };
    this.analytics.logEvent(event);
  }

  sectionChanged(e)
  {
     this.showSection = e.detail.value;
   }

  ionViewDidEnter(){
    // console.log("meetingDetails ionViewDidEnter", history.state.data?.meeting)
    // let meetingStateData = history.state.data?.meeting ? history.state.data.meeting : this.meeting;
    // if(!meetingStateData){
    //   console.log("ionViewDidEnter")
    //   this.router.navigate(['meeting']);
    // } else {
    //   // if(meetingStateData?.id!=this.meeting?.id){
    //   //   this.getMeeting(meetingStateData);
    //   // }
    // }
  }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(this.sessionInfo?.userProfile && this.meeting?.data){
        const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
        console.log("userprofile values, ", uid, email, name, picUrl)
        this.meeting.data.subscriberId =subscriberId;
        this.meeting.data.ownerId ={uid, email, name, picUrl};
        this.meeting.data.attendeeUidList.push(uid);
        this.refInformation.ownerId = {uid, email, name, picUrl};
      }
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
    const meetingStart = null; //moment(data.meetingStart).format('YYYY-MM-DDTHH:mm');
    const meetingEnd = null; //moment(data.meetingEnd).format('YYYY-MM-DDTHH:mm');
    const weekdays = data.weekdays ? data.weekdays : [false,false,false,false,false,false,false];
    this.meeting = {id, data: {...data, meetingStart, meetingEnd, weekdays}};
    this.refInformation = {id, meetingStart, meetingEnd,
                           status: data.status,
                           occurenceType: data.occurenceType,
                           weekdays: [...weekdays],
                           noOfOccurence: data.noOfOccurence,
                           ownerId: {...data.ownerId},
                           attendeeList: [...data.attendeeList],
                           attendeeUidList: [...data.attendeeUidList],
                           meetingTitle: data.meetingTitle,
                           tags: [...data.tags],
                           toCascadeChanges: true};
     if(this.sessionInfo?.userProfile && this.meeting?.data){
       const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
       console.log("userprofile values, ", uid, email, name, picUrl)
       this.meeting.data.subscriberId =subscriberId;
       this.meeting.data.ownerId ={uid, email, name, picUrl};
       this.meeting.data.attendeeUidList.push(uid);
       this.refInformation.ownerId = {uid, email, name, picUrl};
     }
    console.log("meeting details", this.meeting);

  }

  // saveMeeting
  async saveMeeting(){
    this.collectAnalytics('Save_Meeting');
    const { status, isOccurence, eventSequenceId, noOfOccurence, attendeeList } = this.meeting.data;
    let { toCascadeChanges } = this.refInformation;
    let title = '';
    let body = '';
    let response: boolean = false;
    let buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{response = false;},
                      resolve: false
                    }
                  ];
    let continueButtons = [...buttons,
                      {
                        text: 'Continue',
                        role: '',
                        cssClass: '',
                        handler: ()=>{response = true;},
                        resolve: true
                      }
                    ];
    // If status is to CANCEL the meeting, no need to check validation status
    let validation = status=='CANCEL' ?
                     {status: true, title: 'cancel', body: 'cancel meeting'}
                     :
                     this.meetingservice.validateBasicInfo(this.meeting, this.refInformation, this.sessionInfo);

    if(!validation.status){
      await this.common.presentAlertConfirm(validation.title,validation.body, buttons);
      this.showSection = 'BASICINFO';
    } else {
      response = true;
      if(attendeeList.length==0){
        title = 'Confirmation';
        body = "No attendee has been added/selected for the meeting. Are you sure that you want to continue to create the meeting without any attendee?"
        response = false;
        await this.common.presentAlertConfirm(title,body, continueButtons);
      }
      if(response){
        // this.meetingservice.processMeeting(this.meeting, this.refInformation, this.alllinkages, this.sessionInfo);
        await this.common.showLoader("Creating meeting, please wait...");
        let processMeetingstatus: any = await this.meetingservice.processMeeting(this.meeting, this.refInformation, this.alllinkages, this.sessionInfo);
        console.log("this.meeting to be saved", this.meeting, this.alllinkages, this.refInformation, processMeetingstatus);
        this.common.hideLoader();
        const {status, title, body } = processMeetingstatus;
        this.common.presentAlert(title, body, buttons);
        if(status=='success'){
          this.router.navigate(['meeting']);
        }
      } else {
        this.showSection = 'ATTENDEES';
      }
    }
  }

  gotoSection(action){
    switch(action){
      case 'back':
        if(this.showSection=='ATTENDEES'){
          this.showSection = 'BASICINFO';
        } else if(this.showSection=='AGENDA'){
          this.showSection = 'ATTENDEES';
        } else {
          this.showSection = 'AGENDA';
        }
        break;
      case 'forward':
        if(this.showSection=='BASICINFO'){
          this.showSection = 'ATTENDEES';
        } else if(this.showSection=='ATTENDEES'){
          this.showSection = 'AGENDA';
        } else {
          this.showSection = 'LOCATION';
        }
        break;
    }
  }

}
