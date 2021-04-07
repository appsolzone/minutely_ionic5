import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskOwnerInitiatorEditPage } from './risk-owner-initiator-edit.page';

describe('RiskOwnerInitiatorEditPage', () => {
  let component: RiskOwnerInitiatorEditPage;
  let fixture: ComponentFixture<RiskOwnerInitiatorEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskOwnerInitiatorEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskOwnerInitiatorEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
