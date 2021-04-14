import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-issue-description',
  templateUrl: './issue-description.component.html',
  styleUrls: ['./issue-description.component.scss'],
})
export class IssueDescriptionComponent implements OnInit,OnChanges {

  @Input() sessionInfo: any;
  @Input() issue: any;

  // form data
  public issueDetails: any;

  constructor() { }

  ngOnInit() {
   this.issueDetails = this.issue?.data;
    console.log("issuedetails", this.issueDetails);
    // if(this.issueDetails){
    //   //this.checkAcceptence();
    // }
  }
  ngOnChanges(){
   this.issueDetails = this.issue?.data;
  }


}
