import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-meeting-agenda-note-edit',
  templateUrl: './meeting-agenda-note-edit.component.html',
  styleUrls: ['./meeting-agenda-note-edit.component.scss'],
})
export class MeetingAgendaNoteEditComponent implements OnInit {
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
