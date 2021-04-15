import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-issue-owner-initiator-edit',
  templateUrl: './issue-owner-initiator-edit.component.html',
  styleUrls: ['./issue-owner-initiator-edit.component.scss'],
})
export class IssueOwnerInitiatorEditComponent implements OnInit {

  @Input() sessionInfo: any;
  @Input() issue: any;
  // form data
  public issueDetails: any;
  public showSelectAttendees: boolean = false;
  public showSelectOwner: boolean = false;

  constructor() { }

  ngOnInit() {
    this.issueDetails = this.issue?.data;
  }

  ngOnChanges() {
    this.issueDetails = this.issue?.data;
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

  changeIssueOwner(owner){
    console.log("owner selected",owner);
    const {name, picUrl, email, uid, attendance, accepted } = owner;
    this.issueDetails.issueOwner = {name, picUrl, email, uid };
    this.generateOwnerListUid();
    this.showSelectOwner = false;
  }

  generateOwnerListUid(){
    let ownerInitiatorUidList = [];
    ownerInitiatorUidList.push(this.issueDetails.issueOwner.uid);
    ownerInitiatorUidList.push(this.issueDetails.issueInitiator.uid);
    this.issueDetails.ownerInitiatorUidList = ownerInitiatorUidList;
  }

}
