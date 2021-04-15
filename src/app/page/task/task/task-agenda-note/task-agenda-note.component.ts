import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-agenda-note',
  templateUrl: './task-agenda-note.component.html',
  styleUrls: ['./task-agenda-note.component.scss'],
})
export class TaskAgendaNoteComponent implements OnInit,OnChanges {
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
  ngOnChanges(){
   this.taskDetails = this.task?.data;  
  }

}
