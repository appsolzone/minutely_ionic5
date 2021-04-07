import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk-mitigation-contingency-edit',
  templateUrl: './risk-mitigation-contingency-edit.component.html',
  styleUrls: ['./risk-mitigation-contingency-edit.component.scss'],
})
export class RiskMitigationContingencyEditComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() risk: any;

  // form data
  public riskDetails: any;

  constructor() { }

  ngOnInit() {
   this.riskDetails = this.risk?.data;
    console.log("riskdetails", this.riskDetails);
    // if(this.riskDetails){
    //   //this.checkAcceptence();
    // }
  }
}
