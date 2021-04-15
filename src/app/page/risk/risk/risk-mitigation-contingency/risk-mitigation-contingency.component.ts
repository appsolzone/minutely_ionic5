import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk-mitigation-contingency',
  templateUrl: './risk-mitigation-contingency.component.html',
  styleUrls: ['./risk-mitigation-contingency.component.scss'],
})
export class RiskMitigationContingencyComponent implements OnInit,OnChanges {
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
  ngOnChanges(){
    this.riskDetails = this.risk?.data;
  }
}
