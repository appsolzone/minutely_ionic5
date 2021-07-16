import { Component, OnInit, Input } from "@angular/core";
import { SpeechService } from "src/app/shared/speech/speech.service";
import { MeetingGuideService } from "src/app/shared/tourGuide/meetingPage/meeting-guide.service";

@Component({
  selector: "app-meeting-agenda-note-edit",
  templateUrl: "./meeting-agenda-note-edit.component.html",
  styleUrls: ["./meeting-agenda-note-edit.component.scss"],
})
export class MeetingAgendaNoteEditComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() meeting: any;
  // form data
  public meetingDetails: any;

  constructor(
    private speech: SpeechService,
    private meetingGuide: MeetingGuideService
  ) {}

  ngOnInit() {
    this.meetingDetails = this.meeting?.data;
  }

  ngOnChanges() {
    this.meetingDetails = this.meeting?.data;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.meetingGuide.meetingAgendaNotesSpeechGuide();
    }, 100);
  }

  async startSpeech(type) {
    let res = await this.speech.startListening(
      "What would you like to add as " + type
    );
    if (res?.text) {
      this.meetingDetails[type] += " " + res.text;
    }
  }
}
