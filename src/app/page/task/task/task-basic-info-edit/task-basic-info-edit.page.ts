import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
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
  public noOfOccurenceOption: any = Array.from(Array(30)).map((a,i)=>i+1);
  public taskDetails: any;
  public taskExpired: boolean=false;
  public acceptedStatus: any;
  public maxTaskInitiationDate: any;
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
    console.log("taskdetails", this.taskDetails);
    if(this.taskDetails){
      this.initialiseEdit();
    }
  }
  ngOnChanges() {
    this.taskDetails = this.task?.data;
    if(this.taskDetails){
      this.initialiseEdit();
    }
  }

  // edit mode methods
  initialiseEdit(){
    // min and max start date
    // this.minTaskDate = new Date(this.taskDetails.taskInitiationDate) > new Date() ? this.taskDetails.taskInitiationDate : moment().format('YYYY-MM-DD');
    this.maxTaskInitiationDate = moment().format('YYYY-MM-DD');
    this.defaultMaxDate = moment().add(5,'y').format('YYYY-MM-DD');
    this.taskDetails.taskInitiationDate = this.taskDetails.taskInitiationDate ? this.taskDetails.taskInitiationDate : null;
    this.taskDetails.targetCompletionDate = this.taskDetails.targetCompletionDate ? this.taskDetails.targetCompletionDate  : null;
  }

  // date changing
  async dateChange(showAlert:boolean=true){
    console.log("task details", this.taskDetails, this.taskDetails.taskInitiationDate, this.maxTaskInitiationDate, this.defaultMaxDate);
    let title='';
    let body='';
    let startDateTime = new Date(this.taskDetails.taskInitiationDate);

    if(
      (this.refInformation.taskInitiationDate == this.taskDetails.taskInitiationDate && this.refInformation.targetCompletionDate == this.taskDetails.targetCompletionDate) ||
      // (new Date() <= startDateTime)
      (new Date(this.taskDetails.taskInitiationDate) <= new Date(this.taskDetails.targetCompletionDate))
    ) {
      return true;
    } else {
     if(showAlert){

          title = "Invalid Task Initiation Date";
          body = "Task target completion date can not be earlier than the task initiation date.";
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

  async statusChanged(e)
  {
     let status = e.detail.value;
     let prevStatus = this.taskDetails.taskStatus;
     console.log("this.taskDetails.taskStatus", this.taskDetails.taskStatus, status);
      if(status=='RESOLVED'){ //|| this.toCascadeLinakges)
        this.taskDetails.targetCompletionDate = this.refInformation.targetCompletionDate;
      } else {
        this.taskDetails.taskStatus=status;
      }
  }

}
