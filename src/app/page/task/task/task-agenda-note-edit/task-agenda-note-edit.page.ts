import { Component, Input, OnInit } from '@angular/core';
import { SpeechService } from 'src/app/shared/speech/speech.service';

@Component({
  selector: 'app-task-agenda-note-edit',
  templateUrl: './task-agenda-note-edit.page.html',
  styleUrls: ['./task-agenda-note-edit.page.scss'],
})
export class TaskAgendaNoteEditPage implements OnInit {
  @Input() sessionInfo: any;
  @Input() task: any;
  @Input() editMode:any = 'update';

  // form data
  public taskDetails: any;

  constructor(
    private speech: SpeechService,
  ) { }

  ngOnInit() {
   this.taskDetails = this.task?.data;
    console.log("taskdetails", this.taskDetails);
    // if(this.taskDetails){
    //   //this.checkAcceptence();
    // }
  }

  async startSpeech(type){
    let res = await this.speech.startListening('What would you like to add as ' + type, this.sessionInfo);
    if(res?.text){
      this.taskDetails[type] += (' ' + res.text);
    }
  }
}
