import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from "@ionic/angular";
import * as moment from "moment";
import {
  meetingDetailsMockData,
  newMeetingMockData,
} from "src/app/mock-data/meetings";

import { MeetingBasicInfoComponent } from "./meeting-basic-info.component";

describe("MeetingBasicInfoComponent", () => {
  let component: MeetingBasicInfoComponent;
  let fixture: ComponentFixture<MeetingBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingBasicInfoComponent],
      imports: [IonicModule.forRoot(), RouterTestingModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MeetingBasicInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it("MEETING BASIC INFO COMPONENT SHOULD BE CREATED", () => {
    expect(component).toBeTruthy();
  });

  describe("MEETING ATTENDEE ACCEPT STATUS AND MEETING EXPIRED", () => {
    let currDate = moment().format("YYYY-MM-DD");
    let defaultMaxDate = moment().add(5, "y").format("YYYY-MM-DD");
    let dayBeforeToday = moment().subtract(5, "d").format("YYYY-MM-DD");
    let dayAfterToday = moment().add(5, "d").format("YYYY-MM-DD");
    beforeEach(() => {
      component.meetingDetails = newMeetingMockData;
      component.sessionInfo = {};
      component.sessionInfo.uid = "abcd1235";
    });
    it(`#01 : Meeting date ${dayBeforeToday} should be expired < ${currDate}`, (done: DoneFn) => {
      component.meetingDetails.meetingStart = new Date(dayBeforeToday);
      component.checkAcceptence();
      expect(component.meetingExpired).toBe(true);
      done();
    });
    it(`#02 : Meeting date ${dayAfterToday} should not be expired > ${currDate}`, (done: DoneFn) => {
      component.meetingDetails.meetingStart = new Date(dayAfterToday);

      component.checkAcceptence();
      expect(component.meetingExpired).toBe(false);
      done();
    });
    it(`#03 : Ateendee meeting accepted status invited if value=null`, (done: DoneFn) => {
      component.meetingDetails = meetingDetailsMockData;
      component.meetingDetails.meetingStart = dayAfterToday;
      component.sessionInfo.ui = "abcd1235";

      component.checkAcceptence();
      expect(component.acceptedStatus).toBe("invited");
      done();
    });
    it(`#04 : Ateendee meeting accepted status Accept if value=accept`, (done: DoneFn) => {
      component.sessionInfo.uid = "abcd1236";
      component.meetingDetails = meetingDetailsMockData;
      component.meetingDetails.meetingStart = dayAfterToday;
      component.sessionInfo.ui = "abcd1236";

      component.checkAcceptence();
      expect(component.acceptedStatus).toBe("accept");
      done();
    });
    it(`#05 : Ateendee meeting accepted status Decline if value=decline`, (done: DoneFn) => {
      component.sessionInfo.uid = "abcd1238";
      component.meetingDetails = meetingDetailsMockData;
      component.meetingDetails.meetingStart = dayAfterToday;
      component.sessionInfo.ui = "abcd1238";

      component.checkAcceptence();
      expect(component.acceptedStatus).toBe("decline");
      done();
    });
  });
});
