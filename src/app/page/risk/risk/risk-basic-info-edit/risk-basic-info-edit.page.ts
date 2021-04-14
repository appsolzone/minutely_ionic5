import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
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
  public noOfOccurenceOption: any = Array.from(Array(30)).map((a,i)=>i+1);
  public riskDetails: any;
  public riskExpired: boolean=false;
  public acceptedStatus: any;
  public maxRiskInitiationDate: any;
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
    console.log("riskdetails", this.riskDetails);
    if(this.riskDetails){
      this.initialiseEdit();
    }
  }
  ngOnChanges() {
    this.riskDetails = this.risk?.data;
    if(this.riskDetails){
      this.initialiseEdit();
    }
  }

  // edit mode methods
  initialiseEdit(){
    // min and max start date
    // this.minRiskDate = new Date(this.riskDetails.riskInitiationDate) > new Date() ? this.riskDetails.riskInitiationDate : moment().format('YYYY-MM-DD');
    this.maxRiskInitiationDate = moment().format('YYYY-MM-DD');
    this.defaultMaxDate = moment().add(5,'y').format('YYYY-MM-DD');
    this.riskDetails.riskInitiationDate = this.riskDetails.riskInitiationDate ? this.riskDetails.riskInitiationDate : null;
    this.riskDetails.targetCompletionDate = this.riskDetails.targetCompletionDate ? this.riskDetails.targetCompletionDate  : null;
  }

  // date changing
  async dateChange(showAlert:boolean=true){
    console.log("risk details", this.riskDetails, this.riskDetails.riskInitiationDate, this.maxRiskInitiationDate, this.defaultMaxDate);
    let title='';
    let body='';
    let startDateTime = new Date(this.riskDetails.riskInitiationDate);

    if(
      (this.refInformation.riskInitiationDate == this.riskDetails.riskInitiationDate && this.refInformation.targetCompletionDate == this.riskDetails.targetCompletionDate) ||
      // (new Date() <= startDateTime)
      (new Date(this.riskDetails.riskInitiationDate) <= new Date(this.riskDetails.targetCompletionDate))
    ) {
      return true;
    } else {
     if(showAlert){

          title = "Invalid Risk Initiation Date";
          body = "Risk target completion date can not be earlier than the risk initiation date.";
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
      if(status=='RESOLVED'){ //|| this.toCascadeLinakges)
        this.riskDetails.targetCompletionDate = this.refInformation.targetCompletionDate;
      } else {
        this.riskDetails.riskStatus=status;
      }
  }

}
