import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskUserCommentsPage } from './task-user-comments.page';

describe('TaskUserCommentsPage', () => {
  let component: TaskUserCommentsPage;
  let fixture: ComponentFixture<TaskUserCommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskUserCommentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskUserCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
