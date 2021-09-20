import { Component, OnInit, Input } from '@angular/core';
import { SpeechService } from 'src/app/shared/speech/speech.service';

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

  constructor(
    private speech: SpeechService,
  ) { }

  ngOnInit() {
    this.issueDetails = this.issue?.data;
  }

  ngOnChanges() {
    this.issueDetails = this.issue?.data;
  }

  async startSpeech(type){
    let res = await this.speech.startListening('What would you like to add as ' + type, this.sessionInfo);
    if(res?.text){
      this.issueDetails[type] += (' ' + res.text);
    }
  }

}
