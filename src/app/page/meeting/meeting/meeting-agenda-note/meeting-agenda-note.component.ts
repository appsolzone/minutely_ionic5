import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-meeting-agenda-note',
  templateUrl: './meeting-agenda-note.component.html',
  styleUrls: ['./meeting-agenda-note.component.scss'],
})
export class MeetingAgendaNoteComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() meeting: any;
  // form data
  public meetingDetails: any;

  constructor() { }

  ngOnInit() {
    this.meetingDetails = this.meeting?.data;
  }

  ngOnChanges() {
    this.meetingDetails = this.meeting?.data;
  }

}
