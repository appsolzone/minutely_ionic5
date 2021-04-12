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
    this.riskDetails.riskInitiationDate = this.riskDetails.riskInitiationDate ? this.riskDetails.riskInitiationDate : moment().format('YYYY-MM-DD');
    this.riskDetails.targetCompletionDate = this.riskDetails.targetCompletionDate  ? this.riskDetails.targetCompletionDate : moment().add(1, 'd').format('YYYY-MM-DD');
    if(this.editMode !== 'update') this.riskDetails.actualCompletionDate = this.riskDetails.targetCompletionDate;
  }
  // cascadechanges
  checkCascadeState(){
    this.showCascadeChange = true;
  }
  // date changing
  async dateChange(showAlert:boolean=true){
    console.log("risk details", this.riskDetails, this.riskDetails.riskInitiationDate, this.minRiskDate, this.defaultMaxDate);
    if(this.editMode !== 'update') this.riskDetails.actualCompletionDate = this.riskDetails.targetCompletionDate;
    return false;
  }

  addTag(){
    this.riskDetails.tags.push(this.riskTag);
    this.riskTag = '';
  }

  removeTag(index){
    this.riskDetails.tags.splice(index,1);
  }

  async statusChanged(e)
  {
     let status = e.detail.value;
     let prevStatus = this.riskDetails.riskStatus;
     console.log("this.riskDetails.riskStatus", this.riskDetails.riskStatus, status);
      if((prevStatus !== status && status=='RESOLVED')){ 
        let title = "Are you sure ?";
        let body = "It seems you are trying to mark the risk RESOLVED and propagate changes for the future risk.";  
        let buttons: any[] = [
                       {
                          text: 'Ok',
                          role: 'ok',
                          cssClass: '',
                          handler: ()=>{
                            this.riskDetails.taskStatus=status;
                            this.riskDetails.status = status;
                            this.riskDetails.actualCompletionDate = moment().format('YYYY-MM-DD');
                          }
                        },
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
        this.riskDetails.status = status;
        
        this.riskDetails.actualCompletionDate = 
              this.riskDetails.data.actualCompletionDate ?
              this.riskDetails.data.actualCompletionDate
              :
              this.riskDetails.data.targetCompletionDate
      }
  }
}