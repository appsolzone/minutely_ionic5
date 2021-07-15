import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from "@ionic/angular";
import { newMeetingMockData } from "src/app/mock-data/meetings";

import { MeetingAgendaNoteEditComponent } from "./meeting-agenda-note-edit.component";

describe("MeetingAgendaNoteEditComponent", () => {
  let component: MeetingAgendaNoteEditComponent;
  let fixture: ComponentFixture<MeetingAgendaNoteEditComponent>;
  let meetingDetails = newMeetingMockData;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingAgendaNoteEditComponent],
      imports: [IonicModule.forRoot(), RouterTestingModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MeetingAgendaNoteEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it("CREATED AGENDA NOTE EDIT COMPONENT", (done: DoneFn) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
      done();
    });
  });

  describe("AGENDA AND NOTES FIELD AUTO GROWABLE", () => {
    let agendaField: any;
    let noteField: any;
    beforeEach(() => {
      component.meetingDetails = meetingDetails;
    });

    it("#01. agenda field has auto growable attribute and value = true", async (done: DoneFn) => {
      fixture.detectChanges();
      agendaField =
        fixture.debugElement.nativeElement.querySelector(".agendaTextArea");
      // console.log("3 agendafield DOM");
      // console.log(agendaField);
      fixture.whenStable().then(() => {
        expect(agendaField.autoGrow).toBeTruthy();
        done();
      });
    });
    it(" #02. note field has auto growable attribute and value = true", (done: DoneFn) => {
      fixture.detectChanges();
      noteField =
        fixture.debugElement.nativeElement.querySelector(".noteTextArea");
      fixture.whenStable().then(() => {
        expect(noteField.autoGrow).toBeTruthy();
        done();
      });
    });
  });
});
