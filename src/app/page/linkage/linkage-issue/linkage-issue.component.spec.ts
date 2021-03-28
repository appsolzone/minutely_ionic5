import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LinkageIssueComponent } from './linkage-issue.component';

describe('LinkageIssueComponent', () => {
  let component: LinkageIssueComponent;
  let fixture: ComponentFixture<LinkageIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkageIssueComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkageIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
