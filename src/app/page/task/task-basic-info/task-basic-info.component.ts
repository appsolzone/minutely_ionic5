import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-basic-info',
  templateUrl: './task-basic-info.component.html',
  styleUrls: ['./task-basic-info.component.scss'],
})
export class TaskBasicInfoComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() task: any;

  // form data
  public taskDetails: any;

  constructor() { }

  ngOnInit() {
   this.taskDetails = this.task?.data;
    console.log("taskdetails", this.taskDetails);
    // if(this.taskDetails){
    //   //this.checkAcceptence();
    // }
  }

}
