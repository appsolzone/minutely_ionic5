import { TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";

import { MeetingService } from "./meeting.service";

describe("MeetingService", () => {
  let service: MeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFirestoreModule,
      ],
    });
    service = TestBed.inject(MeetingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
