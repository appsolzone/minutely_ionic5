import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issue-basic-info',
  templateUrl: './issue-basic-info.component.html',
  styleUrls: ['./issue-basic-info.component.scss'],
})
export class IssueBasicInfoComponent implements OnInit {

  @Input() sessionInfo: any;
  @Input() issue: any;
  // form data
  public issueDetails: any;
  public issueExpired: boolean=false;
  public acceptedStatus: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.issueDetails = this.issue?.data;
    console.log("issuedetails", this.issueDetails);
    if(this.issueDetails){
      // TBA
    }
  }
  ngOnChanges() {
    this.issueDetails = this.issue?.data;
    if(this.issueDetails){
      // TBA
    }
  }

  onActionClick(val){
    // TBA
  }

}
