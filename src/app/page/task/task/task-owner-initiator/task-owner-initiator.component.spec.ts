import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskOwnerInitiatorComponent } from './task-owner-initiator.component';

describe('TaskOwnerInitiatorComponent', () => {
  let component: TaskOwnerInitiatorComponent;
  let fixture: ComponentFixture<TaskOwnerInitiatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskOwnerInitiatorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskOwnerInitiatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
