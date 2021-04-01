import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-meeting-location',
  templateUrl: './meeting-location.component.html',
  styleUrls: ['./meeting-location.component.scss'],
})
export class MeetingLocationComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() meeting: any;
  // form data
  public meetingDetails: any;
  public showDialin: boolean = false;

  constructor() { }

  ngOnInit() {
    this.meetingDetails = this.meeting?.data;
  }

  ngOnChanges() {
    this.meetingDetails = this.meeting?.data;
     console.log("Onchange", this.meetingDetails);
  }

  dropDownCallList(){
    // $("#callList").slideToggle();
    this.showDialin=!this.showDialin;
  }

}
