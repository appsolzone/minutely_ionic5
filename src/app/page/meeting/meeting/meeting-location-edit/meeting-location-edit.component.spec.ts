import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { newMeetingMockData } from "src/app/mock-data/meetings";

import { MeetingLocationEditComponent } from "./meeting-location-edit.component";

describe("MeetingLocationEditComponent", () => {
  let component: MeetingLocationEditComponent;
  let fixture: ComponentFixture<MeetingLocationEditComponent>;
  // mockdata
  let meetingDetails = newMeetingMockData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingLocationEditComponent],
      imports: [IonicModule.forRoot()],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MeetingLocationEditComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
        component.meeting = newMeetingMockData;
        component.meetingDetails = newMeetingMockData;
        component.meetingDetails.meetingPlace = { url: null, form: null };
      });
  }));

  // it("MEETING LOCATION EDIT SHOULD BE INIT", (done: DoneFn) => {
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     component.ngOnInit();
  //     expect(component).toBeTruthy();
  //     done();
  //   });
  // });

  describe("MEETING LOCATION TESTING [DURING CREATE]", () => {
    let meetLink = "https://meet.google.com/bzf-djqn-jdt";
    let zoomLink = "https://zoom.us/j/95998387707?";
    let skypeLink = "https://www.skype.com/en/";
    let otherLink = "https://discord.com/";
    //component.meetingDetails = newMeetingMockData;
    beforeEach(async () => {
      component.meetingDetails = newMeetingMockData;
      component.meetingDetails.meetingPlace = { url: null, from: null };
    });
    it(`#01. ${meetLink} link should be Goolge Meet Object`, (done: DoneFn) => {
      component.meetingUrl = meetLink;
      component.editMeetingPlace("add");
      expect(component.meetingDetails.meetingPlace.from).toBe("Google Meet");
      expect(component.meetingDetails.meetingPlace.url).toBe(meetLink);
      done();
    });
    it(`#02. ${zoomLink} link should be Zoom Meeting Object`, (done: DoneFn) => {
      component.meetingUrl = zoomLink;
      component.editMeetingPlace("add");
      expect(component.meetingDetails.meetingPlace.from).toBe("Zoom App");
      expect(component.meetingDetails.meetingPlace.url).toBe(zoomLink);
      done();
    });
    it(`#03. ${skypeLink} link should be Skype Meeting Object`, (done: DoneFn) => {
      component.meetingUrl = skypeLink;
      component.editMeetingPlace("add");
      expect(component.meetingDetails.meetingPlace.from).toBe("Skype");
      expect(component.meetingDetails.meetingPlace.url).toBe(skypeLink);
      done();
    });
    it(`#04. ${otherLink} link should be Others link Object`, (done: DoneFn) => {
      component.meetingUrl = otherLink;
      component.editMeetingPlace("add");
      expect(component.meetingDetails.meetingPlace.from).toBe("Others");
      expect(component.meetingDetails.meetingPlace.url).toBe(otherLink);
      done();
    });
    it(`#05. meetingPlace delete action is working`, (done: DoneFn) => {
      component.meetingDetails.meetingPlace.url = otherLink;
      component.meetingDetails.meetingPlace.from = "Others";
      component.editMeetingPlace("delete");
      expect(component.meetingDetails.meetingPlace.from).toBeNull();
      expect(component.meetingDetails.meetingPlace.url).toBeNull();
      done();
    });
  });
});
