import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk-basic-info',
  templateUrl: './risk-basic-info.component.html',
  styleUrls: ['./risk-basic-info.component.scss'],
})
export class RiskBasicInfoComponent implements OnInit {
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
