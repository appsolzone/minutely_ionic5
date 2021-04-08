import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk-comments',
  templateUrl: './risk-comments.component.html',
  styleUrls: ['./risk-comments.component.scss'],
})
export class RiskCommentsComponent implements OnInit {
 @Input() sessionInfo: any;
 @Input() risk: any;

  // form data
  public riskDetails: any;

  constructor() { }

  ngOnInit() {
   this.riskDetails = this.risk?.data;
    console.log("riskDetails", this.riskDetails);
    // if(this.riskDetails){
    //   //this.checkAcceptence();
    // }
  }
  goToCommentPage(risk){
    // TBA
  }

}
