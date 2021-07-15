import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";

import { DatabaseService } from "./database.service";
// firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestoreModule } from "@angular/fire/firestore";

describe("DatabaseService", () => {
  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFirestoreModule,
      ],
    });
    service = TestBed.inject(DatabaseService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
