import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskProbabilityImpactEditPage } from './risk-probability-impact-edit.page';

describe('RiskProbabilityImpactEditPage', () => {
  let component: RiskProbabilityImpactEditPage;
  let fixture: ComponentFixture<RiskProbabilityImpactEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskProbabilityImpactEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskProbabilityImpactEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
