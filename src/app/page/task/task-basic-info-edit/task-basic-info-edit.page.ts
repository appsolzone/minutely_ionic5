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
  }
  // edit mode methods
  initialiseEdit(){
    // min and max start date
    this.minTaskDate = new Date(this.taskDetails.taskInitiationDate) > new Date() ? this.taskDetails.taskInitiationDate : moment().format('YYYY-MM-DD');
    this.defaultMaxDate = moment().add(5,'y').format('YYYY-MM-DD');
    this.taskDetails.taskInitiationDate = this.taskDetails.taskInitiationDate ? this.taskDetails.taskInitiationDate : moment().format('YYYY-MM-DD');
    this.taskDetails.targetCompletionDate = this.taskDetails.targetCompletionDate  ? this.taskDetails.targetCompletionDate : moment().add(1, 'd').format('YYYY-MM-DD');
    if(this.editMode !== 'update') this.taskDetails.actualCompletionDate = this.taskDetails.targetCompletionDate;
    // console.log("initial date    :",  this.taskDetails.taskInitiationDate);
    // console.log("complition date :",  this.taskDetails.targetCompletionDate);
    // console.log("actual complete :",  this.taskDetails.actualCompletionDate);
  }
  // cascadechanges
  checkCascadeState(){
    this.showCascadeChange = true;
  }
  // date changing
  async dateChange(showAlert:boolean=true){
    console.log("task details", this.taskDetails, this.taskDetails.taskInitiationDate, this.minTaskDate, this.defaultMaxDate);
    if(this.editMode !== 'update') this.taskDetails.actualCompletionDate = this.taskDetails.targetCompletionDate;
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
      if(prevStatus !== status && status=='RESOLVED'){ 
        let title = "Are you sure ?";
        let body = "It seems you are trying to mark the task RESOLVED and propagate changes for the future tasks.";            
        let buttons: any[] = [
                       {
                          text: 'Ok',
                          role: 'ok',
                          cssClass: '',
                          handler: ()=>{
                            this.taskDetails.taskStatus=status;
                            this.taskDetails.status = status;
                            this.taskDetails.actualCompletionDate = moment().format('YYYY-MM-DD');
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
        this.taskDetails.status = status;
        this.taskDetails.actualCompletionDate = 
              this.taskDetails.data.actualCompletionDate ?
              this.taskDetails.data.actualCompletionDate
              :
              this.taskDetails.data.targetCompletionDate
            
      }
  }
}
