import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeetingAgendaNoteEditComponent } from './meeting-agenda-note-edit.component';

describe('MeetingAgendaNoteEditComponent', () => {
  let component: MeetingAgendaNoteEditComponent;
  let fixture: ComponentFixture<MeetingAgendaNoteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingAgendaNoteEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingAgendaNoteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
