import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskOwnerInitiatorEditPage } from './task-owner-initiator-edit.page';

describe('TaskOwnerInitiatorEditPage', () => {
  let component: TaskOwnerInitiatorEditPage;
  let fixture: ComponentFixture<TaskOwnerInitiatorEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskOwnerInitiatorEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskOwnerInitiatorEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
