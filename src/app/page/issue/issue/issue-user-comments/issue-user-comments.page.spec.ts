import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IssueUserCommentsPage } from './issue-user-comments.page';

describe('IssueUserCommentsPage', () => {
  let component: IssueUserCommentsPage;
  let fixture: ComponentFixture<IssueUserCommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueUserCommentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IssueUserCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
