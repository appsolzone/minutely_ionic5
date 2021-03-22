import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeamActivityStatsMobilePage } from './team-activity-stats-mobile.page';

describe('TeamActivityStatsMobilePage', () => {
  let component: TeamActivityStatsMobilePage;
  let fixture: ComponentFixture<TeamActivityStatsMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamActivityStatsMobilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamActivityStatsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
