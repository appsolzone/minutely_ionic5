import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { MeetingService } from 'src/app/shared/meeting/meeting.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-meeting-details-edit',
  templateUrl: './meeting-details-edit.page.html',
  styleUrls: ['./meeting-details-edit.page.scss'],
})
@Autounsubscribe()
export class MeetingDetailsEditPage implements OnInit {
  // observables
  sessionSubs$;
  meetingsSubs$;
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
    const data: any = meetingStateData.data;
    const id: string = meetingStateData.id;
    const meetingStart = moment(data.meetingStart).format('YYYY-MM-DDTHH:mm');
    const meetingEnd = moment(data.meetingEnd).format('YYYY-MM-DDTHH:mm');
    const weekdays = data.weekdays ? data.weekdays : [false,false,false,false,false,false,false];
    this.meeting = {id, data: {...data, meetingStart, meetingEnd, weekdays}};
    this.refInformation = {id, meetingStart, meetingEnd,
                           status: data.status,
                           occurenceType: data.occurenceType,
                           weekdays: [...weekdays],
                           noOfOccurence: data.noOfOccurence,
                           ownerId: {...data.ownerId},
                           attendeeList: [...data.attendeeList],
                           meetingTitle: data.meetingTitle,
                           tags: [...data.tags],
                           toCascadeChanges: false};
    console.log("meeting details", this.meeting);

  }

  // saveMeeting
  async saveMeeting(){
    const { status, isOccurence, eventSequenceId, noOfOccurence } = this.meeting.data;
    let { toCascadeChanges } = this.refInformation;
    let title = '';
    let body = '';
    let response: boolean = false;
    let buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{response= false}  ,
                      resolve: false
                    }
                  ];
    let continueButtons = [...buttons,
                      {
                        text: 'Continue',
                        role: '',
                        cssClass: '',
                        handler: ()=>{response = true},
                        resolve: true
                      }
                    ];
    // If status is to CANCEL the meeting, no need to check validation status
    let validation = status=='CANCEL' ?
                     {status: true, title: 'cancel', body: 'cancel meeting'}
                     :
                     this.meetingservice.validateBasicInfo(this.meeting, this.refInformation);

    if(!validation.status){
      await this.common.presentAlertConfirm(validation.title,validation.body, buttons);
    } else {
      title = status != 'CANCEL' ? 'Confirmation' : 'WARNING'
      body = status != 'CANCEL' ?
                  "You are about to save changes for the meeting. Are you sure that you want to continue to update the meeting?"
                  :
                  "You are about to CANCEL this meeting, no change will be saved for the meeting. Are you sure that you want to continue to CANCEL the meeting?";
      response = false;
      await this.common.presentAlertConfirm(title,body, continueButtons);
      console.log("response", response);
      if(response){
        continueButtons[0].text = "No";
        continueButtons[1].text = "Yes";
        // Now check if we have to propagate changes for the meeting
        if(status != 'CANCEL' && this.refInformation.status != 'CANCEL' && !toCascadeChanges && isOccurence && eventSequenceId != noOfOccurence){
              title = "Confirmation";
              body = "This is a recurring meeting, would you like to amend ALL future events of this recurring schedule?";
              response = false;
              await this.common.presentAlertConfirm(title,body, continueButtons);
              toCascadeChanges = response;

          } else if(status == 'CANCEL' && isOccurence && eventSequenceId != noOfOccurence){
            title = toCascadeChanges ? 'WARNING' : 'ALERT';
            body = !toCascadeChanges ?
                  "This is a recurring meeting, would you like to CANCEL ALL future meetings of this recurring schedule?"
                  :
                  "This is a recurring meeting, you are about to CANCEL ALL future meetings of this recurring schedule. Are you sure you would like to continue?";
            response = false;
            await this.common.presentAlertConfirm(title,body, continueButtons);
            toCascadeChanges = response;
          }
          // If we are not cascading changes we should not check any thing else check the date again
          validation = status=='CANCEL' ?
                           {status: true, title: 'cancel', body: 'cancel meeting'}
                           :
                           this.meetingservice.validateBasicInfo(this.meeting, this.refInformation);
          if(!toCascadeChanges || status == 'CANCEL' || validation.status){
            // Now run the process as required
            // this.navData.loader = true;
            // Let's cascade changes for the update
            // first clean existing entries
            // await this.transaction('clean', true);
            // this.navData.loader = true;
            // then save new changes
            await this.common.showLoader("Processing meeting changes, please wait");
            let processMeetingstatus: any  = await this.meetingservice.processMeeting(this.meeting, this.refInformation, this.alllinkages, this.sessionInfo);
            console.log("this.meeting to be saved", this.meeting, this.alllinkages, this.editedlinkages, this.refInformation, processMeetingstatus);
            this.common.hideLoader();
            const {status, title, body } = processMeetingstatus;
            continueButtons[0].text = "Dismiss";
            continueButtons[1].text = "Continue";
            this.common.presentAlert(title, body, buttons);
            if(status=='success'){
              this.router.navigate(['meeting']);
            }
          }
      }
    }
  }

}
