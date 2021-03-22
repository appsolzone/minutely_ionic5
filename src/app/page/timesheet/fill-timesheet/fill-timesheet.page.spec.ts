import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FillTimesheetPage } from './fill-timesheet.page';

describe('FillTimesheetPage', () => {
  let component: FillTimesheetPage;
  let fixture: ComponentFixture<FillTimesheetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillTimesheetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FillTimesheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
