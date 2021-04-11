import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-agenda-note-edit',
  templateUrl: './task-agenda-note-edit.page.html',
  styleUrls: ['./task-agenda-note-edit.page.scss'],
})
export class TaskAgendaNoteEditPage implements OnInit {
  @Input() sessionInfo: any;
  @Input() task: any;
  @Input() editMode:any = 'update';

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
