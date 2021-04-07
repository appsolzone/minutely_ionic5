import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskBasicInfoEditPage } from './risk-basic-info-edit.page';

describe('RiskBasicInfoEditPage', () => {
  let component: RiskBasicInfoEditPage;
  let fixture: ComponentFixture<RiskBasicInfoEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskBasicInfoEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskBasicInfoEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
