import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskMitigationContingencyEditComponent } from './risk-mitigation-contingency-edit.component';

describe('RiskMitigationContingencyEditComponent', () => {
  let component: RiskMitigationContingencyEditComponent;
  let fixture: ComponentFixture<RiskMitigationContingencyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskMitigationContingencyEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskMitigationContingencyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
