import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskPage } from './risk.page';

describe('RiskPage', () => {
  let component: RiskPage;
  let fixture: ComponentFixture<RiskPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
