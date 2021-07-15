import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from "@ionic/angular";
import { doesNotReject } from "assert";
import * as moment from "moment";
import { browser } from "protractor";
import { Meeting } from "src/app/interface/meeting";
import {
  meetingDetailsMockData,
  newMeetingMockData,
} from "src/app/mock-data/meetings";
import { environment } from "src/environments/environment";

import { MeetingBasicInfoEditComponent } from "./meeting-basic-info-edit.component";

async function docCallALL() {
  return await document.querySelectorAll(".rmt");
}

describe("MeetingBasicInfoEditComponent", () => {
  let component: MeetingBasicInfoEditComponent;
  let fixture: ComponentFixture<MeetingBasicInfoEditComponent>;
  let meetingDetailsMock = newMeetingMockData;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingBasicInfoEditComponent],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFirestoreModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MeetingBasicInfoEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  // describe("MEETING-BASIC-INFO-EDIT COMPONENT INIT TESTING", async () => {
  //   beforeEach(async () => {});
  //   //  === componet init =====
  //   it("should [meeting-basic-info-edit] initiate", (done: DoneFn) => {
  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       expect(component).toBeTruthy();
  //       done();
  //     });
  //   });

  //   // === should init meeting details init function call
  //   it("meeting details can not be null ***1", async (done: DoneFn) => {
  //     component.minMeetingDate = moment().format("YYYY-MM-DD");
  //     component.defaultMaxDate = moment().add(5, "y").format("YYYY-MM-DD");
  //     component.meetingDetails = meetingDetailsMock;
  //     component.initialiseEdit();
  //     // console.log("**details**", component.meetingDetails);
  //     expect(component.meetingDetails).not.toBeUndefined();
  //     done();
  //   });
  // });

  // //=== does start date end date valid ===
  // describe("START AND END DATE TESTING [During meeting create]", async () => {
  //   let minMeetingDate = moment().format("YYYY-MM-DD");
  //   let defaultMaxDate = moment().add(5, "y").format("YYYY-MM-DD");
  //   let dayBeforeToday = moment().subtract(5, "d").format("YYYY-MM-DD");
  //   beforeEach(async () => {
  //     // default
  //     component.minMeetingDate = minMeetingDate;
  //     component.defaultMaxDate = defaultMaxDate;
  //     // meetingDetails
  //     component.meetingDetails = meetingDetailsMock;
  //     // refInformation
  //     component.refInformation = {};
  //     Object.assign(component.refInformation, meetingDetailsMock);
  //     component.refInformation.meetingStart = null;
  //     component.refInformation.meetingEnd = null;
  //     component.initialiseEdit();
  //   });

  //   it("#01 : default min date should be today", async () => {
  //     //console.log(component.minMeetingDate);
  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       expect(component.minMeetingDate).toBe(minMeetingDate);
  //     });
  //   });
  //   it("#02 : default max date should be next 5 year add", async () => {
  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       expect(component.defaultMaxDate).toBe(defaultMaxDate);
  //     });
  //   });

  //   // // date change function
  //   it(`#03 : meeting start date can't be less then today ${minMeetingDate} > ${dayBeforeToday}`, (done: DoneFn) => {
  //     component.meetingDetails.meetingStart = dayBeforeToday;
  //     component.dateChange().then((res) => {
  //       console.log(" after check #03", res);
  //       expect(res).toBe(false);
  //       done();
  //     });
  //   });
  //   it(`#05 : meeting end date cann't be less start date   ${dayBeforeToday} < ${minMeetingDate}`, (done: DoneFn) => {
  //     component.meetingDetails.meetingStart = minMeetingDate;
  //     component.meetingDetails.meetingEnd = dayBeforeToday;
  //     component.dateChange().then(async (res) => {
  //       console.log(" after check #05", res);
  //       expect(res).toBe(false);
  //       done();
  //     });
  //   });
  //   it(`#06 : meeting end date cann't be same start date   ${minMeetingDate} !== ${minMeetingDate}`, (done: DoneFn) => {
  //     component.meetingDetails.meetingStart = minMeetingDate;
  //     component.meetingDetails.meetingEnd = minMeetingDate;
  //     component.dateChange().then(async (res) => {
  //       console.log(" after check #06", res);
  //       expect(res).toBe(false);
  //       done();
  //     });
  //   });
  // });

  // describe("TAGS MEETING TESTING", () => {
  //   beforeEach(async () => {
  //     // meetingDetails
  //     component.meetingDetails = meetingDetailsMock;
  //   });
  //   // test insert empty tag in tag array
  //   it("#01 : String value should be added tags array", (done: DoneFn) => {
  //     component.meetingTag = "Important";
  //     const response = component.addTag();
  //     expect(response).toBe(true);
  //     done();
  //   });
  //   it("#02 : Empty string should not be add tags array", (done: DoneFn) => {
  //     component.meetingTag = "";
  //     const response = component.addTag();
  //     expect(response).toBe(false);
  //     done();
  //   });
  // });

  describe("RECURRING MEETING TESTING", () => {
    let allRadioButton: HTMLElement;
    let compiled: any;
    beforeEach(() => {
      component.meetingDetails = meetingDetailsMock;
      component.meetingDetails.isOccurence = true;
    });
    // test insert empty tag in tag array
    it("#01 : total number of occurence meeting event [1-30]", (done: DoneFn) => {
      let occurenceLength: number[] = component.noOfOccurenceOption;
      expect(occurenceLength[0]).toEqual(1);
      expect(occurenceLength[occurenceLength.length - 1]).toEqual(30);
      expect(occurenceLength.length).toBeLessThanOrEqual(30);
      done();
    });

    it("#02 : get the class element", (done: DoneFn) => {
      //let button = ;
    });
  });
});
