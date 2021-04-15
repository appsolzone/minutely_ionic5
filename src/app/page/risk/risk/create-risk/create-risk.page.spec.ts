import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateRiskPage } from './create-risk.page';

describe('CreateRiskPage', () => {
  let component: CreateRiskPage;
  let fixture: ComponentFixture<CreateRiskPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRiskPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRiskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
