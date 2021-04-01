import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-meeting-location-edit',
  templateUrl: './meeting-location-edit.component.html',
  styleUrls: ['./meeting-location-edit.component.scss'],
})
export class MeetingLocationEditComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() meeting: any;
  @Input() editMode: string = 'update';
  // form data
  public meetingDetails: any;
  public showDialin: boolean = false;
  public meetingUrl: string = null;

  constructor() { }

  ngOnInit() {
    this.meetingDetails = this.meeting?.data;
    this.showDialin =  !this.editMode || this.editMode=='update' ? false : true;
    if(!this.meetingDetails.meetingPlace){
      this.meetingDetails.meetingPlace = {url: null, from: null};
    } else {
      this.meetingUrl = this.meetingDetails.meetingPlace.url;
    }
  }

  ngOnChanges() {
    this.showDialin =  !this.editMode || this.editMode=='update' ? false : true;
    this.meetingDetails = this.meeting?.data;
     console.log("Onchange", this.meetingDetails);
     if(!this.meetingDetails.meetingPlace){
       this.meetingDetails.meetingPlace = {url: null, from: null};
     } else {
       this.meetingUrl = this.meetingDetails.meetingPlace.url;
     }
  }

  dropDownCallList(){
    // $("#callList").slideToggle();
    this.showDialin=!this.showDialin;
  }


  editMeetingPlace(action){

    switch(action){
      case 'add':
        let url = this.meetingUrl;
        this.meetingDetails.meetingPlace.url = this.meetingUrl;
        if(url.match(/meet\.google\.com/)){
          this.meetingDetails.meetingPlace.from = 'Google Meet';
        } else if(url.match(/zoom/)){
          this.meetingDetails.meetingPlace.from = 'Zoom App';
        } else if(url.match(/skype/)){
          this.meetingDetails.meetingPlace.from = 'Skype';
        } else {
          this.meetingDetails.meetingPlace.from = 'Others';
        }
        break;
      case 'delete':
        this.meetingDetails.meetingPlace = {url: null, from: null};
        break;
    }
  }


}
