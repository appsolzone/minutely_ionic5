import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskMitigationContingencyComponent } from './risk-mitigation-contingency.component';

describe('RiskMitigationContingencyComponent', () => {
  let component: RiskMitigationContingencyComponent;
  let fixture: ComponentFixture<RiskMitigationContingencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskMitigationContingencyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskMitigationContingencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
