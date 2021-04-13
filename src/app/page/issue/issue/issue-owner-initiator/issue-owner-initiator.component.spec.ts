import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IssueOwnerInitiatorComponent } from './issue-owner-initiator.component';

describe('IssueOwnerInitiatorComponent', () => {
  let component: IssueOwnerInitiatorComponent;
  let fixture: ComponentFixture<IssueOwnerInitiatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueOwnerInitiatorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IssueOwnerInitiatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
