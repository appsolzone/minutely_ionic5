import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk-owner-initiator',
  templateUrl: './risk-owner-initiator.component.html',
  styleUrls: ['./risk-owner-initiator.component.scss'],
})
export class RiskOwnerInitiatorComponent implements OnInit,OnChanges {
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

  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }
}
