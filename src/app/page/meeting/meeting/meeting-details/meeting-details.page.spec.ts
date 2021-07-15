import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from "@ionic/angular";

import { MeetingDetailsPage } from "./meeting-details.page";

describe("MeetingDetailsPage", () => {
  let component: MeetingDetailsPage;
  let fixture: ComponentFixture<MeetingDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingDetailsPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
