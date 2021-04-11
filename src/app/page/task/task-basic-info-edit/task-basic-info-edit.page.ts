import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-task-basic-info-edit',
  templateUrl: './task-basic-info-edit.page.html',
  styleUrls: ['./task-basic-info-edit.page.scss'],
})
export class TaskBasicInfoEditPage implements OnInit {
  @Input() sessionInfo: any;
  @Input() task: any;
  @Input() refInformation: any;
  @Input() editMode: string = 'update';
  // form data
  // public noOfOccurenceOption: any = Array.from(Array(30)).map((a,i)=>i+1);
  public taskDetails: any;
  public taskExpired: boolean=false;
  public acceptedStatus: any;
  public minTaskDate: any;
  public defaultMaxDate: any;
  public showCascadeChange: boolean = false;
  // public toCascadeChanges: boolean = false;
  public taskTag: string = '';

  constructor(
    private router: Router,
    private common: ComponentsService
  ) { }

  ngOnInit() {
    this.taskDetails = this.task?.data;
    console.log("taskDetails", this.taskDetails);
    if(this.taskDetails){
      this.checkAcceptence();
      this.initialiseEdit();
    }
  }
  ngOnChanges() {
    this.taskDetails = this.task?.data;
    if(this.taskDetails){
      this.checkAcceptence();
      this.initialiseEdit();
    }
  }

  checkAcceptence(){
    let now = new Date();
    let expired = this.taskDetails.taskInitiationDate;
    if(now > expired){
      this.taskExpired = true;
    } else {
      this.taskExpired = false;
    }
    //let attendeePos = this.taskDetails.ownerInitiatorUidList.findIndex((u,i)=>u.uid==this.sessionInfo.uid);
    // if(attendeePos!=-1){
    //   this.acceptedStatus = this.taskDetails.attendeeList[attendeePos].accepted ?
    //                         this.taskDetails.attendeeList[attendeePos].accepted
    //                         :
    //                         'invited';
    // }
  }
  // edit mode methods
  initialiseEdit(){
    // min and max start date
    this.minTaskDate = new Date(this.taskDetails.taskInitiationDate) > new Date() ? this.taskDetails.taskInitiationDate : moment().format('YYYY-MM-DD');
    this.defaultMaxDate = moment().add(5,'y').format('YYYY-MM-DD');
    this.taskDetails.taskInitiationDate = this.taskDetails.taskInitiationDate ? this.taskDetails.taskInitiationDate : moment().format('YYYY-MM-DD');
    this.taskDetails.targetCompletionDate = this.taskDetails.targetCompletionDate  ? this.taskDetails.targetCompletionDate : moment().add(1, 'd').format('YYYY-MM-DD');

  }
  // cascadechanges
  checkCascadeState(){
    this.showCascadeChange = true;
  }
  // date changing
  async dateChange(showAlert:boolean=true){
    console.log("task details", this.taskDetails, this.taskDetails.taskInitiationDate, this.minTaskDate, this.defaultMaxDate);
    let title='';
    let body='';
    let startDateTime = new Date(this.taskDetails.taskInitiationDate);

    if(
      (this.refInformation.taskInitiationDate == this.taskDetails.taskInitiationDate && this.refInformation.targetCompletionDate == this.taskDetails.targetCompletionDate ) ||
      (new Date() <= startDateTime)) {
      this.checkCascadeState();
      return true;
    } else {
      
    
      if(showAlert){
          title = "Invalid task Start Date";
          body = "task cannot be set in past. The task start time should be future time.";
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
    this.taskDetails.tags.push(this.taskTag);
    this.taskTag = '';
  }

  removeTag(index){
    this.taskDetails.tags.splice(index,1);
  }

  // async onCascadeChanges(e){
  //   if(this.refInformation.toCascadeChanges && this.taskDetails.taskStatus=='RESOLVED'){
  //     let title = "Invalid Operation";
  //     let body = "It seems you are trying to propagate changes for the future tasks while the task status is RESOLVED. \
  //             This is not permitted, either cancel change propagation or change the task status as OPEN and try again.";
  //     let buttons: any[] = [
  //                     {
  //                       text: 'Dismiss',
  //                       role: 'cancel',
  //                       cssClass: '',
  //                       handler: ()=>{}
  //                     }
  //                   ];
  //     await this.common.presentAlert(title,body, buttons);
  //     this.refInformation.toCascadeChanges = false;
  //     // this.toCascadeLinakges = false;
  //   } else{
  //     // this.toCascadeLinakges = false;
  //   }
  // }

  async statusChanged(e)
  {
     let status = e.detail.value;
     let prevStatus = this.taskDetails.taskStatus;
     console.log("this.taskDetails.taskStatus", this.taskDetails.taskStatus, status);
      if(status=='RESOLVED'){ //|| this.toCascadeLinakges)
        // let title = "Invalid Operation";
        // let body = "It seems you are trying to mark the task RESOLVED and propagate changes for the future tasks. \
        //             This is not permitted, either cancel change propagation or keep the task status as OPEN and try again.";
        let title = "Are you sure ?";
        let body = "It seems you are trying to mark the task RESOLVED and propagate changes for the future tasks.";            
        let buttons: any[] = [
                       {
                          text: 'Ok',
                          role: 'ok',
                          cssClass: '',
                          handler: ()=>{
                            this.taskDetails.taskStatus=status;
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
       // this.taskDetails.taskStatus = 'OPEN';
      } else {
        this.taskDetails.taskStatus=status;
      }
  }

}
