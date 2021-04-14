import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskBasicInfoEditPage } from './task-basic-info-edit.page';

describe('TaskBasicInfoEditPage', () => {
  let component: TaskBasicInfoEditPage;
  let fixture: ComponentFixture<TaskBasicInfoEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskBasicInfoEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskBasicInfoEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
