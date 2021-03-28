import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LinkageRiskComponent } from './linkage-risk.component';

describe('LinkageRiskComponent', () => {
  let component: LinkageRiskComponent;
  let fixture: ComponentFixture<LinkageRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkageRiskComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkageRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
