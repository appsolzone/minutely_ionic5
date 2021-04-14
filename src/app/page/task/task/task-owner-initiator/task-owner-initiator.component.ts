import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-owner-initiator',
  templateUrl: './task-owner-initiator.component.html',
  styleUrls: ['./task-owner-initiator.component.scss'],
})
export class TaskOwnerInitiatorComponent implements OnInit,OnChanges {
  @Input() sessionInfo: any;
  @Input() task: any;

  // form data
  public taskDetails: any;

  constructor() { }

  ngOnInit() {
   this.taskDetails = this.task?.data;
    console.log("taskdetails", this.taskDetails);
    // if(this.riskDetails){
    //   //this.checkAcceptence();
    // }
  }
  ngOnChanges(){
   this.taskDetails = this.task?.data;  
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }
}
