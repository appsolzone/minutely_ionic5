import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeamActivitiesPage } from './team-activities.page';

describe('TeamActivitiesPage', () => {
  let component: TeamActivitiesPage;
  let fixture: ComponentFixture<TeamActivitiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamActivitiesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamActivitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
