import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageprofilePage } from './manageprofile.page';

describe('ManageprofilePage', () => {
  let component: ManageprofilePage;
  let fixture: ComponentFixture<ManageprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageprofilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
