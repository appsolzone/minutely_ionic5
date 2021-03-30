import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-meeting-basic-info-edit',
  templateUrl: './meeting-basic-info-edit.component.html',
  styleUrls: ['./meeting-basic-info-edit.component.scss'],
})
export class MeetingBasicInfoEditComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() meeting: any;
  @Input() editMode: boolean = false;
  // form data
  public noOfOccurenceOption: any = Array.from(Array(50)).map((a,i)=>i+1);
  public meetingDetails: any;
  public meetingExpired: boolean=false;
  public acceptedStatus: any;
  public minMeetingDate: any;
  public defaultMaxDate: any;
  public showCascadeChange: boolean = false;
  public toCascadeChanges: boolean = false;
  public meetingTag: string = '';

  constructor(
    private router: Router,
    private common: ComponentsService
  ) { }

  ngOnInit() {
    this.meetingDetails = this.meeting?.data;
    console.log("meetingdetails", this.meetingDetails);
    if(this.meetingDetails){
      this.checkAcceptence();
      this.initialiseEdit();
    }
  }
  ngOnChanges() {
    this.meetingDetails = this.meeting?.data;
    if(this.meetingDetails){
      this.checkAcceptence();
      this.initialiseEdit();
    }
  }

  checkAcceptence(){
    let now = new Date();
    let expired = this.meetingDetails.meetingStart;
    if(now > expired){
      this.meetingExpired = true;
    } else {
      this.meetingExpired = false;
    }
    let attendeePos = this.meetingDetails.attendeeList.findIndex((u,i)=>u.uid==this.sessionInfo.uid);
    if(attendeePos!=-1){
      this.acceptedStatus = this.meetingDetails.attendeeList[attendeePos].accepted ?
                            this.meetingDetails.attendeeList[attendeePos].accepted
                            :
                            'invited';
    }
  }
  // edit mode methods
  initialiseEdit(){
    // min and max start date
    this.minMeetingDate = moment().format('YYYY-MM-DD');
    this.defaultMaxDate = moment().add(5,'y').format('YYYY-MM-DD');
    this.meetingDetails.meetingStart = this.meetingDetails.meetingStart < new Date() ? null : moment(this.meetingDetails.meetingStart,'YYYY-MM-DDTHH:mm');
    this.meetingDetails.meetingEnd = this.meetingDetails.meetingEnd < new Date() ? null : moment(this.meetingDetails.meetingEnd,'YYYY-MM-DDTHH:mm');
    this.noOfOccurenceOption.splice(0,
                                      this.meetingDetails.noOfOccurence &&
                                      this.noOfOccurenceOption.length == 50
                                      ? this.meetingDetails.noOfOccurence-1 : 0);
    // console.log("this.noOfOccurenceOption",this.noOfOccurenceOption);
  }
  // cascadechanges
  checkCascadeState(){
    this.showCascadeChange = true;
  }
  // date changing
  async dateChange(showAlert:boolean=true){
    console.log("meeting details", this.meetingDetails, this.meetingDetails.meetingStart, this.minMeetingDate, this.defaultMaxDate);
    let title='';
    let body='';
    let startDateTime = new Date(this.meetingDetails.meetingStart);
    let isValidStartDate = !this.meetingDetails.isOccurence ||
                           !this.toCascadeChanges ||
                          (this.meetingDetails.occurenceType!='daily'
                            ||
                            (this.meetingDetails.occurenceType=='daily'
                             && this.meetingDetails.weekdays[parseInt(moment(startDateTime).format('e'))]
                             )
                          );
    if(new Date() <= startDateTime && isValidStartDate) {
      this.checkCascadeState();
      return true;
    } else {
     if(showAlert){
       if(!isValidStartDate){
           title = "Invalid Meeting Start Date";
           body = "Meeting start date should be on one of the weekdays selected for the meeting frequency. Please check and try again.";
           let buttons: any[] = [
                           {
                             text: 'Dismiss',
                             role: 'cancel',
                             cssClass: '',
                             handler: ()=>{}
                           }
                         ];
           await this.common.presentAlert(title,body, buttons);
        } else {
          title = "Invalid Meeting Start Date";
          body = "Meeting cannot be set in past. The meeting start time should be future time.";
          let buttons: any[] = [
                          {
                            text: 'Dismiss',
                            role: 'cancel',
                            cssClass: '',
                            handler: ()=>{}
                          }
                        ];
          await this.common.presentAlert(title,body, buttons);
       }
     }
    }
    return false;
  }

  addTag(){
    this.meetingDetails.tags.push(this.meetingTag);
    this.meetingTag = '';
  }

  removeTag(index){
    this.meetingDetails.tags.splice(index,1);
  }

  async onCascadeChanges(e){
    if(this.toCascadeChanges && this.meetingDetails.status=='COMPLETED'){
      let title = "Invalid Operation";
      let body = "It seems you are trying to propagate changes for the future meetings while the meeting status is COMPLETE. \
              This is not permitted, either cancel change propagation or change the meeting status as OPEN and try again.";
      let buttons: any[] = [
                      {
                        text: 'Dismiss',
                        role: 'cancel',
                        cssClass: '',
                        handler: ()=>{}
                      }
                    ];
      await this.common.presentAlert(title,body, buttons);
      this.toCascadeChanges = false;
      // this.toCascadeLinakges = false;
    } else{
      // this.toCascadeLinakges = false;
    }
  }

  async statusChanged(e)
  {
     let status = e.detail.value;
     let prevStatus = this.meetingDetails.status;
     console.log("this.meetingDetails.status", this.meetingDetails.status, status);
      if(status=='COMPLETED' && (this.toCascadeChanges)){ //|| this.toCascadeLinakges)
        let title = "Invalid Operation";
        let body = "It seems you are trying to mark the meeting COMPLETE and propagate changes for the future meetings. \
                    This is not permitted, either cancel change propagation or keep the meeting status as OPEN and try again.";
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        }
                      ];
        await this.common.presentAlert(title,body, buttons);
        this.meetingDetails.status = 'OPEN';
      } else {
        this.meetingDetails.status=status;
      }
  }

}
