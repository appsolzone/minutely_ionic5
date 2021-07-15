import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { meetingDetailsMockData } from "src/app/mock-data/meetings";

import { MeetingAttendeesComponent } from "./meeting-attendees.component";

describe("MeetingAttendeesComponent", () => {
  let component: MeetingAttendeesComponent;
  let fixture: ComponentFixture<MeetingAttendeesComponent>;
  let meetingDetails = meetingDetailsMockData;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingAttendeesComponent],
      imports: [IonicModule.forRoot()],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MeetingAttendeesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.meetingDetails = meetingDetailsMockData;
      });
  }));

  it("MEETING ATTENDEE COMPONENT TESTING", () => {
    expect(component).toBeTruthy();
  });

  // attendance
  describe("Attendance status check", () => {
    beforeEach(() => {});
    it("#01. attendee attendencee status 'NULL' color should be 'medium'", async (done: DoneFn) => {
      component.meetingDetails.attendeeList = [meetingDetails.attendeeList[0]];
      fixture.detectChanges();
      let presnt = fixture.debugElement.nativeElement.querySelector(
        ".meetingAttendencePresentAbsent"
      );
      fixture.whenStable().then(() => {
        expect(presnt.color).toBe("medium");
        done();
      });
    });
    // it("#02. attendee attendencee status 'Present' color should be 'success'", async (done: DoneFn) => {
    //   component.meetingDetails.attendeeList = [meetingDetails.attendeeList[2]];
    //   fixture.detectChanges();
    //   let presnt = fixture.debugElement.nativeElement.querySelector(
    //     ".meetingAttendencePresentAbsent"
    //   );
    //   fixture.whenStable().then(() => {
    //     expect(presnt.color).toBe("success");
    //     done();
    //   });
    // });
    // it("#03. attendee attendencee status 'Absent' color should be 'danger'", async (done: DoneFn) => {
    //   component.meetingDetails.attendeeList = [meetingDetails.attendeeList[1]];
    //   fixture.detectChanges();
    //   let presnt = fixture.debugElement.nativeElement.querySelector(
    //     ".meetingAttendencePresentAbsent"
    //   );
    //   fixture.whenStable().then(() => {
    //     expect(presnt.color).toBe("danger");
    //     done();
    //   });
    // });
  });
  // attendance
  describe("Attendance meeting invitation status check", () => {
    beforeEach(() => {});
    it("#01. attendee meeting accpetance status 'NULL' color should be 'medium'", async (done: DoneFn) => {
      component.meetingDetails.attendeeList = [meetingDetails.attendeeList[0]];
      fixture.detectChanges();
      let presnt = fixture.debugElement.nativeElement.querySelector(
        ".meetingInviteAcceptDecline"
      );
      fixture.whenStable().then(() => {
        expect(presnt.color).toBe("medium");
        done();
      });
    });
    // it("#02. attendee meeting accpetance status 'Present' color should be 'success'", async (done: DoneFn) => {
    //   component.meetingDetails.attendeeList = [meetingDetails.attendeeList[2]];
    //   fixture.detectChanges();
    //   let presnt = fixture.debugElement.nativeElement.querySelector(
    //     ".meetingInviteAcceptDecline"
    //   );
    //   fixture.whenStable().then(() => {
    //     expect(presnt.color).toBe("success");
    //     done();
    //   });
    // });
    // it("#03. attendee meeting accpetance status 'Absent' color should be 'danger'", async (done: DoneFn) => {
    //   component.meetingDetails.attendeeList = [meetingDetails.attendeeList[1]];
    //   fixture.detectChanges();
    //   let presnt = fixture.debugElement.nativeElement.querySelector(
    //     ".meetingInviteAcceptDecline"
    //   );
    //   fixture.whenStable().then(() => {
    //     expect(presnt.color).toBe("danger");
    //     done();
    //   });
    // });
  });
});
