import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk-probability-impact-edit',
  templateUrl: './risk-probability-impact-edit.page.html',
  styleUrls: ['./risk-probability-impact-edit.page.scss'],
})
export class RiskProbabilityImpactEditPage implements OnInit {
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
