import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivitySearchMobilePage } from './activity-search-mobile.page';

describe('ActivitySearchMobilePage', () => {
  let component: ActivitySearchMobilePage;
  let fixture: ComponentFixture<ActivitySearchMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySearchMobilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitySearchMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
