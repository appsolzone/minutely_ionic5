import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-owner-initiator',
  templateUrl: './task-owner-initiator.component.html',
  styleUrls: ['./task-owner-initiator.component.scss'],
})
export class TaskOwnerInitiatorComponent implements OnInit {
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

  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }
}
