import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeetingBasicInfoEditComponent } from './meeting-basic-info-edit.component';

describe('MeetingBasicInfoEditComponent', () => {
  let component: MeetingBasicInfoEditComponent;
  let fixture: ComponentFixture<MeetingBasicInfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingBasicInfoEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingBasicInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
