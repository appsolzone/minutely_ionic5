import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';

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
  public riskExpired: boolean=false;
  public acceptedStatus: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.riskDetails = this.risk?.data;
    console.log("riskdetails", this.riskDetails);
    if(this.riskDetails){
      // TBA
    }
  }
  ngOnChanges() {
    this.riskDetails = this.risk?.data;
    if(this.riskDetails){
      // TBA
    }
  }

  onActionClick(val){
    // TBA
  }

}
