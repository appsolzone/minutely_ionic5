import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskListPage } from './risk-list.page';

describe('RiskListPage', () => {
  let component: RiskListPage;
  let fixture: ComponentFixture<RiskListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
