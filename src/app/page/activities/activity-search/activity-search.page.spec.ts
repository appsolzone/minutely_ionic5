import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivitySearchPage } from './activity-search.page';

describe('ActivitySearchPage', () => {
  let component: ActivitySearchPage;
  let fixture: ComponentFixture<ActivitySearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitySearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
