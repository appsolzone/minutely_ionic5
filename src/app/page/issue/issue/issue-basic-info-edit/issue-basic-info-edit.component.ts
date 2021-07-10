import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { SpeechService } from 'src/app/shared/speech/speech.service';

@Component({
  selector: 'app-issue-basic-info-edit',
  templateUrl: './issue-basic-info-edit.component.html',
  styleUrls: ['./issue-basic-info-edit.component.scss'],
})
export class IssueBasicInfoEditComponent implements OnInit {

  @Input() sessionInfo: any;
  @Input() issue: any;
  @Input() refInformation: any;
  @Input() editMode: string = 'update';
  // form data
  public noOfOccurenceOption: any = Array.from(Array(30)).map((a,i)=>i+1);
  public issueDetails: any;
  public issueExpired: boolean=false;
  public acceptedStatus: any;
  public maxIssueInitiationDate: any;
  public defaultMaxDate: any;
  public showCascadeChange: boolean = false;
  // public toCascadeChanges: boolean = false;
  public issueTag: string = '';

  constructor(
    private router: Router,
    private common: ComponentsService,
    private speech: SpeechService,
  ) { }

  ngOnInit() {
    this.issueDetails = this.issue?.data;
    console.log("issuedetails", this.issueDetails);
    if(this.issueDetails){
      this.initialiseEdit();
    }
  }
  ngOnChanges() {
    this.issueDetails = this.issue?.data;
    if(this.issueDetails){
      this.initialiseEdit();
    }
  }

  // edit mode methods
  initialiseEdit(){
    // min and max start date
    // this.minTaskDate = new Date(this.taskDetails.taskInitiationDate) > new Date() ? this.taskDetails.taskInitiationDate : moment().format('YYYY-MM-DD');
    this.maxIssueInitiationDate = moment().format('YYYY-MM-DD');
    this.defaultMaxDate = moment().add(5,'y').format('YYYY-MM-DD');
    this.issueDetails.issueInitiationDate = this.issueDetails.issueInitiationDate ? this.issueDetails.issueInitiationDate : null;
    this.issueDetails.targetCompletionDate = this.issueDetails.targetCompletionDate ? this.issueDetails.targetCompletionDate  : null;
  }

  // date changing
  async dateChange(showAlert:boolean=true){
    console.log("issue details", this.issueDetails, this.issueDetails.issueInitiationDate, this.maxIssueInitiationDate, this.defaultMaxDate);
    let title='';
    let body='';
    let startDateTime = new Date(this.issueDetails.issueInitiationDate);

    if(
      (this.refInformation.issueInitiationDate == this.issueDetails.issueInitiationDate && this.refInformation.targetCompletionDate == this.issueDetails.targetCompletionDate) ||
      // (new Date() <= startDateTime)
      (new Date(moment(this.issueDetails.issueInitiationDate).format('YYYY-MM-DD')) <= new Date(moment(this.issueDetails.targetCompletionDate).format('YYYY-MM-DD')))
    ) {
      return true;
    } else {
     if(showAlert){

          title = "Invalid Issue Initiation Date";
          body = "Issue target completion date can not be earlier than the issue initiation date.";
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
    if(this.issueTag.trim()){
      this.issueDetails.tags.push(this.issueTag);
      this.issueTag = '';
    }
  }

  removeTag(index){
    this.issueDetails.tags.splice(index,1);
  }

  async statusChanged(e)
  {
     let status = e.detail.value;
     let prevStatus = this.issueDetails.issueStatus;
     console.log("this.issueDetails.issueStatus", this.issueDetails.issueStatus, status);
      if(status=='RESOLVED'){ //|| this.toCascadeLinakges)
        this.issueDetails.targetCompletionDate = this.refInformation.targetCompletionDate;
      } else {
        this.issueDetails.issueStatus=status;
      }
  }

  async startSpeech(type){
    let res = await this.speech.startListening('What would you like to add as ' + type);
    if(res?.text){
      this.issueDetails[type] += (' ' + res.text);
    }
  }

}
