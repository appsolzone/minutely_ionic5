import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk-owner-initiator-edit',
  templateUrl: './risk-owner-initiator-edit.page.html',
  styleUrls: ['./risk-owner-initiator-edit.page.scss'],
})
export class RiskOwnerInitiatorEditPage implements OnInit {
  @Input() sessionInfo: any;
  @Input() risk: any;
  // form data
  public riskDetails: any;
  public showSelectAttendees: boolean = false;
  public showSelectOwner: boolean = false;

  constructor() { }

  ngOnInit() {
    this.riskDetails = this.risk?.data;
  }

  ngOnChanges() {
    this.riskDetails = this.risk?.data;
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

  processAttendeeList(userList){
    let attendeeList = [];
    userList.forEach(u=>{
        const {name, picUrl, email, uid, attendance, accepted } = u;
        if(u.uid!=this.riskDetails.riskOwner.uid){
          attendeeList.push({name, picUrl, email, uid, attendance: attendance ? attendance : false, accepted:  accepted ? accepted : 'invited'});
        }
      });
    this.riskDetails.riskOwner = attendeeList[0];
    this.generateAttendeeListUid();
    this.showSelectAttendees = false;
  }

  changeRiskOwner(owner){
    console.log("owner selected",owner);
    const {name, picUrl, email, uid, attendance, accepted } = owner;
    this.riskDetails.riskOwner = {name, picUrl, email, uid };
    this.generateAttendeeListUid();
    this.showSelectOwner = false;
  }

  generateAttendeeListUid(){
    let ownerInitiatorUidList = [];
    ownerInitiatorUidList.push(this.riskDetails.riskOwner.uid);
    ownerInitiatorUidList.push(this.riskDetails.riskInitiator.uid);
    this.riskDetails.ownerInitiatorUidList = ownerInitiatorUidList;
  }

}
