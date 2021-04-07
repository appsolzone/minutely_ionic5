import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-risk-basic-info-edit',
  templateUrl: './risk-basic-info-edit.page.html',
  styleUrls: ['./risk-basic-info-edit.page.scss'],
})
export class RiskBasicInfoEditPage implements OnInit {
  @Input() sessionInfo: any;
  @Input() risk: any;
  @Input() refInformation: any;
  @Input() editMode: string = 'update';
  // form data
  // public noOfOccurenceOption: any = Array.from(Array(30)).map((a,i)=>i+1);
  public riskDetails: any;
  public riskExpired: boolean=false;
  public acceptedStatus: any;
  public minRiskDate: any;
  public defaultMaxDate: any;
  public showCascadeChange: boolean = false;
  // public toCascadeChanges: boolean = false;
  public riskTag: string = '';

  constructor(
    private router: Router,
    private common: ComponentsService
  ) { }

  ngOnInit() {
    this.riskDetails = this.risk?.data;
    console.log("riskDetails", this.riskDetails);
    if(this.riskDetails){
      this.checkAcceptence();
      this.initialiseEdit();
    }
  }
  ngOnChanges() {
    this.riskDetails = this.risk?.data;
    if(this.riskDetails){
      this.checkAcceptence();
      this.initialiseEdit();
    }
  }

  checkAcceptence(){
    let now = new Date();
    let expired = this.riskDetails.riskInitiationDate;
    if(now > expired){
      this.riskExpired = true;
    } else {
      this.riskExpired = false;
    }
    //let attendeePos = this.riskDetails.ownerInitiatorUidList.findIndex((u,i)=>u.uid==this.sessionInfo.uid);
    // if(attendeePos!=-1){
    //   this.acceptedStatus = this.riskDetails.attendeeList[attendeePos].accepted ?
    //                         this.riskDetails.attendeeList[attendeePos].accepted
    //                         :
    //                         'invited';
    // }
  }
  // edit mode methods
  initialiseEdit(){
    // min and max start date
    this.minRiskDate = moment().format('YYYY-MM-DD');
    this.defaultMaxDate = moment().add(5,'y').format('YYYY-MM-DD');
    this.riskDetails.riskInitiationDate = this.riskDetails.riskInitiationDate ? this.riskDetails.riskInitiationDate : null;
    this.riskDetails.targetCompletionDate = this.riskDetails.targetCompletionDate  ? this.riskDetails.targetCompletionDate   : null;
    //this.noOfOccurenceOption.splice(0,this.riskDetails.noOfOccurence &&this.noOfOccurenceOption.length == 30? this.riskDetails.noOfOccurence-1 : 0);
    // console.log("this.noOfOccurenceOption",this.noOfOccurenceOption);
  }
  // cascadechanges
  checkCascadeState(){
    this.showCascadeChange = true;
  }
  // date changing
  async dateChange(showAlert:boolean=true){
    console.log("risk details", this.riskDetails, this.riskDetails.riskInitiationDate, this.minRiskDate, this.defaultMaxDate);
    let title='';
    let body='';
    let startDateTime = new Date(this.riskDetails.riskInitiationDate);
    // let isValidStartDate = !this.meetingDetails.isOccurence ||
    //                        !this.refInformation.toCascadeChanges ||
    //                       (this.meetingDetails.occurenceType!='daily'
    //                         ||
    //                         (this.meetingDetails.occurenceType=='daily'
    //                          && this.meetingDetails.weekdays[parseInt(moment(startDateTime).format('e'))]
    //                          )
    //                       );
    if(
      (this.refInformation.riskInitiationDate == this.riskDetails.riskInitiationDate && this.refInformation.targetCompletionDate == this.riskDetails.targetCompletionDate ) ||
      (new Date() <= startDateTime)) {
      this.checkCascadeState();
      return true;
    } else {
     if(showAlert){
      //  if(!isValidStartDate){
      //      title = "Invalid Meeting Start Date";
      //      body = "Meeting start date should be on one of the weekdays selected for the meeting frequency. Please check and try again.";
      //      let buttons: any[] = [
      //                      {
      //                        text: 'Dismiss',
      //                        role: 'cancel',
      //                        cssClass: '',
      //                        handler: ()=>{}
      //                      }
      //                    ];
      //      await this.common.presentAlert(title,body, buttons);
      //   } else {
          title = "Invalid Risk Start Date";
          body = "Risk cannot be set in past. The risk start time should be future time.";
          let buttons: any[] = [
                          {
                            text: 'Dismiss',
                            role: 'cancel',
                            cssClass: '',
                            handler: ()=>{}
                          }
                        ];
          await this.common.presentAlert(title,body, buttons);
      // }
     }
    }
    return false;
  }

  addTag(){
    this.riskDetails.tags.push(this.riskTag);
    this.riskTag = '';
  }

  removeTag(index){
    this.riskDetails.tags.splice(index,1);
  }

  async onCascadeChanges(e){
    if(this.refInformation.toCascadeChanges && this.riskDetails.riskStatus=='RESOLVED'){
      let title = "Invalid Operation";
      let body = "It seems you are trying to propagate changes for the future risks while the risk status is RESOLVED. \
              This is not permitted, either cancel change propagation or change the risk status as OPEN and try again.";
      let buttons: any[] = [
                      {
                        text: 'Dismiss',
                        role: 'cancel',
                        cssClass: '',
                        handler: ()=>{}
                      }
                    ];
      await this.common.presentAlert(title,body, buttons);
      this.refInformation.toCascadeChanges = false;
      // this.toCascadeLinakges = false;
    } else{
      // this.toCascadeLinakges = false;
    }
  }

  async statusChanged(e)
  {
     let status = e.detail.value;
     let prevStatus = this.riskDetails.riskStatus;
     console.log("this.riskDetails.riskStatus", this.riskDetails.riskStatus, status);
      if(status=='RESOLVED' && (this.refInformation.toCascadeChanges)){ //|| this.toCascadeLinakges)
        let title = "Invalid Operation";
        let body = "It seems you are trying to mark the risk RESOLVED and propagate changes for the future risks. \
                    This is not permitted, either cancel change propagation or keep the risk status as OPEN and try again.";
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        }
                      ];
        await this.common.presentAlert(title,body, buttons);
        this.riskDetails.riskStatus = 'OPEN';
      } else {
        this.riskDetails.riskStatus=status;
      }
  }

}
