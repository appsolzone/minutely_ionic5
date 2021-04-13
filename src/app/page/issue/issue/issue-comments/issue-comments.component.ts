import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-issue-comments',
  templateUrl: './issue-comments.component.html',
  styleUrls: ['./issue-comments.component.scss'],
})
export class IssueCommentsComponent implements OnInit {

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

  goToCommentPage(issue){
    // TBA
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }

}
