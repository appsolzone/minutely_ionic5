import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskUserCommentsPage } from './risk-user-comments.page';

describe('RiskUserCommentsPage', () => {
  let component: RiskUserCommentsPage;
  let fixture: ComponentFixture<RiskUserCommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskUserCommentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskUserCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
