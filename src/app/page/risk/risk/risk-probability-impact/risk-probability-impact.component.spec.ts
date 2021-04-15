import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskProbabilityImpactComponent } from './risk-probability-impact.component';

describe('RiskProbabilityImpactComponent', () => {
  let component: RiskProbabilityImpactComponent;
  let fixture: ComponentFixture<RiskProbabilityImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskProbabilityImpactComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskProbabilityImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
