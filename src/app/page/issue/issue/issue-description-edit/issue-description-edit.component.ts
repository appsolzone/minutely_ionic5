import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-issue-description-edit',
  templateUrl: './issue-description-edit.component.html',
  styleUrls: ['./issue-description-edit.component.scss'],
})
export class IssueDescriptionEditComponent implements OnInit {

  @Input() sessionInfo: any;
  @Input() issue: any;
  // form data
  public issueDetails: any;

  constructor() { }

  ngOnInit() {
    this.issueDetails = this.issue?.data;
  }

  ngOnChanges() {
    this.issueDetails = this.issue?.data;
  }

}
