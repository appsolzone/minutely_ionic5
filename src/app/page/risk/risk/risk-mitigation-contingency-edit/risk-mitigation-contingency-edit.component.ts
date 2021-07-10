import { Component, Input, OnInit } from '@angular/core';
import { SpeechService } from 'src/app/shared/speech/speech.service';

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

  constructor(
    private speech: SpeechService,
  ) { }

  ngOnInit() {
   this.riskDetails = this.risk?.data;
    console.log("riskdetails", this.riskDetails);
    // if(this.riskDetails){
    //   //this.checkAcceptence();
    // }
  }

  async startSpeech(type){
    let res = await this.speech.startListening('What would you like to add as ' + type);
    if(res?.text){
      this.riskDetails[type] += (' ' + res.text);
    }
  }
}
