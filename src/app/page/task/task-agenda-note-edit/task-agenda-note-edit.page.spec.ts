import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskAgendaNoteEditPage } from './task-agenda-note-edit.page';

describe('TaskAgendaNoteEditPage', () => {
  let component: TaskAgendaNoteEditPage;
  let fixture: ComponentFixture<TaskAgendaNoteEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskAgendaNoteEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskAgendaNoteEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
