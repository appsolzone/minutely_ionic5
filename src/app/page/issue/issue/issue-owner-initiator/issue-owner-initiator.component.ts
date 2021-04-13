import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-issue-owner-initiator',
  templateUrl: './issue-owner-initiator.component.html',
  styleUrls: ['./issue-owner-initiator.component.scss'],
})
export class IssueOwnerInitiatorComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() issue: any;

  // form data
  public issueDetails: any;

  constructor() { }

  ngOnInit() {
   this.issueDetails = this.issue?.data;
    console.log("issuedetails", this.issueDetails);
    // if(this.riskDetails){
    //   //this.checkAcceptence();
    // }
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }

}
