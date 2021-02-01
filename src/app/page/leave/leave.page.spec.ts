import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeavePage } from './leave.page';

describe('LeavePage', () => {
  let component: LeavePage;
  let fixture: ComponentFixture<LeavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
