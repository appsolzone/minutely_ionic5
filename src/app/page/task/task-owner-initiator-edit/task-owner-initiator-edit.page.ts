import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-owner-initiator-edit',
  templateUrl: './task-owner-initiator-edit.page.html',
  styleUrls: ['./task-owner-initiator-edit.page.scss'],
})
export class TaskOwnerInitiatorEditPage implements OnInit {
  @Input() sessionInfo: any;
  @Input() task: any;
  // form data
  public taskDetails: any;
  public showSelectAttendees: boolean = false;
  public showSelectOwner: boolean = false;

  constructor() { }

  ngOnInit() {
    this.taskDetails = this.task?.data;
  }

  ngOnChanges() {
    this.taskDetails = this.task?.data;
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }

  processAttendeeList(userList){
    let attendeeList = [];
    userList.forEach(u=>{
        const {name, picUrl, email, uid, attendance, accepted } = u;
        if(u.uid!=this.taskDetails.taskOwner.uid){
          attendeeList.push({name, picUrl, email, uid, attendance: attendance ? attendance : false, accepted:  accepted ? accepted : 'invited'});
        }
      });
    this.taskDetails.taskOwner = attendeeList[0];
    this.generateAttendeeListUid();
    this.showSelectAttendees = false;
  }

  changeTaskOwner(owner){
    console.log("owner selected",owner);
    const {name, picUrl, email, uid, attendance, accepted } = owner;
    this.taskDetails.taskOwner = {name, picUrl, email, uid };
    this.generateAttendeeListUid();
    this.showSelectOwner = false;
  }

  generateAttendeeListUid(){
    let ownerInitiatorUidList = [];
    ownerInitiatorUidList.push(this.taskDetails.taskOwner.uid);
    ownerInitiatorUidList.push(this.taskDetails.taskInitiator.uid);
    this.taskDetails.ownerInitiatorUidList = ownerInitiatorUidList;
  }

}
