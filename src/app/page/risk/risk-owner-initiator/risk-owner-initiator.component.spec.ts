import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskOwnerInitiatorComponent } from './risk-owner-initiator.component';

describe('RiskOwnerInitiatorComponent', () => {
  let component: RiskOwnerInitiatorComponent;
  let fixture: ComponentFixture<RiskOwnerInitiatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskOwnerInitiatorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskOwnerInitiatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
