import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk-probability-impact',
  templateUrl: './risk-probability-impact.component.html',
  styleUrls: ['./risk-probability-impact.component.scss'],
})
export class RiskProbabilityImpactComponent implements OnInit,OnChanges {
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
