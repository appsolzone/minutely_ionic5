import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IssueOwnerInitiatorEditComponent } from './issue-owner-initiator-edit.component';

describe('IssueOwnerInitiatorEditComponent', () => {
  let component: IssueOwnerInitiatorEditComponent;
  let fixture: ComponentFixture<IssueOwnerInitiatorEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueOwnerInitiatorEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IssueOwnerInitiatorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
