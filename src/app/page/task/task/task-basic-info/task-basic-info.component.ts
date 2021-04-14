import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';

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
  public taskExpired: boolean=false;
  public acceptedStatus: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.taskDetails = this.task?.data;
    console.log("taskdetails", this.taskDetails);
    if(this.taskDetails){
      // TBA
    }
  }
  ngOnChanges() {
    this.taskDetails = this.task?.data;
    if(this.taskDetails){
      // TBA
    }
  }

  onActionClick(val){
    // TBA
  }

}
