import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IssueDetailsEditPage } from './issue-details-edit.page';

describe('IssueDetailsEditPage', () => {
  let component: IssueDetailsEditPage;
  let fixture: ComponentFixture<IssueDetailsEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueDetailsEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IssueDetailsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
