import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IssueBasicInfoEditComponent } from './issue-basic-info-edit.component';

describe('IssueBasicInfoEditComponent', () => {
  let component: IssueBasicInfoEditComponent;
  let fixture: ComponentFixture<IssueBasicInfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueBasicInfoEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IssueBasicInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
